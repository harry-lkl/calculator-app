const entry = document.getElementById('entry');
const entryBox = document.getElementById('entryBox')
const defaultFontSize = '3.5rem';
const defaultSubFontSize = '2.6rem';
const history = [];
/* const memory = document.getElementById('memory'); */
const operation = document.getElementById('operation');
const operationBox = document.getElementById('operationBox');
const operationObj = {
    storedNum: '',
    storedNumStr: '',
    currentNum: '',
    currentNumStr: '',
    operator: '',
    result: '',
}

let currentOperation = {...operationObj};
let hasRunUnaryOperation = false;
let isDisabled = false;
let lastKey = '';
let lastKeyClass = '';
let memoryNum = '';

// init
function init() {
    mainSelector('key number', 'zero', '0');
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
            memorySelector(id);
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
            entry.textContent = `${currentOperation.storedNum}`
            operation.textContent = `${currentOperation.storedNumStr} ${currentOperation.operator}`;
            break;
        case '=':
            entry.textContent = currentOperation.result;
            operation.textContent = 
                `${currentOperation.storedNumStr} ${currentOperation.operator} ${currentOperation.currentNumStr} =`;
            break;
        case 'backspace':
            entry.textContent = currentOperation.currentNum;
            break;
        case 'unary':
            entry.textContent = currentOperation.currentNum;
            operation.textContent = 
                `${currentOperation.storedNumStr} ${currentOperation.operator} ${currentOperation.currentNumStr}`;
            break;
        case 'memory':
            memory.textContent = memoryNum;
    }
    formatScreen();
    processScreen();
}
  
function processScreen() {
    operation.style.fontSize = defaultSubFontSize;
    resizeOperation();
    entry.style.fontSize = defaultFontSize;
    resizeEntry();
}

function resizeEntry() {
    const targetHeight = entryBox.clientHeight;
    const halfTargetHeight = targetHeight * 0.8;
    const entryLength = entry.textContent.length;
    console.log(targetHeight, halfTargetHeight, entryLength)
    if (entryLength >= 10 && entry.clientHeight < halfTargetHeight) {
        return
    }
    if (entryLength <10 && entry.clientHeight < targetHeight) {
        return;
    }
    let fontSize = window.getComputedStyle(entry).fontSize;
    entry.style.fontSize = `${(parseFloat(fontSize) - 1) / 16}rem`;
    resizeEntry();
}

function resizeOperation() {
    if (operation.clientHeight < operationBox.clientHeight) return;
    let fontSize = window.getComputedStyle(operation).fontSize;
    operation.style.fontSize = `${(parseFloat(fontSize) -1) / 16}rem`;
    resizeOperation();
}

function formatScreen() {
    if (entry.textContent === '') {
        return;
    }
    if (parseFloat(entry.textContent) === 0) {
        return;
    }
    const entryOutput = entry.textContent;
    const localEntryOutput = parseFloat(entryOutput).toLocaleString("en-US", {maximumSignificantDigits: 15});
    entry.textContent = localEntryOutput;
    console.log(entryOutput, localEntryOutput);
}

//  numbers
function addNumber(key) {
    if (hasRunUnaryOperation === true) return;
    if (lastKeyClass === 'key operator') {
        resetHandler('number');
    }
    if (lastKey === '=' || lastKeyClass === 'key memory') {
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
        recallResult('stored');
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

function recallResult(target) {
    switch (target) {
        case 'stored':
            currentOperation.storedNum = history[0].result;
            currentOperation.storedNumStr = history[0].result.toString();
            break;
        case 'current':
            currentOperation.currentNum = history[0].result;
            currentOperation.currentNumStr = history[0].result.toString();
    }
}

function storeNum() {
    currentOperation.storedNum = currentOperation.currentNum;
    currentOperation.storedNumStr = currentOperation.currentNumStr;
}

function chainOperation(key) {
    operate('=');
    recallResult('stored');
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
    if (!isFinite(currentOperation.result)) {
        return errorHandler(`pffft lmao`);
    }
    history.unshift({...currentOperation});
    updateScreen('=');
    resetHandler('=');
}

function chainEqualHandler() {
    currentOperation.currentNum = `${history[0].currentNum}`;
    currentOperation.currentNumStr =  currentOperation.currentNum;
    if (history[0].storedNum !== '') {
        currentOperation.storedNum = `${history[0].result}`;
        currentOperation.storedNumStr = currentOperation.storedNum;
    }
    if (history[0].operator !== '') {
        currentOperation.operator = `${history[0].operator}`;
    }
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
    yeetDot();
    if (lastKey === '=') {
        recallResult('current');
    }
    if (checkOperationState() === 'no second operand') {
        restoreCurrentNum();
    }
    if (checkOperationState() === 'why') {
        addNumber('0');
    }
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

function restoreCurrentNum() {
    currentOperation.currentNum = currentOperation.storedNum;
    currentOperation.currentNumStr = currentOperation.currentNum.toString();
}

function negate() {
    if (currentOperation.currentNum === '0') {
        return;
    }
    const dashIndex = currentOperation.currentNumStr.indexOf('-');
    const strLength = currentOperation.currentNumStr.length;
    if (dashIndex === 0) {
        currentOperation.currentNumStr = currentOperation.currentNumStr.slice(1);
    } else if (dashIndex !== 0) {
        currentOperation.currentNumStr = `-${currentOperation.currentNumStr}`
    } else {
        return errorHandler(`negate error`)
    }
    currentOperation.currentNum *= -1;
    updateScreen('unary');
}

function percent() {
    hasRunUnaryOperation = true;
    let a = currentOperation.storedNum;
    let b = currentOperation.currentNum;
    if (currentOperation.operator === '+' || currentOperation.operator === '-') {
        currentOperation.currentNum = a * b / 100;
        currentOperation.currentNumStr = `${currentOperation.currentNum}`;
    } else if (currentOperation.operator === '×' || currentOperation.operator === '÷' || currentOperation.operator === '') {
        currentOperation.currentNum /= 100;
        currentOperation.currentNumStr = `${currentOperation.currentNum}`;
    }
    updateScreen('unary');
}

function squared() {
    hasRunUnaryOperation = true;
    currentOperation.currentNum **= 2;
    currentOperation.currentNumStr = `(${currentOperation.currentNumStr})²`
    updateScreen('unary');
}

function sqrt() {
    hasRunUnaryOperation = true;
    if (currentOperation.currentNum < 0) {
        return errorHandler(`imagine`);
    }
    currentOperation.currentNum = Math.sqrt(currentOperation.currentNum);
    currentOperation.currentNumStr = `²/(${currentOperation.currentNumStr})`;
    updateScreen('unary');
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

function backspace() {
    if (currentOperation.currentNum === '' || hasRunUnaryOperation === true) return;
    if (lastKey === '=') {
        return resetHandler('all');
    } else if (lastKeyClass === 'key operator') {
        return resetHandler('backspace');
    }
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
    const dotIndex = currentOperation.currentNumStr.indexOf('.');
    if (dotIndex !== -1) return;
    if (lastKey === '=' || currentOperation.currentNum === '') {
        addNumber('0');
    }
    currentOperation.currentNum += '.';
    currentOperation.currentNumStr += '.';
    entry.textContent += '.';
}

function yeetDot() {
    if (!currentOperation.currentNumStr.endsWith('.')) return;
    currentOperation.currentNum = parseFloat(currentOperation.currentNum);
    currentOperation.currentNumStr = currentOperation.currentNumStr.slice(0, -1);
}

function clearEntry() {
    if (currentOperation.operator === '') {
        return resetHandler('all');
    }
    resetHandler('entry');
}

// memory
function memorySelector(id) {
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

function memoryClear() {
    memoryNum = '';
    updateScreen('memory');
}

function memoryRecall() {
    if (memoryNum === '') {
        return;
    }
    currentOperation.currentNum = parseFloat(memoryNum);
    currentOperation.currentNumStr = memoryNum.toString();
    updateScreen('unary');
}

function memoryAdd() {
    if (memoryNum === '') {
        return;
    }
    if (lastKey === '=') {
        recallResult('current');
    }
    memoryNum += parseFloat(currentOperation.currentNum);
    updateScreen('memory');
}

function memorySubtract() {
    if (memoryNum === '') {
        return;
    }
    if (lastKey === '=') {
        recallResult('current');
    }
    memoryNum -= parseFloat(currentOperation.currentNum);
    updateScreen('memory');
}

function memoryStore() {
    if (lastKey === '=') {
        recallResult('current');
    }
    memoryNum = parseFloat(currentOperation.currentNum);
    updateScreen('memory');
}

// error handler
function errorHandler(string) {
    operation.textContent = (`error:`)
    entry.textContent = (`${string}`);
    isDisabled = true;
}

// need to stop overly long numbers being stored into numStr
// stop user from inputting numbers too long/format if it gets too long