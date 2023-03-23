const entry = document.getElementById('entry');
const operation = document.getElementById('operation');
const memory = document.getElementById('memory');
const history = [];
const operationObj = {
    firstNum: '',
    firstNumStr: '',
    secondNum: '',
    secondNumStr: '',
    operator: '',
    result: '',
}

let chainingOperator = false;
let currentNum = '';
let currentNumStr = '';
let currentOperation = operationObj;
let lastKey = '';
let ranFunction = false;

function resetHandler(key) {
    switch(key) {
        case '=':
/*             chainingOperator = false;
            currentNum = result;
            currentNumStr = result;
            currentOperation = operationObj;
            ranFunction = false;
            break; */
    }
}

// init
function init() {
    addNumber('0');
    entry.style.fontSize = '3rem'; // default fontSize
}
init();

//  input listeners
window.addEventListener('click', clickInput);
function clickInput(e) {
    if (!e.target.classList.contains('key')) return console.log(`not valid key`);
    if (e.target.id === 'backspaceIcon') return mainSelector('key modifier', 'backspace');
    mainSelector(`${e.target.className}`, `${e.target.id}`, `${e.target.textContent}`);
}

window.addEventListener('keydown', keyInput);
function keyInput(e) {
    let key = 'error: no key';
    if (e.key === '\\') {
        key = document.querySelector(`.key[data-key = "÷"]`)
    } else {
        key = document.querySelector(`.key[data-key = "${e.key}"]`)
    }
    if (!key) return;
    mainSelector(`${key.className}`, `${key.id}`, `${key.textContent}`);
}

// main selector
function mainSelector(className, id, key) {
    console.log(className, id, key, currentOperation)
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
    formatScreen();
}

//formatting
function formatScreen() {
    // update operation, memory, and entry;
}

//  numbers
function addNumber(key) {
    if (ranFunction === true) return;
    if (currentNum === '0') currentNum = '';
    currentNum += key;
    currentNumStr = currentNum;
    entry.textContent = currentNum;
}

function selectOperator(key) {
    if (key === '=') return operate(key);
    currentOperation.firstNum = currentNum;
    currentOperation.firstNumStr = currentNumStr;
    currentOperation.operator = key;
}
//  operations
function operate(key) {
    currentOperation.secondNum = currentNum;
    currentOperation.secondNumStr = currentNumStr;
    if (currentOperation.operator) currentOperation.result = maths(); // if there's an operator, do maths
    if (!currentOperation.result) return errorHandler();
    history.push(currentOperation);
    formatScreen();
    resetHandler(key);
}

function maths() {
    a = parseFloat(currentOperation.firstNum);
    b = parseFloat(currentOperation.secondNum);
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
    return console.log(id);
    switch(id) {
        case 'backspace':
            backspace();
            break;
        case 'dot':
            dot();
            break;
        case 'clearAll':
            resetAll();
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
    console.log(`triggered error handler`)
}
