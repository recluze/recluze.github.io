/* 351 Cache Simulator (p5.js)
 * Copyright ©2018 Justin Hsia.  All rights reserved.
 */
var canvas, msgbox, seed;
var inm, inC, inK, inE, inWH, inWM, inreplace, paramBox;  // parameter form inputs
var rAddr, wAddr, wData, simBox;                          // access form inputs
var hist;                                                 // history form inputs
var pButton, rButton, wButton, fButton;                   // form buttons
var loadHist, uButton, dButton;
var dispT, dispI, dispO, dispHit, dispMiss;  // table cells for displaying to user
var m, C, K, E, WH, WM;   // form values
var t, S, s, k, replace;  // other cache parameters
var msg = "";             // canvas message
var bg, colorC, colorM, colorH;  // color variables
const hoverSize = 16;     // size of hover text
const scaleC = 20;        // scale for sizing of cache
const scaleM = 20;        // scale for sizing of memory
const seedLen = 6;        // length of random seed string

// state and state constants
var state, activeSet, activeLine, activeLineNum, fifoup;
const INIT = 0, PARAMS_MEM = 1, PARAMS_CACHE = 2, PARAMS_ADDR = 3, READY = 4;
const ACCESS_ADDR = 5, ACCESS_TIO = 6, ACCESS_SET = 7, ACCESS_HIT = 8;
const ACCESS_MISS = 9, MISS_WB = 10, MISS_REPLACE = 11;
const ACCESS_WRITE = 12, ACCESS_UPDATE = 13, ACCESS_DATA = 14;

// history-related variables
var current = 0, histMove = false, histNum = 0;
var histArray = [];
var regex_r = /R\( *0x([0-9a-f]{2}) *\)/i;
var regex_w = /W\( *0x([0-9a-f]{2}) *, *0x([0-9a-f]{2}) *\)/i;
var regex_f = /cache flushed/i;

// vertical scroll bars
var vbarMem, vbarCache;
var vbarMemEnable, vbarCacheEnable;
const scrollSize = 16;
// memory and cache data
var mem, cache;

// track access results
var cacheH = 0, cacheM = 0, result = '';
var in_addr, in_data, adstr, dastr;
var explain, accessType;


/* Helper function to read all parameters from URL.
 * https://html-online.com/articles/get-url-parameters-javascript/ */
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

/* Helper function to get a specific parameter from URL.
 * Returns default value if not found.
 * https://html-online.com/articles/get-url-parameters-javascript/ */
function getUrlParam(parameter, defaultvalue){
  var urlparameter = defaultvalue;
  if (window.location.href.indexOf(parameter) > -1) {
    urlparameter = getUrlVars()[parameter];
  }
  return urlparameter;
}


/* The setup function (run once at the very beginning) */
function setup() {
  bg = color(230);
  colorC = color(226, 102, 26);  // orange
  colorM = color(51, 153, 126);  // turquoise
  colorH = color(255, 0, 0);     // red
  textFont('Courier New');
  inm = select('#inm');
  inC = select('#inC');
  inK = selectAll('.radioK');
  inE = selectAll('.radioE');
  inWH = select('#inWH');
  inWM = select('#inWM');
  inreplace = select('#inreplace');
  pButton = select('#paramButton');
  pButton.mousePressed(changeParams);
  paramBox = select('#paramBox');
  rAddr = select('#rAddr');
  wAddr = select('#wAddr');
  wData = select('#wData');
  simBox = select('#simBox');
  rButton = select('#readButton');
  rButton.mousePressed(readCache);
  wButton = select('#writeButton');
  wButton.mousePressed(writeCache);
  fButton = select('#flushButton');
  fButton.mousePressed(flushCache);
  dispT = select('#dispT');
  dispI = select('#dispI');
  dispO = select('#dispO');
  dispHit = select('#dispHit');
  dispMiss = select('#dispMiss');
  canvas = createCanvas(960, 400).parent(select('#p5canvas'));
  msgbox = select('#msgbox');
  msgbox.value('');
  hist = select('#hist');
  loadHist = select('#loadHist');
  loadHist.mousePressed(loadHistory);
  uButton = select('#upButton');
  uButton.mousePressed(histBack);
  dButton = select('#dnButton');
  dButton.mousePressed(histForward);
  reset(true);
  vbarCache = new VScrollbar(615-scrollSize, 0, scrollSize, height, scrollSize);
  vbarMem   = new VScrollbar(width-scrollSize, 0, scrollSize, height, scrollSize);
  // get seed from URL
  seed = getUrlParam('seed','cse351');
  if (seed.length != seedLen) {
    window.alert("Wrong seed string length (" + seed.length + " instead of " + seedLen + ") - using default seed \"cse351\".");
    seed = 'cse351';
  }
  console.log('seed = ' + seed);
}


/* Resets the simulator state when the system is generated or regenerated */
function reset( hist ) {
  state = INIT;
  msg = "Welcome to the UW CSE 351 Cache Simulator!\n";
  msg += "Select system parameters above and press the button to get started.\n\n";
  msg += "Initial memory values are randomly generated (append \"?seed=******\"\n";
  msg += "to the URL to specify a 6-character seed — uses default otherwise).\n\n";
  msg += "Only data requests of 1 byte can be made.\n";
  msg += "The cache starts 'cold' (i.e. all lines are invalid).\n\n";
  msg += "You can hover over any byte of data in the cache or memory\nto see its corresponding memory address.\n\n";
  msg += "The access history can be modified by editing or pasting and then\n";
  msg += "pressing \"Load\", or can be traversed using the ↑ and ↓ buttons.";
  vbarMemEnable = false;
  vbarCacheEnable = false;
  pButton.attribute('value','Generate System');
  // disable all cache access buttons
  disableAccessButtons(0);
  // reset address and cache performance displays
  dispT.html('&ndash;');
  dispI.html('&ndash;');
  dispO.html('&ndash;');
  dispHit.html('&ndash;');
  dispMiss.html('&ndash;');
  // clear access fields
  rAddr.value('');
  wAddr.value('');
  wData.value('');
  // reset access history, if specified 
  if ( hist ) {
    histArray = [];
    current = 0;
    updateHistory();
  }
}


/* Disable the appropriate buttons based on current action:
 *   accessType - 0 (none), 1 (read), 2 (write) */
function disableAccessButtons( accessType ) {
  (accessType == 1 ? rButton.attribute('value','Next') : rButton.attribute('disabled',''));
  (accessType == 2 ? wButton.attribute('value','Next') : wButton.attribute('disabled',''));
  fButton.attribute('disabled','');
  rAddr.attribute('disabled','');
  wAddr.attribute('disabled','');
  wData.attribute('disabled','');
  hist.attribute('disabled','');
  loadHist.attribute('disabled','');
  uButton.attribute('disabled','');
  dButton.attribute('disabled','');
}

/* Enable all buttons and reset their text values */
function enableAccessButtons( ) {
  rButton.attribute('value','Read')
  rButton.removeAttribute('disabled');
  wButton.attribute('value','Write');
  wButton.removeAttribute('disabled');
  fButton.removeAttribute('disabled');
  rAddr.removeAttribute('disabled');
  wAddr.removeAttribute('disabled');
  wData.removeAttribute('disabled');
  hist.removeAttribute('disabled');
  loadHist.removeAttribute('disabled');
  uButton.removeAttribute('disabled');
  dButton.removeAttribute('disabled');
}


/* The draw function runs in an infinite loop */
function draw() {
  background(bg);
  dispMsg(5, 25);
  if (state >= PARAMS_MEM)   { mem.display(); }
  if (state >= PARAMS_CACHE) { cache.display(); }
  if (vbarCacheEnable) { vbarCache.update(); vbarCache.display(); }
  if (vbarMemEnable)   { vbarMem.update();   vbarMem.display(); }
  if (state >= PARAMS_ADDR) { dispHit.html(cacheH); dispMiss.html(cacheM); }
}


/* helper function to display the contents of msg on the canvas */
function dispMsg( x, y ) {
  fill(0);
  noStroke();
  textSize(20);
  textAlign(LEFT);
  text(msg, x, y);
}




/* Checks validity of input fields when system is generated or regenerated */
function checkParams() {
  reset(!histMove);

  // convert text to integers
  m = int(inm.value());
  C = int(inC.value());
  WH = int(inWH.value());
  WM = int(inWM.value());
  replace = int(inreplace.value());
  E = 0;
  for (var i = 0; i < inE.length; i++)
    if (inE[i].elt.checked)
      E = int(inE[i].value());
  K = 0;
  for (var i = 0; i < inK.length; i++)
    if (inK[i].elt.checked)
      K = int(inK[i].value());

  // calculate other cache parameters
  k = int(log(K)/log(2));
  S = C/K/E;
  s = int(log(S)/log(2));
  t = m - s - k;
  
  if (C < E * K) {  // input check: cache size mismatch
    msgbox.value("ERROR: size mismatch C < E * K\n");
    return 1;
  }
  Math.seedrandom(seed);
  return 0;
}


/* Change system parameters and reinitialize the cache and memory.
 * State machine to allow for "Explain" mode.
 * Run when user clicks the "Reset System" button. */
function changeParams() {
  if ( state == PARAMS_MEM || state == PARAMS_CACHE || state == PARAMS_ADDR || !checkParams() ) {
    explain = paramBox.checked();
    switch (state) {
      case INIT:
        msg = m + "-bit addresses:\nPhysical memory holds " + pow(2,m) + " bytes\n";
        msg += "(addresses 0x" + toBase(0,16,ceil(m/4)) + " to 0x" + toBase(pow(2,m)-1,16,ceil(m/4)) + ")\n\n";
        msg += 'Values randomly generated with seed "' + seed + '".\n';
        // initialize memory
        mem = new Memory();
        // reset memory scroll bar
        vbarMemEnable = (mem.Mtop + mem.Mheight > height);
        vbarMem.spos = vbarMem.ypos;
        vbarMem.newspos = vbarMem.ypos;
        pButton.attribute('value','Next');
        msgbox.value("Press Next (left) to advance explanation.\n");
        state = PARAMS_MEM;
        if (!histMove && explain) break;
      case PARAMS_MEM:
        msg = "Block size\n = " + K + " bytes\nCache size\n = " + C + " bytes\n\n";
        msg += "So " + C/K + " lines\nin " + C/K/E + " sets\n(each set holds\n " + E + " lines)\n\n";
        msg += "Management bits:\n- Valid bit\n" + ( WH ? "- Dirty bit\n" : "") + "- Tag bit(s)\n"
        // initialize cache
        cache = new Cache();
        // reset cache scroll bar
        vbarCacheEnable =  (cache.Ctop + cache.Cheight > height);
        vbarCache.xpos = mem.x - scaleM*2.6 - scrollSize - 10;
        vbarCache.spos = vbarCache.ypos;
        vbarCache.newspos = vbarCache.ypos;
        state = PARAMS_CACHE;
        if (!histMove && explain) break;
      case PARAMS_CACHE:
        msg = "*Cache Access*\n\n";
        msg += "Offset width:\n = log_2(K)\n = " + k + " bits\n\n";
        msg += "Index width:\n = log_2(C/K/E)\n = " + s + " bits\n\n";
        msg += "Tag width:\n = m-s-k\n = " + t + " bits\n";
        // update address split display
        dispT.html( t > 0 ? toBase(0,2,t) : '' );
        dispI.html( s > 0 ? toBase(0,2,min(s,m-k)) : '' );
        dispO.html(toBase(0,2,k));
        cacheH = 0;
        cacheM = 0;
        state = PARAMS_ADDR;
        if (!histMove && explain) break;
      case PARAMS_ADDR:
        msg = "m = " + m + ", C = " + C + "\nK = " + K + ", E = " + E + "\n";
        msg += ( WH ? "Write back\n" : "Write through\n" ) + ( WM ? "Write-allocate\n" : "No write-allocate\n" );
        msg += "Eviction: " + ( replace ? ( replace == 1 ? "LRU\n" : "FIFO\n") : "Random\n" );

        msgbox.value("System Generated and Reset\n");
        pButton.attribute('value','Reset System');
        enableAccessButtons();  // enable cache access fields
        state = READY;
    }
  }
}


/*** HELPER FUNCTIONS FOR READ & WRITE STATE MACHINES ***/

/* update TIO values and highlight fields */
function tioBreakdown( ) {
  dispO.html(toBase(in_addr%K, 2, k));
  dispI.html( s > 0 ? toBase(int(in_addr/K) % S, 2, min(s, m-k)) : "" );
  dispT.html( t > 0 ? toBase(int(in_addr/K/S), 2, t) : "" );
  dispO.style('color','red');
  dispI.style('color','red');
  dispT.style('color','red');
  msgbox.value(msgbox.value() + "Split address into TIO breakdown.\n");
  msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
}

/* highlight the Index field and active set */
function highlightSet( ) {
  dispO.style('color','black');  // un-highlight Tag and Offset
  dispT.style('color','black');
  msgbox.value(msgbox.value() + "Checking Set " + int(in_addr/K)%S + "\n");
  msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
  activeSet = cache.sets[int(in_addr/K) % S];
  activeSet.setActive();
}

/* highlight the Tag field and check for Hit/Miss */
function accessOutcome( ) {
  dispI.style('color','black');  // un-highlight Index and active set
  activeSet.clearActive();
  dispT.style('color','red');  // highlight Tag
  // access the cache, hit/miss will be in stored in result
  msgbox.value(msgbox.value() + "Looking for Tag " + toBase(int(in_addr/K/S), 16, ceil(t/4)) + "... ");
  msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
  activeSet.checkSet(in_addr);  // checkSet() will highlight Cache Hit or Cache Miss
  histArray[histNum].result = result;
  if (!histMove) updateHistory();
}

/* select victim line */
function selectVictim( ) {
  activeLineNum = activeSet.chooseVictim();  // chooseVictim() will highlight chosen line
  activeLine = activeSet.lines[activeLineNum];
  if (replace == 2) {
    if (activeLine.V == 1) {
      for (var i = 0; i < E; i++)
        activeSet.used[i] = (i == activeLineNum ? 0 : activeSet.used[i]-1);
    }
    fifoup = true;
  }
}

/* check Dirty bit and write back to memory if necessary */
function writeBack( ) {
  activeLine.clearHighlight();  // un-highlight line, but highlight Dirty bit
  activeLine.lightD = 1;
  if (activeLine.D == 0) {
    msgbox.value(msgbox.value() + "Not dirty, so no need to write back to memory.\n");
    msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
  } else {
    msgbox.value(msgbox.value() + "Dirty, so ");
    activeLine.writeMem();
  }
}

/* update the replacement policy tracking */
function updateReplacement( ) {
  if (replace == 1) {
    activeSet.updateLRU(activeLineNum);
    activeSet.setActive();
    msgbox.value(msgbox.value() + "LRU statuses updated.\n");
    msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
  } else if (replace == 2) {
    activeSet.updateFIFO(activeLineNum);
    activeSet.setActive();
    msgbox.value(msgbox.value() + "FIFO statuses updated.\n");
    msgbox.elt.scrollTop = msgbox.elt.scrollHeight;

  }
}


/* Run when user clicks the "Read" button.
 * State machine to allow for "Explain" mode (explain).
 * Also used when moving through the History (histMove). */
function readCache( ) {
  explain = simBox.checked();
  switch (state) {
    case READY:
      mem.clearHighlight();
      cache.clearHighlight();
      fifoup = false;
      // convert text to integers
      in_addr = parseInt(rAddr.value(), 16);
      if ( isNaN(in_addr) ) {
        msgbox.value("ERROR: bad input Address (" + rAddr.value() + ")\n");
        return;
      } else if ( in_addr >= pow(2,m) || in_addr < 0 ) {
        msgbox.value("ERROR: input Address is out of range\n");
        return;
      }
      adstr = "0x" + toBase(in_addr, 16, ceil(m/4));
      msgbox.value("Read: " + adstr + "\n");
      disableAccessButtons(1);  // disable other buttons
      // Update histArray[] appropriately
      if (!histMove) {
        if (histArray.length > current) {  // we're not at end of history
          if (histArray[current].type != 'R' || histArray[current].addr != in_addr) {
            while (histArray.length > current) histArray.pop();  // remove future accesses (creating new history branch)
            histArray.push(new MemAccess( 'R', in_addr, 0, '?' ));
	  }
	} else {  // we are at end of history
          histArray.push(new MemAccess( 'R', in_addr, 0, '?' ));
	}
        updateHistory();  // indicator should be pointing to this read access
        histNum = current;
      }
      state = ACCESS_ADDR;
      if (!histMove && explain) break;
    case ACCESS_ADDR:
      tioBreakdown();  // update TIO values and highlight
      state = ACCESS_TIO;
      if (!histMove && explain) break;
    case ACCESS_TIO:
      highlightSet();  // highlight active set
      state = ACCESS_SET;
      if (!histMove && explain) break;
    case ACCESS_SET:
      accessOutcome();  // check for Hit/Miss
      state = (result == 'H' ? ACCESS_HIT : ACCESS_MISS);
      if (histMove || !explain) readCache();
      break;
    case ACCESS_MISS:
      dispT.style('color','black');  // un-highlight rest
      dispMiss.style('color','black');
      selectVictim();  // select victim line
      state = ((WH && activeLine.V == 1) ? MISS_WB : MISS_REPLACE);
      if (histMove || !explain) readCache();
      break;
    case MISS_WB:
      writeBack();  // check Dirty bit and write back to memory if necessary
      state = MISS_REPLACE;
      if (!histMove && explain) break;
    case MISS_REPLACE:
      activeLine.readMem(in_addr);
      state = ACCESS_UPDATE;
      if (!histMove && explain) break;
    case ACCESS_HIT:
      dispT.style('color','black');  // un-highlight rest
      dispHit.style('color','black');
      activeLine.clearHighlight();
    case ACCESS_UPDATE:
      updateReplacement();  // update replacement policy tracking
      state = ACCESS_DATA;
      if (!histMove && explain && replace != 0) break;
    case ACCESS_DATA:
      activeSet.clearActive();
      in_data = activeLine.readByte(in_addr % K);
      msgbox.value(msgbox.value() + "Data: 0x" + toBase(in_data, 16, 2) + "\n");
      msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
      if (!histMove) {
        current++;
        updateHistory();
      }
      enableAccessButtons();  // re-enable access buttons
      state = READY;
      break;
    default:
      msgbox.value(msgbox.value() + "Not implemented yet!\n");
      msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
  }
}

/* Run when user clicks the "Write" button.
 * State machine to allow for "Explain" mode (explain).
 * Also used when moving through the History (histMove). */
function writeCache( ) {
  explain = simBox.checked();
  switch (state) {
    case READY:
      mem.clearHighlight();
      cache.clearHighlight();
      fifoup = false;
      // convert text to integers
      in_addr = parseInt(wAddr.value(), 16);
      in_data = parseInt(wData.value(), 16);
      if ( isNaN(in_addr) ) {
        msgbox.value("ERROR: bad input Address (" + wAddr.value() + ")\n");
        return;
      } else if ( isNaN(in_data) || in_data < 0 ) {
        msgbox.value("ERROR: bad input Data (" + wData.value() + ")\n");
        return;
      } else if ( in_addr >= pow(2,m) || in_addr < 0 ) {
        msgbox.value("ERROR: input Address is out of range\n");
        return;
      }
      adstr = "0x" + toBase(in_addr, 16, ceil(m/4));
      dastr = "0x" + toBase(in_data, 16, 2);
      msgbox.value("Write: " + dastr + " at address " + adstr + "\n");
      disableAccessButtons(2);  // disable other buttons
      // Update histArray[] appropriately
      if (!histMove) {
        if (histArray.length > current) {  // we're not at end of history
          if (histArray[current].type != 'W' || histArray[current].addr != in_addr || histArray[current].data != in_data) {
            while (histArray.length > current) histArray.pop();  // remove future accesses (creating new history branch)
            histArray.push(new MemAccess( 'W', in_addr, in_data, '?' ));
	  }
	} else {  // we are at end of history
          histArray.push(new MemAccess( 'W', in_addr, in_data, '?' ));
	}
        updateHistory();  // indicator should be pointing to this write access
        histNum = current;
      }
      state = ACCESS_ADDR;
      if (!histMove && explain) break;
    case ACCESS_ADDR:
      tioBreakdown();  // update TIO values and highlight
      state = ACCESS_TIO;
      if (!histMove && explain) break;
    case ACCESS_TIO:
      highlightSet();  // highlight active set
      state = ACCESS_SET;
      if (!histMove && explain) break;
    case ACCESS_SET:
      accessOutcome();  // check for Hit/Miss
      state = (result == 'H' ? ACCESS_HIT : ACCESS_MISS);
      if (histMove || !explain) writeCache();
      break;
    case ACCESS_MISS:
      dispT.style('color','black');  // un-highlight rest
      dispMiss.style('color','black');
      state = ACCESS_DATA;  // no write-allocate
      if (WM) {  // bring in block if write-allocate
        msgbox.value(msgbox.value() + "Write-allocate: fetch block from Memory.\n");
        msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
        selectVictim();  // select victim line
        state = ((WH && activeLine.V == 1) ? MISS_WB : MISS_REPLACE);
      }
      if (histMove || !explain) writeCache();
      break;
    case MISS_WB:
      writeBack();  // check Dirty bit and write back to memory if necessary
      state = MISS_REPLACE;
      if (!histMove && explain) break;
    case MISS_REPLACE:
      activeLine.readMem(in_addr);
      state = ACCESS_UPDATE;
      if (!histMove && explain) break;
    case ACCESS_HIT:
      dispT.style('color','black');  // un-highlight rest
      dispHit.style('color','black');
      activeLine.clearHighlight();
    case ACCESS_UPDATE:
      updateReplacement();  // update replacement policy tracking
      state = ACCESS_DATA;
      if (!histMove && explain && replace != 0) break;
    case ACCESS_DATA:
      activeSet.clearActive();
      if (result == "M" && !WM) {  // write miss and no write-allocate
        mem.data[in_addr] = in_data;
        mem.highlight(in_addr, 3);
        msgbox.value(msgbox.value() + "No write-allocate: 0x" + toBase(in_data, 16, 2) + " written directly to Memory.\n");
        msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
      } else {
        activeLine.writeByte(in_addr % K, in_data);
      }
      if (!histMove) {
        current++;
        updateHistory();
      }
      enableAccessButtons();  // re-enable access buttons
      state = READY;
      break;
    default:
      msgbox.value(msgbox.value() + "Not implemented yet!\n");
      msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
  }
}


/* Run when user clicks the "Flush" button. */
function flushCache( ) {
  if (state == READY) {
    mem.clearHighlight();
    cache.clearHighlight();
    cache.flush();
    msgbox.value("Flushing Cache...\n");
    if (!histMove) {
      histArray.push(new MemAccess( 'F', 0, 0, '?' ));
      current++;
    }
    updateHistory();  // indicator should be pointing to this flush
  } 
}


/* Memory Access class for storing access history */
class MemAccess {
  constructor( type, addr, data, result ) {
    // width and height of bar
    this.type = type;      // access type: 'R', 'W', or 'F'
    this.addr = addr;      // access addr: converted from hex
    this.data = data;      // access data: converted from hex
    this.result = result;  // access result: 'H', 'M', or '?'
  }
}


/* Run this function to update the History textarea with data
 * from the histArray array */
function updateHistory( ) {
  hist.value('');
  for (var i = 0; i < histArray.length; i++) {
    hist.value(hist.value() + (i == current ? '> ' : '  '));
    switch (histArray[i].type) {
      case 'R':
        hist.value(hist.value() + 'R(0x' + toBase(histArray[i].addr, 16, 2) + ') = ' +
                   histArray[i].result + '\n');
        break;
      case 'W':
        hist.value(hist.value() + 'W(0x' + toBase(histArray[i].addr, 16, 2) + ', 0x' +
                   toBase(histArray[i].data, 16, 2) + ') = ' + histArray[i].result + '\n');
        break;
      case 'F':
        hist.value(hist.value() + 'Cache flushed\n');
        break;
      default:
        hist.value(hist.value() + 'Unknown access type\n');
    }
  }
  if (current == histArray.length) hist.value(hist.value() + '> ');
  hist.elt.scrollTop = hist.elt.scrollHeight;
}


/* Run when user clicks the "Load" button.
 * Parses the text in the history textarea and indicates if an error occurred.
 * Also parses for indicator '>' to set current step (uses last found). */
function loadHistory( ) {
  var histText = (hist.value()).split('\n');
  var temp = [];  // temp array of MemAccess while we check input
  msgbox.value('=== LOADING HISTORY ===\n');
  current = -1;
  for (var i = 0; i < histText.length; i++) {
    if (histText[i].length > 2) {
      // check for type of access via regex
      var access;
      var parseR = histText[i].match(regex_r);
      var parseW = histText[i].match(regex_w);
      var parseF = histText[i].match(regex_f);
      if (parseR == null && parseW == null && parseF == null) {
        msgbox.value(msgbox.value() + 'ERROR loading line ' + temp.length + ': ' + histText[i] + '\n');
        return;
      } else if (parseF) {
        access = new MemAccess( 'F', 0, 0, '?' );
      } else {
        // convert text to integers
        var parse = (parseW != null ? parseW : parseR);
        parse.push('00');  // tack on a dummy Data of 0 for reads
        in_addr = parseInt(parse[1], 16);
        in_data = parseInt(parse[2], 16);
        if ( isNaN(in_addr) ) {
          msgbox.value(msgbox.value() + "ERROR: bad input Address (" + parse[1] + ") on line " + temp.length + "\n");
          return;
        } else if ( in_addr >= pow(2,m) || in_addr < 0 ) {
          msgbox.value(msgbox.value() + "ERROR: input Address (" + parse[1] + ") is out of range on line " + temp.length + "\n");
          return;
        } else if ( isNaN(in_data) || in_data < 0 ) {
          msgbox.value(msgbox.value() + "ERROR: bad input Data (" + parse[2] + ") on line " + temp.length + "\n");
          return;
        }
        access = new MemAccess( parse[0].charAt(0).toUpperCase(), in_addr, in_data, '?' );
      }
      if (histText[i].includes('> ')) current = i;
      temp.push(access);
      msgbox.value(msgbox.value() + access.type + '(' + access.addr + ',' + access.data + ') = ' + access.result + '\n');
    }
  }
  histArray = temp;  // no errors in loading process, so make official
  if (current < 0) current = histArray.length;  // if no indicator found in history, go to end
  replayHistory();
}


/* Resets the simulation and runs through history from beginning to the current
 * access.  Helper function used by "Load", "↑", and "↓" buttons.
 * Uses variable histNum to differentiate from variable current. */
function replayHistory( ) {
  histMove = true;
  changeParams();  // reset cache and memory
  for (histNum = 0; histNum < current; histNum++) {
    switch (histArray[histNum].type) {
      case 'F':
        flushCache();
        break;
      case 'R':
        rAddr.value(toBase(histArray[histNum].addr, 16, 2));
        readCache();
        break;
      case 'W':
        wAddr.value(toBase(histArray[histNum].addr, 16, 2));
        wData.value(toBase(histArray[histNum].data, 16, 2));
        writeCache();
        break;
    }
  }
  histMove = false;
  // if currently pointing at an access (not executed yet), load that access into the input fields
  // this is useful so user can immediately replay the next step (with "Explain" turned on if desired)
  if (current < histArray.length) {  
    if (histArray[current].type == 'R') {
      rAddr.value(toBase(histArray[current].addr, 16, 2));
      wAddr.value('');
      wData.value('');
    } else if (histArray[current].type == 'W') {
      rAddr.value('');
      wAddr.value(toBase(histArray[current].addr, 16, 2));
      wData.value(toBase(histArray[current].data, 16, 2));
    }
  }
  updateHistory();
}

/* Run when user clicks the "↑" button. */
function histBack( ) {
  if (current > 0) {
    current--;
    replayHistory();
  }
}

/* Run when user clicks the "↓" button. */
function histForward( ) {
  if (current < histArray.length) {
    current++;
    replayHistory();
  }
}



/* Class to represent physical memory. */
class Memory {
  constructor( ) {
    this.Mtop = scaleM;  // initial y of top of memory
    this.Mheight = 1.5*pow(2, m - 3)*scaleM;  // height of memory when drawn out
    this.Mwidth = scaleM*xwidth(2)*8 + 2;  // width of memory when drawn out
    this.x = width - this.Mwidth - scrollSize - 10;
    this.data = [];  // data stored in memory
    this.light = [];  // indicate highlighting for moved/changed data
    for (var i = 0; i < pow(2, m); i++) {
      this.data[i] = floor(Math.random()*256);  // randomize the initial memory
      this.light[i] = 0;                 // nothing starts highlighted
    }
  }

  // highlighting:  0 - no highlight, 1 - background, 2 - background + text
  highlight( addr, light ) { this.light[addr] = light; } 
  clearHighlight( ) { for (var i = 0; i < this.light.length; i++) this.light[i] = 0; }

  display( ) {
    var x = this.x;
    var offset = 0;
    if (vbarMemEnable)
      offset = -(this.Mheight + 2*this.Mtop - height) * vbarMem.getPos();
    for (var i = 0; i < pow(2,m-3); i++) {
      var y = offset + scaleM*(1 + 6*i)/4 + this.Mtop;
      var ytext = y + 0.85*scaleM;
      // label word/row
      textSize(scaleM*0.8);
      textAlign(RIGHT);
      noStroke();
      fill(colorM);
      text("0x" + toBase(8*i,16,ceil(m/4)), x-2, ytext);

      textSize(scaleM);
      // memory boxes
      stroke(0);
      for (var j = 0; j < 8; j++) {
        switch (this.light[8*i+j]) {
          case 0: noFill(); break;
          case 1: fill(red(colorC), green(colorC), blue(colorC), 100); break;
          case 2:
          case 3: fill(red(colorM), green(colorM), blue(colorM), 100); break;
        }
        rect(x + scaleM*xwidth(2)*j, y, scaleM*xwidth(2), scaleM);
      }
      // memory text
      fill(0);
      textAlign(CENTER);
      for (var j = 0; j < 8; j++) {
        fill(this.light[8*i+j] == 3 ? colorH : 0);
        text(toBase(this.data[8*i+j], 16, 2), x + scaleM*xwidth(2)*(j+0.5), ytext);
      }
      // hover text
      if ( mouseY > y && mouseY < y+scaleM && mouseX > x && mouseX < x+scaleM*xwidth(2)*8 ) {
        var idx = int( (mouseX - x) / xwidth(2) / scaleM );
        textSize(hoverSize);
        fill(colorH);
        noStroke();
        text("0x" + (8*i+idx).toString(16), mouseX, mouseY);
      }
    }
    noStroke();
    fill(bg);
    rect(x, 0, this.Mwidth, this.Mtop);  // background for header
    rect(x, 0, -scaleM*2.6, this.Mtop);  // cover row address
    fill(colorM);
    stroke(colorM);
    textSize(scaleM);
    textAlign(CENTER);
    text("Physical Memory", x + this.Mwidth/2, 0.85*scaleM);  // mem label
  }
}


/* Class to represent a cache (S cache sets). */
class Cache {
  constructor( ) {
    this.Ctop = scaleC;  // initial y of top of cache
    this.Cheight = S * 1.5*E*scaleC;  // height of cache when drawn out
    this.sets = [];  // sets in the cache
    for (var i = 0; i < S; i++)
      this.sets[i] = new CacheSet();
    this.Cwidth = this.sets[0].width + 2;  // width of cache when drawn out
    this.x = vbarCache.xpos - 10 - this.Cwidth;
  }

  flush( ) {
    for (var i = 0; i < S; i++)
      this.sets[i].flush();
  }

  clearHighlight( ) { for (var i = 0; i < S; i++) this.sets[i].clearHighlight(); }

  display( ) {
    var x = this.x;
    var offset = 0;
    if (vbarCacheEnable)
      offset = -(this.Cheight + 2*this.Ctop - height) * vbarCache.getPos();
    for (var i = 0; i < S; i++) {
      textSize(scaleC*0.8);
      textAlign(RIGHT);
      noStroke();
      fill(colorC);
      text("Set " + i, x-2, this.Ctop + offset + 1.5*E*scaleC*i + scaleC*(0.75*E+0.35));
      this.sets[i].display(x, this.Ctop + offset + 1.5*E*scaleC*i);
    }
    noStroke();
    fill(bg);
    rect(x, 0, this.Cwidth, this.Ctop);  // background for header
    rect(x, 0, -scaleC*3.0, this.Ctop);  // cover set numbers
    fill(colorC);
    stroke(colorC);
    textSize(scaleC);
    textAlign(CENTER);
    var ytext = 0.85*scaleC;
    text("V", x + scaleC*(0.5 + xwidth(1)*0.5), ytext);  // valid
    if (WH == 1)
      text("D", x + scaleC*(0.5 + xwidth(1)*1.5), ytext);  // dirty
    if (t > 0) {
      var xt = x + scaleC*(0.5 + xwidth(1)*(1+WH));
      text("T", xt + scaleC*xwidth(ceil(t/4))*0.5, ytext);  // tag
    }
    var xb = x + scaleC*(xwidth(1)*(1+WH) + xwidth(t < 1 ? 0 : ceil(t/4)));
    textAlign(LEFT);
    text( "Cache Data", xb + scaleC, ytext);  // data
  }
}


/* Class to represent a cache set (E cache lines).
 * This is where most of the cache policies are handled. */
class CacheSet {
  constructor( ) {
    this.lines = [];  // lines in this set
    for (var i = 0; i < E; i++)
      this.lines[i] = new CacheLine();
    // width for drawing
    this.width = scaleC*(xwidth(1)*(1+WH) + xwidth(t < 1 ? 0 : ceil(t/4)) + xwidth(2)*K + 1);
    // is this the set of interest for this access? (affects display)
    this.active = 0;
    // replacement policy:  0 = random, 1 = LRU
    this.used = [];
    if ( replace > 0 )
      for (var i = 0; i < E; i++ )
        this.used[i] = (replace == 1 ? E - i : 0);  // LRU: replace Block 0 first, FIFO: all zeros
  }
  // INCOMPLETE
  updateFIFO ( linenum ) {
    if (fifoup) {
      this.used[linenum] = Math.max.apply(null, this.used) + 1;
    }
  }

  updateLRU( linenum ) {
    var old = this.used[linenum];
    for (var i = 0; i < E; i++)
      this.used[i] += (this.used[i] < old) ? 1 : 0;
    this.used[linenum] = 1;
  }

  chooseVictim( ) {
    var victim;
    for (victim = 0; victim < E; victim++)  // first fill invalid lines
      if (this.lines[victim].V == 0) {
        msgbox.value(msgbox.value() + "Invalid Line " + victim + " chosen for replacement.\n");
        msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
        this.lines[victim].lightV = 1;
        fifoup = true;  // for FIFO replacement updates
        return victim;
      }
    if (replace == 0) {         // random replacement
      victim = floor(random(0,E));
      msgbox.value(msgbox.value() + "Line " + victim + " randomly chosen for replacement.\n");
    } else if (replace == 1) {  // LRU replacement
      victim = this.used.indexOf(E);
      msgbox.value(msgbox.value() + "Line " + victim + " is the least recently used.\n");
    } else if (replace == 2) {  // FIFO replacement
      victim = this.used.indexOf(1);
      msgbox.value(msgbox.value() + "Line " + victim + " is the first placed.\n");
    }
    msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
    this.lines[victim].highlightData();
    return victim;
  }

  checkSet( addr ) {
    var T = int(addr/K/S);  // tag value of addr
    for (var i = 0; i < E; i++)
      if (this.lines[i].V == 1 && this.lines[i].T == T) {
        activeLine = this.lines[i];
        activeLine.lightV = 1;
        activeLine.lightT = 1;
        cacheH += 1;  result = "H";  // record hit
        activeLineNum = i;
        msgbox.value(msgbox.value() + "HIT in Line " + i + "!\n");
        msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
        dispHit.style('color','red');
        return;
      }
    cacheM += 1;  result = "M";  // record miss
    msgbox.value(msgbox.value() + "MISS!\n");
    msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
    dispMiss.style('color','red');
  }

  flush( ) {
    for (var i = 0; i < E; i++) {
      this.lines[i].invalidate();
      if (replace > 0) this.used[i] = (replace == 1 ? E-i : 0);  // reset replacement policy
    }
  }

  setActive( ) { this.active = 1; }
  clearActive( ) { this.active = 0; }
  clearHighlight( ) { for (var i = 0; i < E; i++) this.lines[i].clearHighlight(); }

  display( x, y ) {
    stroke(colorC);  // orange set outline
    (this.active ? fill(255, 0, 0, 50) : noFill());
    rect(x, y, this.width, 1.5*scaleC*E);
    for (var i = 0; i < E; i++) {
      this.lines[i].display(x+0.5*scaleC, y+scaleC*(1+6*i)/4);
      if (replace != 0) {
        textSize(12);
        fill(colorC);
        noStroke();
        text(this.used[i], x + this.width + 0.3*scaleC, y+scaleC*(2+3*i)/2);
      }
    }
  }
}


/* Class to represent a cache line (block + management bits) */
class CacheLine {
  constructor( ) {
    this.V = 0;       // valid bit value
    this.D = WH - 1;  // -1 means don't use dirty bit (write through)
    this.T = 0;       // tag value
    this.addr = -1;   // address of beginning of block (-1 is dummy addr)
    this.block = [];  // data in the cache block
    this.light = [];  // indicate highlighting for moved/changed data
    for (var i = 0; i < K; i++) {
      this.block[i] = 0;
      this.light[i] = 0;
    }
    this.lightV = 0;
    this.lightD = 0;
    this.lightT = 0;
  }

  invalidate() {
    if (this.D == 1) this.writeMem();
    this.V = 0;
    this.lightV = 1;
  }

  readMem( addr ) {
    this.addr = int(addr/K)*K;  // store address of beginning of block
    this.T = int(addr/K/S);
    this.lightT = 1;
    for (var i = 0; i < K; i++) {
      this.block[i] = mem.data[this.addr+i];
      mem.highlight(this.addr+i, 1);
      this.light[i] = 1;
    }
    this.lightV = !this.V;  // only highlight if it was previously invalid
    this.V = 1;
    msgbox.value(msgbox.value() + "Block read into cache from memory at address 0x" + toBase(this.addr, 16, 1) + ".\n");
    msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
  }

  writeMem( ) {
    for (var i = 0; i < K; i++) {
      mem.highlight(this.addr+i, mem.data[this.addr+i] == this.block[i] ? 2 : 3);
      mem.data[this.addr+i] = this.block[i];
    }
    this.D = this.D < 0 ? -1 : 0;
    this.lightD = 1;
    msgbox.value(msgbox.value() + "block written to memory at address 0x" + toBase(this.addr, 16, 1) + ".\n");
    msgbox.elt.scrollTop = msgbox.elt.scrollHeight;
  }

  readByte( addr ) {
    this.light[addr%K] = 2;
    return this.block[addr%K];
  }

  writeByte( addr, data ) {
    this.block[addr%K] = data;
    this.light[addr%K] = 2;
    if (this.D < 0) {
      msgbox.value(msgbox.value() + "Write through: ");
      this.writeMem(this.addr);  // write through to Mem
    } else {
      msgbox.value(msgbox.value() + "Write back: set Dirty bit.");
      this.D = 1;  // set dirty bit
      this.lightD = 1;
    }
  }

  highlightData( ) { for (var i = 0; i < K; i++) this.light[i] = 1; }
  highlightAll( ) {
    this.lightV = 1;
    this.lightD = 1;
    this.lightT = 1;
    this.highlightData();
  }

  clearHighlight( ) {
    for (var i = 0; i < K; i++) this.light[i] = 0;
    this.lightV = 0;
    this.lightD = 0;
    this.lightT = 0;
  }

  display( x, y ) {
    var d = this.D < 0 ? 0 : 1;
    textSize(scaleC);
    // cache block boxes
    var xt = x + scaleC*xwidth(1)*(1+d);
    var xb = x + scaleC*(xwidth(1)*(1+d) + xwidth(t < 1 ? 0 : ceil(t/4)));
    stroke(0);
    ( this.lightV ? fill(red(colorC), green(colorC), blue(colorC), 100) : noFill() );
    rect(x, y, scaleC*xwidth(1), scaleC);  // valid
    if (d == 1) {
      ( this.lightD ? fill(red(colorC), green(colorC), blue(colorC), 100) : noFill() );
      rect(x+scaleC*xwidth(1), y, scaleC*xwidth(1), scaleC);  // dirty
    }
    if (t > 0) {
      ( this.lightT ? fill(red(colorC), green(colorC), blue(colorC), 100) : noFill() );
      rect(xt, y, scaleC*xwidth(ceil(t/4)), scaleC);  // tag
    }
    for (var i = 0; i < K; i++) {
      ( this.light[i] > 0 ? fill(red(colorC), green(colorC), blue(colorC), 100) : noFill() );
      rect(xb + scaleC*xwidth(2)*i, y, scaleC*xwidth(2), scaleC);  // data
    }

    // cache block text
    var ytext = y + 0.85*scaleC;
    textAlign(CENTER);
    fill( this.lightV ? colorH : 0 );
    text(this.V, x+scaleC*xwidth(1)*0.5, ytext);  // valid
    if (d == 1) {
      fill( this.lightD ? colorH : 0 );
      text(this.D, x+scaleC*xwidth(1)*1.5, ytext);  // dirty
    }
    if (t > 0) {
      var tagText = "";
      if (this.V)
        tagText = toBase(this.T, 16, ceil(t/4));
      else
        for (var i = 0; i < ceil(t/4); i++) tagText += "-";
      fill( this.lightT ? colorH : 0 );
      text(tagText, xt + scaleC*xwidth(ceil(t/4))*0.5, ytext);  // tag
    }
    for (var i = 0; i < K; i++) {
      fill( this.light[i] > 1 ? colorH : 0 );
      text( this.V ? toBase(this.block[i], 16, 2) : "--", xb + scaleC*xwidth(2)*(i+0.5), ytext);  // data
    }

    // hover text
    if ( this.V && mouseY > y && mouseY < y + scaleC && mouseX > xb && mouseX < xb + scaleC*xwidth(2)*K ) {
      var idx = int( (mouseX - xb) / xwidth(2) / scaleC );
      textSize(hoverSize);
      fill(colorH);
      noStroke();
      text("0x" + (this.addr + idx).toString(16), mouseX, mouseY);
    }
  }
}


/* Helper function for determining width of boxes for cache and mem. */
function xwidth(w) { return 0.2 + 0.7*w; }


/* Helper function that prints d in base b, padded out to padding digits. */
function toBase(d, b, padding) {
  var out = Number(d).toString(b);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
  while (out.length < padding)
    out = "0" + out;
  return out;
}


/* Vertical Scroll Bar class.
 * based on:  https://processing.org/examples/scrollbar.html */
class VScrollbar {
  constructor( xp, yp, sw, sh, l) {
    // width and height of bar
    this.swidth = sw;
    this.sheight = sh;
    // x- and y-position of bar
    this.xpos = xp;
    this.ypos = yp;
    // y-position of slider (start at top)
    this.spos = yp;
    this.newspos = this.spos;
    // max and min values of slider
    this.sposMin = yp;
    this.sposMax = yp + sh - sw;
    // how loose/heavy
    this.loose = l;
    // status of mouse and slider
    this.over = false;
    this.locked = false;
  }

  update() {
    this.over = this.overEvent();
    if (mouseIsPressed && this.over) {
      this.locked = true;
    }
    if (!mouseIsPressed) {
      this.locked = false;
    }
    if (this.locked) {
      this.newspos = this.constrain(mouseY-this.swidth/2, this.sposMin, this.sposMax);
    }
    if (abs(this.newspos - this.spos) > 1) {
      this.spos = this.spos + (this.newspos-this.spos)/this.loose;
    }
  }

  constrain( val, minv, maxv) { return min(max(val, minv), maxv); }

  overEvent() {
    return (mouseX > this.xpos && mouseX < this.xpos+this.swidth &&
            mouseY > this.ypos && mouseY < this.ypos+this.sheight);
  }

  display() {
    noStroke();
    // draw slide track
    fill(0, 0, 0, 50);  // transparent black
    rect(this.xpos, this.ypos, this.swidth, this.sheight);

    // draw slider
    fill( (this.over || this.locked) ? 50 : 160 );
    rect(this.xpos, this.spos, this.swidth, this.swidth);

    // stripes
    stroke(0);
    line(this.xpos+0.2*this.swidth, this.spos+0.25*this.swidth, this.xpos+0.8*this.swidth, this.spos+0.25*this.swidth);
    line(this.xpos+0.2*this.swidth, this.spos+ 0.5*this.swidth, this.xpos+0.8*this.swidth, this.spos+ 0.5*this.swidth);
    line(this.xpos+0.2*this.swidth, this.spos+0.75*this.swidth, this.xpos+0.8*this.swidth, this.spos+0.75*this.swidth);
  }

  // return spos as percentage of bar height
  getPos() { return (this.spos - this.sposMin)/(this.sposMax - this.sposMin); }
}

