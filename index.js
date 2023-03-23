const entry = document.getElementById('entry');
const operation = document.getElementById('operation');
const memory = document.getElementById('memory');
const history = [];
const operationObj = {
    storedNum: '',
    storedNumStr: '',
    currentNum: '',
    currentNumStr: '',
    operator: '',
    result: '',
}

let currentOperation = {...operationObj};
let lastKey = '';
let lastKeyClass = '';
let memoryNum = '';

function resetHandler(key) {
    switch(key) {
        case '=':
            currentOperation = {...operationObj};
            break;
        case 'number':
            entry.textContent = '';
            break;
        case 'operator':
            currentOperation.currentNum = '';
            currentOperation.currentNumStr = '';
            break;
        case 'all':
            currentOperation = {...operationObj};
            lastKey = '';
            lastKeyClass = '';
            entry.textContent = '';
            operation.textContent = '';
            init();
    }
}

// init
function init() {
    mainSelector('key number', 'zero', '0');
    entry.style.fontSize = '3rem'; // default fontSize
}
init();

//  input listeners
window.addEventListener('click', clickInput);
function clickInput(e) {
    if (!e.target.classList.contains('key')) return /* console.log(`not valid key`) */;
    if (e.target.id === 'backspaceIcon') return mainSelector('key modifier', 'backspace');
    mainSelector(`${e.target.className}`, `${e.target.id}`, `${e.target.textContent}`);
}

window.addEventListener('keydown', keyInput);
function keyInput(e) {
    let key = '';
    if (e.key !== '\\') {
        key = document.querySelector(`.key[data-key = "${e.key}"]`)
    } else if (e.key === '\\') {
        key = document.querySelector(`.key[data-key = "÷"]`)
    } else {
        errorHandler('error: key input')
    }
    if (!key) return;
    mainSelector(`${key.className}`, `${key.id}`, `${key.textContent}`);
}

// main selector
function mainSelector(className, id, key) {
    switch(className) {
        case 'key number':
            addNumber(key);
            break;
        case 'key operator':
            selectOperator(key);
            break;
        case 'key function':
            runFunction(id);
            break;
        case 'key modifier':
            modifyDisplay(id);
            break;
        case 'key memory':
            selectMemory(id);
    }
    lastKey = key;
    lastKeyClass = className;
    console.log(currentOperation);
    console.log(className, id, key);
}

//  formatting
function updateScreen(type) {
    switch(type) {
        case 'number':
            entry.textContent = currentOperation.currentNum;
            break;
        case 'operator':
            operation.textContent = `${currentOperation.storedNumStr} ${currentOperation.operator}`;
            break;
        case 'equal':
            operation.textContent = `${currentOperation.storedNumStr} ${currentOperation.operator} ${currentOperation.currentNumStr}`;
            entry.textContent = currentOperation.result;
            break;
    }
}

//  numbers
function addNumber(key) {
    // if (ranQuickFunction) return;
    if (lastKeyClass === 'key operator') resetHandler('number');
    if (lastKey === '=') resetHandler('all');
    if (currentOperation.currentNum === '0') currentOperation.currentNum = '';
    updateCurrentNum();
    updateScreen('number');
}

function updateCurrentNum() {
    currentOperation.currentNum += key;
    currentOperation.currentNumStr = currentOperation.currentNum;
}

function selectOperator(key) {
    if (key === '=') return operate();
    if (!currentOperation.operator) {
        storeNum();
        setOperator(key);
    } else if (!currentOperation.currentNum && currentOperation.operator) {
        setOperator(key);
    } else if (currentOperation.storedNum && currentOperation.operator && currentOperation.currentNum) {
        chainOperation(key);
    }
    resetHandler('operator');
    updateScreen('operator');
}

function setOperator() {
    currentOperation.operator = key;
}

function storeNum() {
    currentOperation.storedNum = currentOperation.currentNum;
    currentOperation.storedNumStr = currentOperation.currentNumStr;
}

//  operations
function operate() {
    if (lastKey === '=') chainEqual();
    if (lastKeyClass === 'key operator' && !currentOperation.currentNum) autoFillSecondNum();
    if (currentOperation.operator) currentOperation.result = doMaths();
    if (!currentOperation.result) return errorHandler();
    history.unshift({...currentOperation});
    updateScreen('equal');
    resetHandler('key');
}

function chainEqual() {
    currentOperation.storedNum = `${history[0].result}`;
    currentOperation.storedNumStr = `${history[0].result}`
    currentOperation.currentNum = `${history[0].currentNum}`;
    currentOperation.currentNumStr = `${history[0].currentNumStr}`;
}

function autoFillSecondNum() {
    currentOperation.currentNum = currentOperation.storedNum;
    currentOperation.currentNumStr = currentOperation.storedNumStr;
}

function doMaths() {
    a = parseFloat(currentOperation.storedNum);
    b = parseFloat(currentOperation.currentNum);
    switch(currentOperation.operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '×':
            return a * b;
        case '÷':
            return a / b;
    }
}

function chainOperation() {
    // equal
    // set the thing
}

//  x-functions
function runFunction(id) {
    return console.log(id);
    switch(id) {
        case 'percent':
            percent();
            break;
        case 'squared':
            squared();
            break;
        case 'sqrt':
            sqrt();
            break;
        case 'negate':
            negate();
        }
}

//  entry modifiers
function modifyDisplay(id) {
    switch(id) {
        case 'backspace':
            backspace();
            break;
        case 'dot':
            dot();
            break;
        case 'clearAll':
            resetHandler('all');
            break;
        case 'clearEntry':
            clearEntry();
    }
}

function memorySelector(id) {
    return console.log(id);
    switch(id) {
        case 'memoryClear':
            memoryClear();
            break;
        case 'memoryRecall':
            memoryRecall();
            break;
        case 'memory+':
            memoryAdd();
            break;
        case 'memory-':
            memorySubtract();
            break;
        case 'memoryStore':
            memoryStore();
    }
}

function errorHandler() {
    console.log(`triggered error handler plz send help`)
}
