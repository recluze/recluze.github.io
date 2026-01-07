let pc = 0;
let previousPc = 0;
let ir = 'NIL';
let accumulator = 0;
let ram = [
    { address: 0, type: 'instruction', value: 'LOAD 6' },
    { address: 1, type: 'instruction', value: 'ADD 7' },
    { address: 2, type: 'instruction', value: 'STORE 6' },
    { address: 3, type: 'instruction', value: 'JUMP 1' },
    { address: 4, type: 'data', value: '0' },
    { address: 5, type: 'data', value: '0' },
    { address: 6, type: 'data', value: '1' },
    { address: 7, type: 'data', value: '1' },
];
let previousRam = ram.map(item => ({ ...item }));
let executionPhase = 'Fetch';
let currentMode = 'display';
let hasChanges = false;
let editingControlsEnabled = true;
let executionMode = 'manual'; // 'manual' or 'auto'
let autoInterval = null;
let isAutoRunning = false;
let isPaused = false;
let currentIntervalMs = 0;
let targetIntervalMs = 0;
let accelerationSteps = 10; // Number of steps to reach target speed
let shouldAnimateChanges = false; // Flag to control when animations should trigger
let currentError = null; // Track current execution error
let validationErrors = new Map(); // Track validation errors per row: Map<rowIndex, errorMessage>

const instructions = ['LOAD', 'ADD', 'STORE', 'JUMP'];

// Validation helper functions
function isValidNumber(value) {
    if (value === null || value === undefined || value === '') {
        return false;
    }
    const trimmed = String(value).trim();
    if (trimmed === '') {
        return false;
    }
    // Check if it's a valid number (including negative numbers)
    const num = Number(trimmed);
    return !isNaN(num) && isFinite(num) && /^-?\d+$/.test(trimmed);
}

function validateDataValue(value) {
    if (!isValidNumber(value)) {
        return 'Data value must be a valid integer number (e.g., 0, 42, -5)';
    }
    return null;
}

function validateInstructionOperand(operand, instruction) {
    if (!operand || operand.trim() === '') {
        return `${instruction} instruction requires an address operand`;
    }
    
    if (!isValidNumber(operand)) {
        return `Operand must be a valid integer (address). Found: '${operand}'`;
    }
    
    const address = parseInt(operand);
    if (address < 0 || address >= ram.length) {
        return `Address ${address} is out of bounds. Valid addresses: 0-${ram.length - 1}`;
    }
    
    return null;
}

function validateRow(rowIndex) {
    const item = ram[rowIndex];
    if (!item) return null;
    
    if (item.type === 'data') {
        return validateDataValue(item.value);
    } else if (item.type === 'instruction') {
        const [instruction, operand] = item.value.split(' ');
        return validateInstructionOperand(operand, instruction);
    }
    
    return null;
}

function updateDisplay() {
    const pcElement = document.getElementById('pc');
    
    // Check if PC has changed and trigger electric animation
    if (pc !== previousPc) {
        pcElement.classList.remove('electric-active');
        // Force reflow to restart animation
        void pcElement.offsetWidth;
        pcElement.classList.add('electric-active');
        
        // Remove the class after animation completes
        setTimeout(() => {
            pcElement.classList.remove('electric-active');
        }, 1200);
        
        previousPc = pc;
    }
    
    pcElement.textContent = pc;
    document.getElementById('ir').textContent = ir;
    document.getElementById('accumulator').textContent = accumulator;

    const phases = document.getElementById('execution-phases').children;
    for (const element of phases) {
        element.classList.remove('active-phase');
        const phaseText = element.getAttribute('data-phase');
        element.childNodes[0].textContent = phaseText;
    }
    const activePhase = Array.from(phases).find(phase => phase.getAttribute('data-phase') === executionPhase);
    activePhase.classList.add('active-phase');
    activePhase.childNodes[0].textContent = '► ' + executionPhase;

    updateRAMTable();
    updateTooltips();
}

function addRow() {
    const newAddress = ram.length;
    ram.push({
        address: newAddress,
        type: 'data',
        value: '0'
    });
    hasChanges = true;
    updateDisplay();
}

function cancelChanges() {
    // Restore RAM from previousRam
    ram = previousRam.map(item => ({ ...item }));
    
    // Adjust PC if it's pointing beyond the restored RAM size
    if (pc >= ram.length) {
        pc = ram.length - 1;
    }
    
    hasChanges = false;
    
    // Exit edit mode and return to display mode
    toggleMode();
}

function removeRow(address) {
    if (ram.length <= 1) {
        alert('Cannot remove the last row');
        return;
    }
    
    // Remove the row
    ram = ram.filter(item => item.address !== address);
    
    // Reindex addresses
    ram.forEach((item, index) => {
        item.address = index;
    });
    
    // Adjust PC if it's pointing beyond the new RAM size
    if (pc >= ram.length) {
        pc = ram.length - 1;
    }
    
    hasChanges = true;
    updateDisplay();
    
    // Trigger validation to check for newly invalid address references
    if (currentMode === 'edit') {
        setTimeout(() => validateInputOnChange(), 100);
    }
}

function updateRAMTable() {
    const ramTable = document.getElementById('ram-table').getElementsByTagName('tbody')[0];
    ramTable.innerHTML = '';
    for (const item of ram) {
        const row = ramTable.insertRow();
        row.insertCell(0).textContent = item.address;
        
        // Type column
        const typeCell = row.insertCell(1);
        if (currentMode === 'edit') {
            const typeSelect = document.createElement('select');
            typeSelect.className = 'select';
            
            const instructionOption = document.createElement('option');
            instructionOption.value = 'instruction';
            instructionOption.textContent = 'Instruction';
            instructionOption.selected = item.type === 'instruction';
            
            const dataOption = document.createElement('option');
            dataOption.value = 'data';
            dataOption.textContent = 'Data';
            dataOption.selected = item.type === 'data';
            
            typeSelect.appendChild(instructionOption);
            typeSelect.appendChild(dataOption);
            typeSelect.onchange = () => {
                // Rebuild only the value cell when type changes
                const valueCell = row.cells[2];
                valueCell.innerHTML = '';
                const currentType = typeSelect.value;
                if (currentType === 'instruction') {
                    const [instruction, operand] = item.value.split(' ');
                    const select = document.createElement('select');
                    select.className = 'select';
                    instructions.forEach(instr => {
                        const option = document.createElement('option');
                        option.value = instr;
                        option.textContent = instr;
                        option.selected = instr === instruction;
                        select.appendChild(option);
                    });
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = operand || '';
                    input.placeholder = 'Address';
                    input.setAttribute('data-validate', 'operand');
                    select.onchange = () => checkForChanges();
                    input.oninput = () => {
                        checkForChanges();
                        validateInputOnChange();
                    };
                    valueCell.appendChild(select);
                    valueCell.appendChild(input);
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = item.value || '0';
                    input.placeholder = 'Number';
                    input.setAttribute('data-validate', 'data');
                    input.oninput = () => {
                        checkForChanges();
                        validateInputOnChange();
                    };
                    valueCell.appendChild(input);
                }
                checkForChanges();
            };
            
            typeCell.appendChild(typeSelect);
        } else {
            typeCell.textContent = item.type === 'instruction' ? 'Instruction' : 'Data';
            typeCell.className = item.type === 'instruction' ? 'type-instruction' : 'type-data';
        }
        
        // Value column
        if (currentMode === 'edit') {
            const valueCell = row.insertCell(2);
            
            // Get the current type from the type select dropdown
            const typeSelect = row.cells[1].getElementsByTagName('select')[0];
            const currentType = typeSelect ? typeSelect.value : item.type;
            
            if (currentType === 'instruction') {
                // For instructions: show dropdown + input
                const [instruction, operand] = item.value.split(' ');
                
                const select = document.createElement('select');
                select.className = 'select';
                instructions.forEach(instr => {
                    const option = document.createElement('option');
                    option.value = instr;
                    option.textContent = instr;
                    option.selected = instr === instruction;
                    select.appendChild(option);
                });
                
                const input = document.createElement('input');
                input.type = 'text';
                input.value = operand || '';
                input.placeholder = 'Address';
                input.setAttribute('data-validate', 'operand');
                
                select.onchange = () => checkForChanges();
                input.oninput = () => {
                    checkForChanges();
                    validateInputOnChange();
                };
                
                valueCell.appendChild(select);
                valueCell.appendChild(input);
            } else {
                // For data: show only input
                const input = document.createElement('input');
                input.type = 'text';
                input.value = item.value || '0';
                input.placeholder = 'Number';
                input.setAttribute('data-validate', 'data');
                input.oninput = () => {
                    checkForChanges();
                    validateInputOnChange();
                };
                
                valueCell.appendChild(input);
            }
        } else {
            const valueCell = row.insertCell(2);
            valueCell.textContent = item.value || '0';
            
            // Check if this RAM cell has changed and trigger electric animation
            // Only animate if shouldAnimateChanges is true (during instruction execution)
            if (shouldAnimateChanges) {
                const previousItem = previousRam.find(prev => prev.address === item.address);
                if (previousItem && previousItem.value !== item.value) {
                    // Apply electric effect to the entire row
                    row.classList.add('electric-active-row');
                    
                    // Remove the class after animation completes
                    setTimeout(() => {
                        row.classList.remove('electric-active-row');
                    }, 1200);
                }
            }
        }
        
        if (currentMode === 'edit' && editingControlsEnabled) {
            const actionsCell = row.insertCell(3);
            actionsCell.className = 'actions-cell';
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.className = 'remove-row-btn';
            removeBtn.title = 'Remove row';
            removeBtn.onclick = () => removeRow(item.address);
            
            actionsCell.appendChild(removeBtn);
        }
    }
    
    if (currentMode === 'edit' && editingControlsEnabled) {
        const row = ramTable.insertRow();
        row.className = 'add-row-row';
        const cell = row.insertCell(0);
        cell.colSpan = 4;
        
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Add Row';
        addBtn.className = 'add-row-btn';
        addBtn.onclick = addRow;
        
        cell.appendChild(addBtn);
    }

    const editHeader = document.querySelector('th.edit-column');
    if (editHeader) {
        editHeader.classList.toggle('hidden', currentMode === 'display' || !editingControlsEnabled);
    }
    
    // Trigger validation after table rebuild in edit mode if there are existing errors
    // This ensures validation states are maintained after operations like row removal
    if (currentMode === 'edit' && validationErrors.size > 0) {
        setTimeout(() => validateInputOnChange(), 50);
    }
    
    // Manage edit mode buttons in the RAM header
    const modeSwitch = document.querySelector('.mode-switch');
    const modeToggleBtn = document.getElementById('modeToggle');
    let saveButton = document.getElementById('saveAllButton');
    let cancelButton = document.getElementById('cancelButton');
    
    if (currentMode === 'edit') {
        // Always show the mode toggle button (View button)
        if (modeToggleBtn) {
            modeToggleBtn.style.display = 'flex';
        }
        
        // Create Save button if it doesn't exist
        if (!saveButton) {
            saveButton = document.createElement('button');
            saveButton.textContent = 'Save All Changes';
            saveButton.onclick = saveAllChanges;
            saveButton.id = 'saveAllButton';
            saveButton.className = 'save-changes-btn';
            saveButton.style.opacity = '0';
            saveButton.style.pointerEvents = 'none';
            modeSwitch.insertBefore(saveButton, modeToggleBtn);
        }
        
        // Create Cancel button if it doesn't exist
        if (!cancelButton) {
            cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.onclick = cancelChanges;
            cancelButton.id = 'cancelButton';
            cancelButton.className = 'cancel-changes-btn';
            cancelButton.style.opacity = '0';
            cancelButton.style.pointerEvents = 'none';
            modeSwitch.insertBefore(cancelButton, modeToggleBtn);
        }
        
        // Always show buttons in edit mode to prevent layout shifts
        saveButton.style.opacity = '1';
        saveButton.style.pointerEvents = 'auto';
        cancelButton.style.opacity = '1';
        cancelButton.style.pointerEvents = 'auto';
        
        // Update save button state based on validation errors
        updateSaveButtonState();
    } else {
        // Show the mode toggle button in display mode
        if (modeToggleBtn) {
            modeToggleBtn.style.display = 'flex';
        }
        
        // Remove save and cancel buttons when not in edit mode
        if (saveButton) {
            saveButton.remove();
        }
        if (cancelButton) {
            cancelButton.remove();
        }
    }
}

function validateInputOnChange() {
    const ramTable = document.getElementById('ram-table').getElementsByTagName('tbody')[0];
    validationErrors.clear();
    
    for (let i = 0; i < ram.length && i < ramTable.rows.length; i++) {
        const row = ramTable.rows[i];
        if (row.className === 'add-row-row') continue;
        
        const typeSelect = row.cells[1].getElementsByTagName('select')[0];
        if (!typeSelect) continue;
        
        const currentType = typeSelect.value;
        let errorMessage = null;
        
        if (currentType === 'instruction') {
            const valueInput = row.cells[2].getElementsByTagName('input')[0];
            const valueSelect = row.cells[2].getElementsByTagName('select')[0];
            
            if (valueInput && valueSelect) {
                const instruction = valueSelect.value;
                const operand = valueInput.value.trim();
                
                errorMessage = validateInstructionOperand(operand, instruction);
            }
        } else {
            const valueInput = row.cells[2].getElementsByTagName('input')[0];
            if (valueInput) {
                const value = valueInput.value.trim();
                errorMessage = validateDataValue(value);
            }
        }
        
        if (errorMessage) {
            validationErrors.set(i, errorMessage);
            row.classList.add('validation-error');
            row.setAttribute('data-error', errorMessage);
        } else {
            row.classList.remove('validation-error');
            row.removeAttribute('data-error');
        }
    }
    
    // Update save button state
    updateSaveButtonState();

    if (validationErrors.size === 0) {
        const tooltipEl = document.querySelector('.validation-tooltip');
        if (tooltipEl) {
            tooltipEl.classList.remove('show');
            tooltipEl.style.display = 'none';
        }
        const errorRows = document.querySelectorAll('tr.validation-error');
        errorRows.forEach(row => row.classList.remove('show-error-tooltip'));
    }
}

function updateSaveButtonState() {
    const saveButton = document.getElementById('saveAllButton');
    if (saveButton) {
        // Disable save button if validation errors exist
        if (validationErrors.size > 0) {
            saveButton.disabled = true;
            saveButton.style.opacity = '0.5';
            saveButton.style.cursor = 'not-allowed';
            saveButton.title = 'Cannot save: Fix validation errors first';
        } else if (hasChanges) {
            saveButton.disabled = false;
            saveButton.style.opacity = '1';
            saveButton.style.cursor = 'pointer';
            saveButton.title = '';
        }
    }
}

function checkForChanges() {
    const ramTable = document.getElementById('ram-table').getElementsByTagName('tbody')[0];
    const previousHasChanges = hasChanges;
    
    // If hasChanges is already true (from add/remove operations), keep it true
    if (hasChanges) {
        updateSaveButtonState();
        return;
    }
    
    hasChanges = false;
    
    // Check if number of rows changed
    if (ram.length !== previousRam.length) {
        hasChanges = true;
    }
    
    // Check for inline edits
    for (let i = 0; i < ram.length && i < ramTable.rows.length; i++) {
        const row = ramTable.rows[i];
        
        // Skip the add-row button row
        if (row.className === 'add-row-row') continue;
        
        const typeSelect = row.cells[1].getElementsByTagName('select')[0];
        if (!typeSelect) continue; // Skip if not in edit mode
        
        const newType = typeSelect.value;
        
        // Check if type changed
        if (newType !== ram[i].type) {
            hasChanges = true;
            break;
        }
        
        // Check value based on type
        if (newType === 'instruction') {
            const valueSelect = row.cells[2].getElementsByTagName('select')[0];
            const valueInput = row.cells[2].getElementsByTagName('input')[0];
            const newInstruction = valueSelect.value;
            const newOperand = valueInput.value;
            const originalValue = ram[i].value;
            const [originalInstruction, originalOperand] = originalValue.split(' ');
            
            if (newInstruction !== (originalInstruction || '') || 
                newOperand !== (originalOperand || '')) {
                hasChanges = true;
                break;
            }
        } else {
            // Data type - just check the input value
            const valueInput = row.cells[2].getElementsByTagName('input')[0];
            const newValue = valueInput.value;
            
            if (newValue !== ram[i].value) {
                hasChanges = true;
                break;
            }
        }
    }
    
    // If hasChanges state changed, update the button visibility
    if (hasChanges !== previousHasChanges) {
        updateEditModeButtons();
    }
}

function updateEditModeButtons() {
    // Update button visibility without rebuilding the table
    const modeSwitch = document.querySelector('.mode-switch');
    const modeToggleBtn = document.getElementById('modeToggle');
    let saveButton = document.getElementById('saveAllButton');
    let cancelButton = document.getElementById('cancelButton');
    
    if (currentMode === 'edit') {
        // Create Save button if it doesn't exist
        if (!saveButton) {
            saveButton = document.createElement('button');
            saveButton.textContent = 'Save All Changes';
            saveButton.onclick = saveAllChanges;
            saveButton.id = 'saveAllButton';
            saveButton.className = 'save-changes-btn';
            saveButton.style.opacity = '0';
            saveButton.style.pointerEvents = 'none';
            modeSwitch.insertBefore(saveButton, modeToggleBtn);
        }
        
        // Create Cancel button if it doesn't exist
        if (!cancelButton) {
            cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.onclick = cancelChanges;
            cancelButton.id = 'cancelButton';
            cancelButton.className = 'cancel-changes-btn';
            cancelButton.style.opacity = '0';
            cancelButton.style.pointerEvents = 'none';
            modeSwitch.insertBefore(cancelButton, modeToggleBtn);
        }
        
        // Always show buttons in edit mode to prevent layout shifts
        saveButton.style.opacity = '1';
        saveButton.style.pointerEvents = 'auto';
        cancelButton.style.opacity = '1';
        cancelButton.style.pointerEvents = 'auto';
        
        // Update save button state based on validation errors
        updateSaveButtonState();
    }
}

function saveAllChanges() {
    // Prevent saving if validation errors exist
    if (validationErrors.size > 0) {
        return;
    }
    
    const ramTable = document.getElementById('ram-table').getElementsByTagName('tbody')[0];
    
    for (let i = 0; i < ram.length; i++) {
        const row = ramTable.rows[i];
        
        // Skip the add-row button row
        if (row.className === 'add-row-row') continue;
        
        const typeSelect = row.cells[1].getElementsByTagName('select')[0];
        if (!typeSelect) continue; // Skip if not in edit mode
        
        const newType = typeSelect.value;
        
        ram[i].type = newType;
        
        if (newType === 'instruction') {
            const valueSelect = row.cells[2].getElementsByTagName('select')[0];
            const valueInput = row.cells[2].getElementsByTagName('input')[0];
            const newInstruction = valueSelect.value;
            const newOperand = valueInput.value;
            
            if (newInstruction) {
                ram[i].value = `${newInstruction} ${newOperand}`.trim();
            } else {
                ram[i].value = newOperand.trim() || '0';
            }
        } else {
            // Data type - just get the input value
            const valueInput = row.cells[2].getElementsByTagName('input')[0];
            ram[i].value = valueInput.value.trim() || '0';
        }
    }
    
    // Update previousRam to reflect the saved state
    previousRam = ram.map(item => ({ ...item }));
    
    hasChanges = false;
    editingControlsEnabled = false;
    updateDisplay();
    const tooltipEl = document.querySelector('.validation-tooltip');
    if (tooltipEl) {
        tooltipEl.classList.remove('show');
        tooltipEl.style.display = 'none';
    }
}

function executeInstruction() {
    // Clear any previous error
    clearError();
    
    // Enable animations for this execution
    shouldAnimateChanges = true;
    
    try {
        switch (executionPhase) {
            case 'Fetch':
                // Validate PC is within bounds
                if (pc < 0 || pc >= ram.length) {
                    throw new Error(`Program Counter (${pc}) is out of bounds. Valid range is 0-${ram.length - 1}.`);
                }
                
                // Validate instruction exists
                if (!ram[pc] || ram[pc].value === undefined || ram[pc].value === null || ram[pc].value === '') {
                    throw new Error(`No instruction found at RAM address ${pc}.`);
                }
                
                ir = ram[pc].value;
                executionPhase = 'Decode';
                break;
                
            case 'Decode':
                // Validate instruction format
                const parts = ir.trim().split(/\s+/);
                if (parts.length === 0 || !parts[0]) {
                    throw new Error(`Invalid instruction format: '${ir}'. Expected format: 'OPERATION OPERAND'.`);
                }
                
                const decodedOperation = parts[0];
                if (!instructions.includes(decodedOperation)) {
                    throw new Error(`Unknown operation '${decodedOperation}' in instruction '${ir}'. Valid operations are: ${instructions.join(', ')}.`);
                }
                
                executionPhase = 'Execute';
                break;
                
            case 'Execute':
                const [operation, operand] = ir.split(' ');
                
                switch (operation) {
                    case 'LOAD':
                        // Validate operand exists
                        if (operand === undefined || operand === null || operand === '') {
                            throw new Error(`LOAD instruction requires an operand. Found: '${ir}'.`);
                        }
                        
                        const loadAddress = parseInt(operand);
                        
                        // Validate operand is a number
                        if (isNaN(loadAddress)) {
                            throw new Error(`LOAD operand must be a valid number. Found: '${operand}' in instruction '${ir}'.`);
                        }
                        
                        // Validate address is within bounds
                        if (loadAddress < 0 || loadAddress >= ram.length) {
                            throw new Error(`LOAD operand ${loadAddress} is out of bounds. Valid RAM addresses are 0-${ram.length - 1}.`);
                        }
                        
                        // Validate RAM cell exists
                        if (!ram[loadAddress] || ram[loadAddress].value === undefined) {
                            throw new Error(`Cannot LOAD from RAM address ${loadAddress}: cell does not exist or is undefined.`);
                        }
                        
                        accumulator = parseInt(ram[loadAddress].value) || 0;
                        break;
                        
                    case 'ADD':
                        // Validate operand exists
                        if (operand === undefined || operand === null || operand === '') {
                            throw new Error(`ADD instruction requires an operand. Found: '${ir}'.`);
                        }
                        
                        const addAddress = parseInt(operand);
                        
                        // Validate operand is a number
                        if (isNaN(addAddress)) {
                            throw new Error(`ADD operand must be a valid number. Found: '${operand}' in instruction '${ir}'.`);
                        }
                        
                        // Validate address is within bounds
                        if (addAddress < 0 || addAddress >= ram.length) {
                            throw new Error(`ADD operand ${addAddress} is out of bounds. Valid RAM addresses are 0-${ram.length - 1}.`);
                        }
                        
                        // Validate RAM cell exists
                        if (!ram[addAddress] || ram[addAddress].value === undefined) {
                            throw new Error(`Cannot ADD from RAM address ${addAddress}: cell does not exist or is undefined.`);
                        }
                        
                        accumulator += parseInt(ram[addAddress].value) || 0;
                        break;
                        
                    case 'STORE':
                        // Validate operand exists
                        if (operand === undefined || operand === null || operand === '') {
                            throw new Error(`STORE instruction requires an operand. Found: '${ir}'.`);
                        }
                        
                        const storeAddress = parseInt(operand);
                        
                        // Validate operand is a number
                        if (isNaN(storeAddress)) {
                            throw new Error(`STORE operand must be a valid number. Found: '${operand}' in instruction '${ir}'.`);
                        }
                        
                        // Validate address is within bounds
                        if (storeAddress < 0 || storeAddress >= ram.length) {
                            throw new Error(`STORE operand ${storeAddress} is out of bounds. Valid RAM addresses are 0-${ram.length - 1}.`);
                        }
                        
                        // Validate RAM cell exists
                        if (!ram[storeAddress]) {
                            throw new Error(`Cannot STORE to RAM address ${storeAddress}: cell does not exist.`);
                        }
                        
                        ram[storeAddress].value = accumulator.toString();
                        break;
                        
                    case 'JUMP':
                        // Validate operand exists
                        if (operand === undefined || operand === null || operand === '') {
                            throw new Error(`JUMP instruction requires an operand. Found: '${ir}'.`);
                        }
                        
                        const jumpAddress = parseInt(operand);
                        
                        // Validate operand is a number
                        if (isNaN(jumpAddress)) {
                            throw new Error(`JUMP operand must be a valid number. Found: '${operand}' in instruction '${ir}'.`);
                        }
                        
                        // Validate address is within bounds
                        if (jumpAddress < 0 || jumpAddress >= ram.length) {
                            throw new Error(`JUMP operand ${jumpAddress} is out of bounds. Valid RAM addresses are 0-${ram.length - 1}.`);
                        }
                        
                        pc = (jumpAddress - 1 + ram.length) % ram.length;
                        break;
                        
                    default:
                        throw new Error(`Unknown operation '${operation}' in instruction '${ir}'. Valid operations are: ${instructions.join(', ')}.`);
                }
                
                pc = (pc + 1) % ram.length;
                executionPhase = 'Fetch';
                break;
        }
        
        updateDisplay();
        
    } catch (error) {
        // Stop auto mode if running
        if (isAutoRunning) {
            stopAuto();
        }
        
        // Reset to Fetch phase so next execution starts fresh
        executionPhase = 'Fetch';
        ir = 'NIL';
        
        // Display the error
        displayError(error.message);
        
        // Update display to show current state
        updateDisplay();
    } finally {
        // Disable animations after display update
        shouldAnimateChanges = false;
    }
}

function clockTick() {
    if (currentMode === 'edit') {
        toggleMode();
    }
    executeInstruction();
}

function toggleMode() {
    currentMode = currentMode === 'display' ? 'edit' : 'display';
    const editColumns = document.getElementsByClassName('edit-column');
    for (let col of editColumns) {
        col.classList.toggle('hidden', currentMode === 'display');
    }
    
    const modeText = document.getElementById('modeText');
    const modeIcon = document.getElementById('modeIcon');
    
    if (currentMode === 'edit') {
        // Switch to View mode
        modeText.textContent = 'View';
        modeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
        const tooltipEl = document.querySelector('.validation-tooltip');
        if (tooltipEl) {
            tooltipEl.style.display = '';
        }
        editingControlsEnabled = true;
    } else {
        // Switch to Modify mode
        modeText.textContent = 'Modify';
        modeIcon.innerHTML = '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>';
        // When switching back to display mode, update previousRam to current state
        // This prevents animations from triggering on mode switch
        previousRam = ram.map(item => ({ ...item }));
        editingControlsEnabled = false;
    }
    
    hasChanges = false;
    shouldAnimateChanges = false; // Ensure no animations during mode switch
    
    if (currentMode === 'display') {
        validationErrors.clear();
        const tooltipEl = document.querySelector('.validation-tooltip');
        if (tooltipEl) {
            tooltipEl.classList.remove('show');
            tooltipEl.style.display = 'none';
        }
        const errorRows = document.querySelectorAll('tr.validation-error');
        errorRows.forEach(row => row.classList.remove('show-error-tooltip'));
    }
    
    updateDisplay();
    
    // Run validation when entering edit mode
    if (currentMode === 'edit') {
        setTimeout(() => validateInputOnChange(), 100);
    }
}

function toggleExplanation() {
    const explanation = document.getElementById('explanation');
    const button = document.getElementById('explanationToggle');
    const container = document.querySelector('.container');
    const isVisible = explanation.classList.contains('visible');
    if (isVisible) {
        explanation.style.maxHeight = explanation.scrollHeight + 'px';
        void explanation.offsetHeight;
        explanation.style.maxHeight = '0px';
        explanation.classList.remove('visible');
        button.textContent = 'Show Explanation';
        setTimeout(() => {
            explanation.parentNode.insertBefore(button, explanation);
        }, 500);
        if (container) {
            container.style.maxHeight = '';
            container.style.overflow = '';
        }
    } else {
        explanation.classList.add('visible');
        button.textContent = 'Hide Explanation';
        explanation.appendChild(button);
        setTimeout(() => {
            explanation.style.maxHeight = explanation.scrollHeight + 'px';
        }, 10);
        if (container) {
            container.style.maxHeight = 'none';
            container.style.overflow = 'visible';
        }
    }
}

function toggleExecutionMode(mode) {
    // Stop auto mode if switching away from it
    if (executionMode === 'auto' && isAutoRunning) {
        stopAuto();
    }
    
    // Set the execution mode
    executionMode = mode;
    
    // Update pill button state
    const pillButtonInput = document.getElementById('pillButtonInput');
    const manualSelection = document.querySelector('.pill-button-selection_manual');
    const autoSelection = document.querySelector('.pill-button-selection_auto');
    const highlight = document.querySelector('.pill-button-highlight');
    
    if (executionMode === 'manual') {
        pillButtonInput.checked = false;
        manualSelection.classList.add('pill-button-selection_active');
        autoSelection.classList.remove('pill-button-selection_active');
        
        // Position highlight on manual
        const manualWidth = manualSelection.offsetWidth;
        const manualPosition = manualSelection.offsetLeft;
        highlight.style.width = manualWidth + 'px';
        highlight.style.left = manualPosition + 'px';
    } else {
        pillButtonInput.checked = true;
        manualSelection.classList.remove('pill-button-selection_active');
        autoSelection.classList.add('pill-button-selection_active');
        
        // Position highlight on auto
        const autoWidth = autoSelection.offsetWidth;
        const autoPosition = autoSelection.offsetLeft;
        highlight.style.width = autoWidth + 'px';
        highlight.style.left = autoPosition + 'px';
    }
    
    // Show/hide appropriate controls
    document.getElementById('manualControls').classList.toggle('hidden', executionMode !== 'manual');
    document.getElementById('autoControls').classList.toggle('hidden', executionMode !== 'auto');
}

function startAuto() {
    if (currentMode === 'edit') {
        toggleMode();
    }
    
    const intervalMs = parseFloat(document.getElementById('intervalInput').value);
    if (isNaN(intervalMs) || intervalMs <= 0) {
        alert('Please enter a valid interval greater than 0');
        return;
    }
    
    isAutoRunning = true;
    isPaused = false;
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('runningControls').classList.remove('hidden');
    document.getElementById('autoResetBtn').classList.add('hidden');
    document.getElementById('pauseBtn').textContent = 'Pause';
    document.getElementById('intervalInput').disabled = true;
    
    // Set target interval and start with 3x slower speed
    targetIntervalMs = intervalMs;
    currentIntervalMs = intervalMs * 3;
    let stepCount = 0;
    
    // Execute first tick immediately
    executeInstruction();
    
    // Function to gradually speed up
    const scheduleNextTick = () => {
        if (!isAutoRunning) return;
        
        autoInterval = setTimeout(() => {
            executeInstruction();
            
            // Gradually decrease interval (speed up) over accelerationSteps
            if (stepCount < accelerationSteps) {
                stepCount++;
                const progress = stepCount / accelerationSteps;
                // Ease-in curve for smooth acceleration
                const easedProgress = progress * progress;
                currentIntervalMs = intervalMs * 3 - (intervalMs * 2 * easedProgress);
            } else {
                currentIntervalMs = targetIntervalMs;
            }
            
            scheduleNextTick();
        }, currentIntervalMs);
    };
    
    scheduleNextTick();
}

function pauseAuto() {
    if (isPaused) {
        // Resume
        const intervalMs = parseFloat(document.getElementById('intervalInput').value);
        if (isNaN(intervalMs) || intervalMs <= 0) {
            alert('Please enter a valid interval greater than 0');
            return;
        }
        
        isPaused = false;
        isAutoRunning = true;
        document.getElementById('pauseBtn').textContent = 'Pause';
        document.getElementById('intervalInput').disabled = true;
        
        // Restart the auto execution
        targetIntervalMs = intervalMs;
        currentIntervalMs = intervalMs;
        
        const scheduleNextTick = () => {
            if (!isAutoRunning || isPaused) return;
            
            autoInterval = setTimeout(() => {
                executeInstruction();
                scheduleNextTick();
            }, currentIntervalMs);
        };
        
        scheduleNextTick();
    } else {
        // Pause
        isPaused = true;
        isAutoRunning = false;
        if (autoInterval) {
            clearTimeout(autoInterval);
            autoInterval = null;
        }
        document.getElementById('pauseBtn').textContent = 'Resume';
        document.getElementById('intervalInput').disabled = false;
        
        // Update tooltips after pausing
        updateTooltips();
    }
}

function stopAuto() {
    isAutoRunning = false;
    isPaused = false;
    if (autoInterval) {
        clearTimeout(autoInterval);
        autoInterval = null;
    }
    
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('runningControls').classList.add('hidden');
    document.getElementById('autoResetBtn').classList.remove('hidden');
    document.getElementById('pauseBtn').textContent = 'Pause';
    document.getElementById('intervalInput').disabled = false;
    
    // Update tooltips after stopping
    updateTooltips();
}

function resetCPU() {
    pc = 0;
    previousPc = 0;
    ir = 'NIL';
    accumulator = 0;
    executionPhase = 'Fetch';
    clearError();
    updateDisplay();
}

function displayError(message) {
    currentError = message;
    const errorDisplay = document.getElementById('executionError');
    if (errorDisplay) {
        errorDisplay.textContent = message;
        errorDisplay.classList.add('visible');
    }
}

function clearError() {
    currentError = null;
    const errorDisplay = document.getElementById('executionError');
    if (errorDisplay) {
        errorDisplay.textContent = '';
        errorDisplay.classList.remove('visible');
    }
}

// Initialize pill button
function initializePillButton() {
    const pillButton = document.querySelector('.pill-button');
    const pillButtonManual = document.querySelector('.pill-button-selection_manual');
    const pillButtonAuto = document.querySelector('.pill-button-selection_auto');
    const pillButtonHighlight = document.querySelector('.pill-button-highlight');
    const pillButtonInput = document.getElementById('pillButtonInput');
    
    // Function to update highlight dimensions
    function updateHighlightDimensions() {
        // Force reflow to get accurate dimensions
        void pillButton.offsetWidth;
        
        const activeSelection = document.querySelector('.pill-button-selection_active');
        if (activeSelection) {
            // Use requestAnimationFrame to ensure DOM has updated
            requestAnimationFrame(() => {
                const width = activeSelection.offsetWidth;
                const position = activeSelection.offsetLeft;
                pillButtonHighlight.style.width = width + 'px';
                pillButtonHighlight.style.left = position + 'px';
            });
        }
    }
    
    // Set initial highlight position and width
    updateHighlightDimensions();
    
    // Add click handler to entire pill button
    pillButton.addEventListener('click', function(e) {
        // Toggle mode regardless of click position
        const nextMode = executionMode === 'manual' ? 'auto' : 'manual';
        toggleExecutionMode(nextMode);
    });
    
    // Add resize handler to adjust highlight on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateHighlightDimensions, 50);
    });
    
    // Add orientation change handler
    window.addEventListener('orientationchange', function() {
        setTimeout(updateHighlightDimensions, 100);
    });
    
    // Use ResizeObserver for more reliable dimension updates
    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => {
            updateHighlightDimensions();
        });
        resizeObserver.observe(pillButton);
        resizeObserver.observe(pillButtonManual);
        resizeObserver.observe(pillButtonAuto);
    }
}

// Function to generate tooltip content based on current state
function getTooltipContent(phase) {
    // Show tooltips in manual mode OR in auto mode when paused/stopped
    if (executionMode === 'auto' && isAutoRunning && !isPaused) {
        return ''; // Don't show tooltips only when auto mode is actively running
    }
    
    switch (phase) {
        case 'Fetch':
            if (executionPhase === 'Fetch') {
                const nextInstruction = ram[pc]?.value || 'NIL';
                return `The CPU is fetching the instruction from RAM address ${pc} (which is '${nextInstruction}') and loading it into the Instruction Register.`;
            } else {
                return 'The CPU fetches the next instruction from RAM, using the address in the Program Counter, and places it into the Instruction Register.';
            }
        
        case 'Decode':
            if (executionPhase === 'Decode') {
                const [operation] = ir.split(' ');
                return `The CPU is decoding the instruction '${ir}' in the Instruction Register to understand what operation it needs to perform.`;
            } else {
                return "The CPU decodes the instruction in the Instruction Register to understand what operation it needs to perform (e.g., 'LOAD', 'ADD', 'STORE').";
            }
        
        case 'Execute':
            if (executionPhase === 'Execute') {
                const [operation, operand] = ir.split(' ');
                let description = '';
                
                switch (operation) {
                    case 'LOAD':
                        description = `The CPU is executing the 'LOAD ${operand}' instruction. It's loading the value from RAM address ${operand} into the Accumulator.`;
                        break;
                    case 'ADD':
                        description = `The CPU is executing the 'ADD ${operand}' instruction. It's adding the value from RAM address ${operand} to the current Accumulator value.`;
                        break;
                    case 'STORE':
                        description = `The CPU is executing the 'STORE ${operand}' instruction. It's taking the value ${accumulator} from the Accumulator and storing it in RAM address ${operand}.`;
                        break;
                    case 'JUMP':
                        description = `The CPU is executing the 'JUMP ${operand}' instruction. It's setting the Program Counter to ${operand} to continue execution from there.`;
                        break;
                    default:
                        description = `The CPU is executing the '${ir}' instruction, carrying out the operation.`;
                }
                
                return description;
            } else {
                return 'The CPU executes the instruction, carrying out the operation (like adding numbers or moving data between registers and RAM).';
            }
        
        default:
            return '';
    }
}

// Function to generate Clock Tick button tooltip content
function getClockTickTooltipContent() {
    if (executionMode !== 'manual' && isAutoRunning && !isPaused) {
        return 'Pause or stop Auto mode to use Clock Tick';
    }
    
    if (executionMode !== 'manual') {
        return 'Switch to Manual mode to use Clock Tick';
    }
    
    let nextAction = '';
    
    switch (executionPhase) {
        case 'Fetch':
            const nextInstruction = ram[pc]?.value || 'NIL';
            nextAction = `Fetch '${nextInstruction}' from RAM[${pc}] → IR`;
            break;
        
        case 'Decode':
            nextAction = `Decode '${ir}' → Execute`;
            break;
        
        case 'Execute':
            const [operation, operand] = ir.split(' ');
            switch (operation) {
                case 'LOAD':
                    nextAction = `Execute: Load RAM[${operand}] → ACC, then PC=${(pc + 1) % ram.length}`;
                    break;
                case 'ADD':
                    nextAction = `Execute: ACC + RAM[${operand}] → ACC, then PC=${(pc + 1) % ram.length}`;
                    break;
                case 'STORE':
                    nextAction = `Execute: ACC → RAM[${operand}], then PC=${(pc + 1) % ram.length}`;
                    break;
                case 'JUMP':
                    nextAction = `Execute: Jump to PC=${operand}`;
                    break;
                default:
                    nextAction = `Execute '${ir}', then PC=${(pc + 1) % ram.length}`;
            }
            break;
    }
    
    return nextAction;
}

// Function to generate Program Counter tooltip content
function getPCTooltipContent() {
    let status = '';
    
    // Show detailed tooltips in manual mode OR in auto mode when not actively running
    const showDetailedTooltip = executionMode === 'manual' || !isAutoRunning || isPaused;
    
    if (showDetailedTooltip) {
        const currentInstruction = ram[pc]?.value || 'NIL';
        const currentType = ram[pc]?.type || 'unknown';
        
        if (executionPhase === 'Fetch') {
            status = `Current address: ${pc}, pointing to RAM[${pc}] which contains '${currentInstruction}'. This instruction will be fetched into IR`;
        } else if (executionPhase === 'Decode') {
            const [operation, operand] = ir.split(' ');
            
            if (operation === 'JUMP') {
                status = `Current address: ${pc}, will jump to address ${operand} after JUMP executes`;
            } else {
                const nextPC = (pc + 1) % ram.length;
                const nextInstruction = ram[nextPC]?.value || 'NIL';
                status = `Current address: ${pc}, will increment to ${nextPC} (pointing to '${nextInstruction}') after current instruction executes`;
            }
        } else if (executionPhase === 'Execute') {
            const [operation, operand] = ir.split(' ');
            
            if (operation === 'JUMP') {
                status = `Current address: ${pc}, jumping now to address ${operand}. Next instruction will be '${ram[parseInt(operand)]?.value || 'NIL'}'`;
            } else if (operation === 'LOAD') {
                const nextPC = (pc + 1) % ram.length;
                const nextInstruction = ram[nextPC]?.value || 'NIL';
                status = `Current address: ${pc}, will increment to ${nextPC} after LOAD completes. Next instruction: '${nextInstruction}'`;
            } else if (operation === 'ADD') {
                const nextPC = (pc + 1) % ram.length;
                const nextInstruction = ram[nextPC]?.value || 'NIL';
                status = `Current address: ${pc}, will increment to ${nextPC} after ADD completes. Next instruction: '${nextInstruction}'`;
            } else if (operation === 'STORE') {
                const nextPC = (pc + 1) % ram.length;
                const nextInstruction = ram[nextPC]?.value || 'NIL';
                status = `Current address: ${pc}, will increment to ${nextPC} after STORE completes. Next instruction: '${nextInstruction}'`;
            } else {
                const nextPC = (pc + 1) % ram.length;
                status = `Current address: ${pc}, will increment to ${nextPC} after execution`;
            }
        } else {
            status = `Current address: ${pc}, pointing to RAM[${pc}] which contains '${currentInstruction}'`;
        }
    } else {
        const currentInstruction = ram[pc]?.value || 'NIL';
        status = `Current address: ${pc}, pointing to RAM[${pc}] ('${currentInstruction}')`;
    }
    
    return status;
}

// Function to generate Instruction Register tooltip content
function getIRTooltipContent() {
    let status = '';
    
    // Show detailed tooltips in manual mode OR in auto mode when not actively running
    const showDetailedTooltip = executionMode === 'manual' || !isAutoRunning || isPaused;
    
    if (showDetailedTooltip) {
        if (executionPhase === 'Fetch') {
            const nextInstruction = ram[pc]?.value || 'NIL';
            if (ir === 'NIL') {
                status = `Current instruction: ${ir} (empty). Next: '${nextInstruction}' will be fetched from RAM[${pc}]`;
            } else {
                status = `Current instruction: '${ir}' (completed). Next: '${nextInstruction}' will be fetched from RAM[${pc}]`;
            }
        } else if (executionPhase === 'Decode') {
            const [operation, operand] = ir.split(' ');
            
            if (operation === 'LOAD') {
                const value = parseInt(ram[parseInt(operand)]?.value) || 0;
                status = `Current instruction: '${ir}', being decoded. Will load value ${value} from RAM[${operand}] into ACC`;
            } else if (operation === 'ADD') {
                const value = parseInt(ram[parseInt(operand)]?.value) || 0;
                status = `Current instruction: '${ir}', being decoded. Will add value ${value} from RAM[${operand}] to ACC`;
            } else if (operation === 'STORE') {
                status = `Current instruction: '${ir}', being decoded. Will store ACC value into RAM[${operand}]`;
            } else if (operation === 'JUMP') {
                status = `Current instruction: '${ir}', being decoded. Will jump to address ${operand}`;
            } else {
                status = `Current instruction: '${ir}', being decoded`;
            }
        } else if (executionPhase === 'Execute') {
            const [operation, operand] = ir.split(' ');
            
            if (operation === 'LOAD') {
                const value = parseInt(ram[parseInt(operand)]?.value) || 0;
                status = `Current instruction: '${ir}', executing now. Loading ${value} from RAM[${operand}] → ACC`;
            } else if (operation === 'ADD') {
                const value = parseInt(ram[parseInt(operand)]?.value) || 0;
                const result = accumulator + value;
                status = `Current instruction: '${ir}', executing now. Adding: ACC ${accumulator} + RAM[${operand}] ${value} = ${result}`;
            } else if (operation === 'STORE') {
                status = `Current instruction: '${ir}', executing now. Storing ACC ${accumulator} → RAM[${operand}]`;
            } else if (operation === 'JUMP') {
                status = `Current instruction: '${ir}', executing now. Setting PC to ${operand}`;
            } else {
                status = `Current instruction: '${ir}', executing now`;
            }
        } else {
            status = `Current instruction: '${ir}', holding the instruction being processed`;
        }
    } else {
        status = `Current instruction: '${ir}', holding the instruction for CPU to execute`;
    }
    
    return status;
}

// Function to generate Accumulator tooltip content
function getAccumulatorTooltipContent() {
    let status = `Current value: ${accumulator}`;
    
    // Show detailed tooltips in manual mode OR in auto mode when not actively running
    const showDetailedTooltip = executionMode === 'manual' || !isAutoRunning || isPaused;
    
    // Only show next action during Execute phase when detailed tooltip is enabled
    if (showDetailedTooltip && executionPhase === 'Execute') {
        const [operation, operand] = ir.split(' ');
        
        switch (operation) {
            case 'LOAD':
                const loadValue = parseInt(ram[parseInt(operand)]?.value) || 0;
                status = `Current value: ${accumulator}, which will be replaced. Next value: ${loadValue} (loaded from RAM[${operand}])`;
                break;
            case 'ADD':
                const addValue = parseInt(ram[parseInt(operand)]?.value) || 0;
                const result = accumulator + addValue;
                // Handle the operator sign based on whether addValue is negative
                const operator = addValue >= 0 ? '+' : '';
                status = `Current value: ${accumulator}, which will be added to RAM[${operand}]. Next value is ${result} (ACC ${accumulator} ${operator} RAM[${operand}] ${addValue})`;
                break;
            case 'STORE':
                status = `Current value: ${accumulator}, which will be stored into RAM[${operand}]. ACC remains ${accumulator}`;
                break;
            case 'JUMP':
                status = `Current value: ${accumulator}, which remains unchanged (JUMP doesn't affect ACC)`;
                break;
            default:
                status += '';
        }
    } else if (showDetailedTooltip) {
        // Dynamic messages based on current phase and instruction
        if (executionPhase === 'Fetch') {
            const nextInstruction = ram[pc]?.value || 'NIL';
            const [nextOp] = nextInstruction.split(' ');
            
            if (nextOp === 'LOAD' || nextOp === 'ADD') {
                status = `Current value: ${accumulator}, waiting for instruction '${nextInstruction}' to be fetched and executed`;
            } else if (nextOp === 'STORE') {
                status = `Current value: ${accumulator}, ready to be stored when instruction '${nextInstruction}' executes`;
            } else {
                status = `Current value: ${accumulator}, holding result from previous operations`;
            }
        } else if (executionPhase === 'Decode') {
            const [operation, operand] = ir.split(' ');
            
            if (operation === 'LOAD') {
                status = `Current value: ${accumulator}, will be replaced when LOAD executes`;
            } else if (operation === 'ADD') {
                status = `Current value: ${accumulator}, will be added to RAM[${operand}] when ADD executes`;
            } else if (operation === 'STORE') {
                status = `Current value: ${accumulator}, will be stored to RAM[${operand}] when STORE executes`;
            } else {
                status = `Current value: ${accumulator}, unaffected by current instruction`;
            }
        } else {
            status = `Current value: ${accumulator}, holding result from previous operations`;
        }
    } else {
        status = `Current value: ${accumulator}, holding temporary data for CPU operations`;
    }
    
    return status;
}

// Function to update all tooltips
function updateTooltips() {
    const phases = document.querySelectorAll('.execution-phase');
    phases.forEach(phaseElement => {
        const phase = phaseElement.getAttribute('data-phase');
        const tooltip = phaseElement.querySelector('.phase-tooltip');
        if (tooltip) {
            tooltip.textContent = getTooltipContent(phase);
        }
    });
    
    // Update Clock Tick button tooltip
    const buttonTooltip = document.querySelector('.button-tooltip');
    if (buttonTooltip) {
        buttonTooltip.textContent = getClockTickTooltipContent();
    }
    
    // Update Program Counter tooltip
    const pcTooltip = document.querySelector('.pc-tooltip');
    if (pcTooltip) {
        pcTooltip.textContent = getPCTooltipContent();
    }
    
    // Update Instruction Register tooltip
    const irTooltip = document.querySelector('.ir-tooltip');
    if (irTooltip) {
        irTooltip.textContent = getIRTooltipContent();
    }
    
    // Update Accumulator tooltip
    const accumulatorTooltip = document.querySelector('.accumulator-tooltip');
    if (accumulatorTooltip) {
        accumulatorTooltip.textContent = getAccumulatorTooltipContent();
    }
}

// Function to adjust tooltip position to stay within viewport
function adjustTooltipPosition(tooltip) {
    if (!tooltip) return;
    
    // Reset any position adjustments
    tooltip.style.left = '';
    tooltip.style.right = '';
    tooltip.style.bottom = '';
    tooltip.style.top = '';
    tooltip.style.transform = '';
    tooltip.classList.remove('tooltip-below');
    
    // Get tooltip and viewport dimensions
    setTimeout(() => {
        const rect = tooltip.getBoundingClientRect();
        const parentRect = tooltip.parentElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 10;
        
        let transformX = '-50%';
        let transformY = '0';
        
        // Check horizontal overflow
        if (rect.right > viewportWidth - padding) {
            const overflow = rect.right - (viewportWidth - padding);
            transformX = `calc(-50% - ${overflow}px)`;
        } else if (rect.left < padding) {
            const overflow = padding - rect.left;
            transformX = `calc(-50% + ${overflow}px)`;
        }
        
        // Check vertical overflow - if tooltip goes above viewport, show it below instead
        if (rect.top < padding) {
            tooltip.style.bottom = 'auto';
            tooltip.style.top = 'calc(100% + 12px)';
            
            // Adjust arrow to point up
            const arrow = window.getComputedStyle(tooltip, '::before');
            if (arrow) {
                tooltip.classList.add('tooltip-below');
            }
        }
        
        tooltip.style.transform = `translateX(${transformX}) translateY(${transformY}) scale(1)`;
    }, 10);
}

// Initialize touch event handlers for mobile tooltips
function initializeTooltips() {
    const phases = document.querySelectorAll('.execution-phase');
    const buttonWrapper = document.querySelector('.button-wrapper');
    
    phases.forEach(phaseElement => {
        // Touch event for mobile
        phaseElement.addEventListener('touchstart', function(e) {
            // Don't show tooltips if auto mode is actively running
            if (executionMode === 'auto' && isAutoRunning && !isPaused) return;
            
            // Remove show-tooltip from all phases
            phases.forEach(p => p.classList.remove('show-tooltip'));
            
            // Add show-tooltip to this phase
            this.classList.add('show-tooltip');
            
            // Adjust tooltip position to stay within viewport
            const tooltip = this.querySelector('.phase-tooltip');
            adjustTooltipPosition(tooltip);
            
            // Remove tooltip after 3 seconds
            setTimeout(() => {
                this.classList.remove('show-tooltip');
            }, 3000);
        });
        
        // Click event to toggle tooltip on mobile
        phaseElement.addEventListener('click', function(e) {
            // Don't show tooltips if auto mode is actively running
            if (executionMode === 'auto' && isAutoRunning && !isPaused) return;
            
            // Check if it's a touch device
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                e.preventDefault();
                
                // Toggle tooltip
                const isShowing = this.classList.contains('show-tooltip');
                
                // Remove from all
                phases.forEach(p => p.classList.remove('show-tooltip'));
                
                // Add to this one if it wasn't showing
                if (!isShowing) {
                    this.classList.add('show-tooltip');
                    
                    // Adjust tooltip position to stay within viewport
                    const tooltip = this.querySelector('.phase-tooltip');
                    adjustTooltipPosition(tooltip);
                    
                    // Auto-hide after 3 seconds
                    setTimeout(() => {
                        this.classList.remove('show-tooltip');
                    }, 3000);
                }
            }
        });
    });
    
    // Button tooltip touch handler
    if (buttonWrapper) {
        let buttonTooltipTimeout;
        
        buttonWrapper.addEventListener('touchstart', function(e) {
            // Don't show tooltips if auto mode is actively running
            if (executionMode === 'auto' && isAutoRunning && !isPaused) return;
            
            // Don't prevent default - let the button click work
            // Just show the tooltip
            this.classList.add('show-tooltip');
            
            // Clear any existing timeout
            clearTimeout(buttonTooltipTimeout);
            
            // Auto-hide after 3 seconds
            buttonTooltipTimeout = setTimeout(() => {
                this.classList.remove('show-tooltip');
            }, 3000);
        });
        
        // Also handle long press on button
        let pressTimer;
        const clockTickBtn = document.getElementById('clockTick');
        
        if (clockTickBtn) {
            clockTickBtn.addEventListener('mousedown', function(e) {
                // Don't show tooltips if auto mode is actively running
                if (executionMode === 'auto' && isAutoRunning && !isPaused) return;
                
                // Only for non-touch devices
                if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
                    pressTimer = setTimeout(() => {
                        buttonWrapper.classList.add('show-tooltip');
                        
                        setTimeout(() => {
                            buttonWrapper.classList.remove('show-tooltip');
                        }, 3000);
                    }, 700);
                }
            });
            
            clockTickBtn.addEventListener('mouseup', function() {
                clearTimeout(pressTimer);
            });
            
            clockTickBtn.addEventListener('mouseleave', function() {
                clearTimeout(pressTimer);
            });
        }
    }
    
    // Program Counter tooltip touch handler
    const pcWrapper = document.querySelector('.pc-wrapper');
    if (pcWrapper) {
        let pcTooltipTimeout;
        
        pcWrapper.addEventListener('touchstart', function(e) {
            // Show the tooltip
            this.classList.add('show-tooltip');
            
            // Clear any existing timeout
            clearTimeout(pcTooltipTimeout);
            
            // Auto-hide after 3 seconds
            pcTooltipTimeout = setTimeout(() => {
                this.classList.remove('show-tooltip');
            }, 3000);
        });
        
        // Click handler for mobile
        pcWrapper.addEventListener('click', function(e) {
            // Check if it's a touch device
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                e.preventDefault();
                
                // Toggle tooltip
                const isShowing = this.classList.contains('show-tooltip');
                
                // Remove from all
                phases.forEach(p => p.classList.remove('show-tooltip'));
                if (buttonWrapper) {
                    buttonWrapper.classList.remove('show-tooltip');
                }
                
                // Add to this one if it wasn't showing
                if (!isShowing) {
                    this.classList.add('show-tooltip');
                    
                    // Auto-hide after 3 seconds
                    clearTimeout(pcTooltipTimeout);
                    pcTooltipTimeout = setTimeout(() => {
                        this.classList.remove('show-tooltip');
                    }, 3000);
                }
            }
        });
    }
    
    // Instruction Register tooltip touch handler
    const irWrapper = document.querySelector('.ir-wrapper');
    if (irWrapper) {
        let irTooltipTimeout;
        
        irWrapper.addEventListener('touchstart', function(e) {
            // Show the tooltip
            this.classList.add('show-tooltip');
            
            // Clear any existing timeout
            clearTimeout(irTooltipTimeout);
            
            // Auto-hide after 3 seconds
            irTooltipTimeout = setTimeout(() => {
                this.classList.remove('show-tooltip');
            }, 3000);
        });
        
        // Click handler for mobile
        irWrapper.addEventListener('click', function(e) {
            // Check if it's a touch device
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                e.preventDefault();
                
                // Toggle tooltip
                const isShowing = this.classList.contains('show-tooltip');
                
                // Remove from all
                phases.forEach(p => p.classList.remove('show-tooltip'));
                if (buttonWrapper) {
                    buttonWrapper.classList.remove('show-tooltip');
                }
                
                // Add to this one if it wasn't showing
                if (!isShowing) {
                    this.classList.add('show-tooltip');
                    
                    // Auto-hide after 3 seconds
                    clearTimeout(irTooltipTimeout);
                    irTooltipTimeout = setTimeout(() => {
                        this.classList.remove('show-tooltip');
                    }, 3000);
                }
            }
        });
    }
    
    // Accumulator tooltip touch handler
    const accumulatorWrapper = document.querySelector('.accumulator-wrapper');
    if (accumulatorWrapper) {
        let accTooltipTimeout;
        
        accumulatorWrapper.addEventListener('touchstart', function(e) {
            // Don't show tooltip if clicking the reset button
            if (e.target.closest('.reset-btn')) return;
            
            // Show the tooltip
            this.classList.add('show-tooltip');
            
            // Clear any existing timeout
            clearTimeout(accTooltipTimeout);
            
            // Auto-hide after 3 seconds
            accTooltipTimeout = setTimeout(() => {
                this.classList.remove('show-tooltip');
            }, 3000);
        });
        
        // Click handler for mobile
        accumulatorWrapper.addEventListener('click', function(e) {
            // Don't show tooltip if clicking the reset button
            if (e.target.closest('.reset-btn')) return;
            
            // Check if it's a touch device
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                e.preventDefault();
                
                // Toggle tooltip
                const isShowing = this.classList.contains('show-tooltip');
                
                // Remove from all
                phases.forEach(p => p.classList.remove('show-tooltip'));
                if (buttonWrapper) {
                    buttonWrapper.classList.remove('show-tooltip');
                }
                
                // Add to this one if it wasn't showing
                if (!isShowing) {
                    this.classList.add('show-tooltip');
                    
                    // Auto-hide after 3 seconds
                    clearTimeout(accTooltipTimeout);
                    accTooltipTimeout = setTimeout(() => {
                        this.classList.remove('show-tooltip');
                    }, 3000);
                }
            }
        });
    }
    
    // Close tooltips when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.execution-phase') && 
            !e.target.closest('.button-wrapper') && 
            !e.target.closest('.pc-wrapper') &&
            !e.target.closest('.ir-wrapper') &&
            !e.target.closest('.accumulator-wrapper')) {
            phases.forEach(p => p.classList.remove('show-tooltip'));
            if (buttonWrapper) {
                buttonWrapper.classList.remove('show-tooltip');
            }
            if (pcWrapper) {
                pcWrapper.classList.remove('show-tooltip');
            }
            if (irWrapper) {
                irWrapper.classList.remove('show-tooltip');
            }
            if (accumulatorWrapper) {
                accumulatorWrapper.classList.remove('show-tooltip');
            }
        }
        
        // Handle error tooltip on mobile
        if (!e.target.closest('tr.validation-error')) {
            const errorRows = document.querySelectorAll('tr.validation-error');
            errorRows.forEach(row => row.classList.remove('show-error-tooltip'));
        }
    });
    
    // Add touch handler for validation error tooltips
    document.addEventListener('touchstart', function(e) {
        const errorRow = e.target.closest('tr.validation-error');
        if (errorRow) {
            // Remove from all error rows
            const errorRows = document.querySelectorAll('tr.validation-error');
            errorRows.forEach(row => row.classList.remove('show-error-tooltip'));
            
            // Add to this row
            errorRow.classList.add('show-error-tooltip');
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                errorRow.classList.remove('show-error-tooltip');
            }, 3000);
        }
    });
}

// Validation tooltip handling
let validationTooltip = null;

function initializeValidationTooltips() {
    // Create tooltip element
    validationTooltip = document.createElement('div');
    validationTooltip.className = 'validation-tooltip';
    const arrow = document.createElement('div');
    arrow.className = 'validation-tooltip-arrow';
    validationTooltip.appendChild(arrow);
    document.body.appendChild(validationTooltip);
    
    // Add event listeners to RAM table
    const ramTable = document.getElementById('ram-table');
    
    ramTable.addEventListener('mouseover', (e) => {
        const errorRow = e.target.closest('tr.validation-error');
        if (errorRow && errorRow.hasAttribute('data-error') && validationTooltip) {
            const error = errorRow.getAttribute('data-error');
            const rect = errorRow.getBoundingClientRect();
            
            validationTooltip.textContent = error;
            validationTooltip.appendChild(arrow); // Re-append arrow after setting text
            
            // Remove any inline display style that might be blocking visibility
            validationTooltip.style.display = '';
            
            // Position above the row
            const tooltipHeight = 60; // Approximate
            validationTooltip.style.left = `${rect.left + rect.width / 2}px`;
            validationTooltip.style.top = `${rect.top - tooltipHeight - 10}px`;
            validationTooltip.style.transform = 'translateX(-50%)';
            
            // Show after a delay
            setTimeout(() => {
                if (validationTooltip) {
                    validationTooltip.classList.add('show');
                }
            }, 300);
        }
    });
    
    ramTable.addEventListener('mouseout', (e) => {
        const errorRow = e.target.closest('tr.validation-error');
        if ((errorRow || !e.relatedTarget || !e.relatedTarget.closest) && validationTooltip) {
            validationTooltip.classList.remove('show');
        }
    });
    
    // Handle mobile tap
    ramTable.addEventListener('touchstart', (e) => {
        const errorRow = e.target.closest('tr.validation-error');
        if (errorRow && errorRow.hasAttribute('data-error') && validationTooltip) {
            const error = errorRow.getAttribute('data-error');
            const rect = errorRow.getBoundingClientRect();
            
            validationTooltip.textContent = error;
            validationTooltip.appendChild(arrow);
            
            // Remove any inline display style that might be blocking visibility
            validationTooltip.style.display = '';
            
            const tooltipHeight = 60;
            validationTooltip.style.left = `${rect.left + rect.width / 2}px`;
            validationTooltip.style.top = `${rect.top - tooltipHeight - 10}px`;
            validationTooltip.style.transform = 'translateX(-50%)';
            
            validationTooltip.classList.add('show');
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                if (validationTooltip) {
                    validationTooltip.classList.remove('show');
                }
            }, 3000);
        }
    });
}

// Initialize the display
updateDisplay();
initializePillButton();
initializeTooltips();
initializeValidationTooltips();