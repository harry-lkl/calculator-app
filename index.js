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
let hasRunUnaryOperation = true;
let isDisabled = false;
let lastKey = '';
let lastKeyClass = '';
let memoryNum = '';

// init
function init() {
    mainSelector('key number', 'zero', '0');
    entry.style.fontSize = '3rem'; // default fontSize
}
init();

//  input listeners
window.addEventListener('click', clickInput);
function clickInput(e) {
    if (!e.target.classList.contains('key')) return;
    if (e.target.id === 'backspaceIcon') {
        return mainSelector('key modifier', 'backspace');
    }
    mainSelector(`${e.target.className}`, `${e.target.id}`, `${e.target.textContent}`);
}

window.addEventListener('keydown', keyInput);
function keyInput(e) {
    let key = '';
    if (e.key !== '/') {
        key = document.querySelector(`.key[data-key = "${e.key}"]`);
    } else if (e.key === '/') {
        key = document.querySelector(`.key[data-key = "÷"]`);
    } else {
        return errorHandler('error: key input');
    }
    if (!key) return;
    mainSelector(`${key.className}`, `${key.id}`, `${key.textContent}`);
}

// main selector
function mainSelector(className, id, key) {
    if (isDisabled === true) {
        return resetHandler('all');
    }
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
    console.log(className, id, key);
    console.table(currentOperation);
    console.table(history);
}

//  formatting
function resetHandler(key) {
    switch(key) {
        case '=':
            currentOperation = {...operationObj};
            hasRunUnaryOperation = false;
            break;
        case 'number':
            entry.textContent = '';
            break;
        case 'backspace':
            entry.textContent = '';
            break;
        case 'operator':
            currentOperation.currentNum = '';
            currentOperation.currentNumStr = '';
            hasRunUnaryOperation = false;
            break;
        case 'all':
            currentOperation = {...operationObj};
            hasRunUnaryOperation = false;
            isDisabled = false;
            lastKey = '';
            lastKeyClass = '';
            entry.textContent = '';
            operation.textContent = '';
            init();
            break;
        case 'entry':
            currentOperation.currentNum = '';
            currentOperation.currentNumStr = '';
            entry.textContent = '';
            hasRunUnaryOperation = false;
    }
}

function updateScreen(type) {
    switch(type) {
        case 'number':
            entry.textContent = currentOperation.currentNum;
            break;
        case 'operator':
            operation.textContent = `${currentOperation.storedNumStr} ${currentOperation.operator}`;
            entry.textContent = `${currentOperation.storedNum}`
            break;
        case '=':
            operation.textContent = 
                `${currentOperation.storedNumStr} ${currentOperation.operator} ${currentOperation.currentNumStr} =`;
            entry.textContent = currentOperation.result;
            break;
        case 'backspace':
            entry.textContent = currentOperation.currentNum;
    }
}

//  numbers
function addNumber(key) {
    // if (ranQuickFunction) return;
    if (lastKeyClass === 'key operator') {
        resetHandler('number');
    }
    if (lastKey === '=') {
        resetHandler('all');
    }
    if (currentOperation.currentNum === '0') {
        currentOperation.currentNum = '';
    }
    appendNum(key);
    updateScreen('number');
}

function appendNum(key) {
    currentOperation.currentNum += key;
    currentOperation.currentNumStr = currentOperation.currentNum;
}

// operators
function selectOperator(key) { // + - * ÷ =
    if (key === '=') {
        return operate(key);
    }
    yeetDot();
    if (lastKey === '=') { // continue after equal
        recallResult();
        setOperator(key);
    } else if (!currentOperation.operator && currentOperation.currentNum !== '') { // fresh number
        storeNum();
        setOperator(key);
    } else if(!currentOperation.operator && currentOperation.currentNum ==='') { // empty current number
        appendNum('0');
        storeNum();
        setOperator(key);
    } else if (currentOperation.currentNum === '' && currentOperation.operator) { // swap between operators
        setOperator(key);
    } else if (currentOperation.storedNum !== '' && currentOperation.operator && currentOperation.currentNum !== '') {
        chainOperation(key);
    } 
    resetHandler('operator');
    updateScreen('operator');
}

function setOperator(key) {
    currentOperation.operator = key;
}

function recallResult() {
    currentOperation.storedNum = history[0].result;
    currentOperation.storedNumStr = history[0].result;
}

function storeNum() {
    currentOperation.storedNum = currentOperation.currentNum;
    currentOperation.storedNumStr = currentOperation.currentNumStr;
}

function chainOperation(key) {
    operate('=');
    recallResult();
    setOperator(key);
}

//  operations
function operate(key) {
    yeetDot();
    if (lastKey === '=') {
        chainEqualHandler();
    }
    if (checkOperationState() === 'ready set go') {
        currentOperation.result = doMaths();
    } else if (checkOperationState() === 'no second operand') {
        autoFillSecondNum();
        currentOperation.result = doMaths();
    } else if (checkOperationState() === 'only first operand') {
        currentOperation.result = currentOperation.currentNum;
    } else if (checkOperationState() === 'why') {
        currentOperation.currentNum = 0;
        currentOperation.currentNumStr = '0';
        currentOperation.result = 0;
    } else {
        return errorHandler(`operate error`);
    }
    if (currentOperation.operator === '÷' && currentOperation.currentNumStr === '0') return errorHandler(`pffft lmao`);
    history.unshift({...currentOperation});
    updateScreen('=');
    resetHandler('=');
}

function chainEqualHandler() {
    currentOperation.storedNum = `${history[0].result}`;
    currentOperation.storedNumStr = `${history[0].result}`
    currentOperation.currentNum = `${history[0].currentNum}`;
    currentOperation.currentNumStr = `${history[0].currentNumStr}`;
    currentOperation.operator = `${history[0].operator}`;
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

function checkOperationState() {
    if(currentOperation.storedNum !== '' && currentOperation.operator && currentOperation.currentNum === '') {
        return 'no second operand';
    } else if (currentOperation.storedNum !== '' && currentOperation.operator && currentOperation.currentNum !== '') {
        return 'ready set go';
    } else if (currentOperation.storedNum === '' && !currentOperation.operator && currentOperation.currentNum !== '') {
        return 'only first operand';
    } else if (currentOperation.storedNum === '' && !currentOperation.operator && currentOperation.currentNum === '') {
        return 'why';
    } else {
        return errorHandler(`state check error`);
    }
}

//  x-functions
function runFunction(id) {
    switch(id) {
        case 'negate':
            negate();
            break;
        case 'percent':
            percent();
            break;
        case 'squared':
            squared();
            break;
        case 'sqrt':
            sqrt();
        }
}

function negate() {

}

function percent() {
    hasRunUnaryOperation = true;
}

function squared() {
    hasRunUnaryOperation = true;
}

function sqrt() {
    hasRunUnaryOperation = true;
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
            resetHandler('entry');
    }
}

function backspace() {
    if (lastKey === '=') {
        return resetHandler('all');
    } else if (lastKeyClass === 'key operator') {
        return resetHandler('backspace');
    }
    if (!currentOperation.currentNum || hasRunUnaryOperation === true) return;
    detach();
    updateScreen('backspace');
}

function detach() {
    const num = currentOperation.currentNum;
    const numLength = num.length;
    const newNum = currentOperation.currentNum.slice(0, numLength - 1);
    currentOperation.currentNum = newNum;
    currentOperation.currentNumStr = newNum;
}

function dot() {
    if (lastKeyClass === 'key operator') {
        resetHandler('number');
    }
    const dotIndex = currentOperation.currentNum.indexOf('.');
    if (dotIndex !== -1) return;
    if (lastKey === '=' || currentOperation.currentNum === '') {
        addNumber('0');
    }
    currentOperation.currentNum += '.';
    currentOperation.currentNumStr += '.';
    updateScreen('number');
}

function yeetDot() {
    if (!currentOperation.currentNumStr.endsWith('.')) return;
    currentOperation.currentNum = parseFloat(currentOperation.currentNum);
    currentOperation.currentNumStr = currentOperation.currentNumStr.slice(0, -1);
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

function errorHandler(string) {
    operation.textContent = (`error:`)
    entry.textContent = (`${string}`);
    isDisabled = true;
}
