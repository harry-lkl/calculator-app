const entry = document.getElementById('entry');
const operation = document.getElementById('operation');
const memory = document.getElementById('memory');
const history = [];

let currentNum = '';
let currentNumStr = '';
let currentOperation = {
    firstNum: '',
    firstNumStr: '',
    secondNum: '',
    secondNumStr: '',
    operator: '',
    operatorSymbol: '',
    result: '',
}
let ranFunction = false;


// init
function init() {
    addNumber('0');
    entry.style.fontSize = '3rem'; // default fontSize
}
init();

//  input listeners
window.addEventListener('click', clickInput);
function clickInput(e) {
    if (!e.target.classList.contains('key')) return console.log(`no`);
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
    mainSelector(`${key.className}`, `${key.id}`, `${e.key}`);
}

// reset
function resetOperationObj() {
    currentOperation = {
        firstNum: '0',
        firstNumStr: '0',
        secondNum: '',
        secondNumStr: '',
        operator: '',
        operatorSymbol: '',
        result: '',
    }
}

// main selector
function mainSelector(className, id, key) {
    console.log(key);
    switch(className) {
        case 'key number':
            addNumber(key);
            break;
        case 'key operator':
            selectOperator(id, key);
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
}

//  numbers
function addNumber(key) {
    if (ranFunction === true) return;
    if (entry.textContent === '0') entry.textContent = '';
    entry.textContent += key;
    currentNum = entry.textContent;
    currentNumStr = currentNum;
}

function selectOperator(id) {
    return console.log(id);
}
//  operations
function operate() {
    console.log('hi')
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
