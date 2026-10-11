// Adds a language label and copy button to every fenced code block.
document.querySelectorAll('div.highlighter-rouge').forEach(function (block) {
  var cls = Array.prototype.find.call(block.classList, function (c) { return c.indexOf('language-') === 0; });
  var lang = cls ? cls.slice(9) : '';
  var bar = document.createElement('div');
  bar.className = 'code-bar';
  var label = document.createElement('span');
  label.textContent = lang === 'plaintext' ? '' : lang;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Copy';
  btn.addEventListener('click', function () {
    var text = block.querySelector('code').innerText.replace(/\n$/, '');
    navigator.clipboard.writeText(text).then(function () {
      btn.textContent = 'Copied';
    }, function () {
      btn.textContent = 'Copy failed';
    }).then(function () {
      setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
    });
  });
  bar.append(label, btn);
  block.prepend(bar);
});

// Reading progress bar (posts only).
(function () {
  var bar = document.querySelector('.progress');
  if (!bar) return;
  function update() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  document.addEventListener('scroll', update, { passive: true });
  update();
})();
