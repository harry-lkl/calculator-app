const memory = document.getElementById('memory');
const operation = document.getElementById('operation');
const entry = document.getElementById('entry');
const calculator = document.getElementById('keys');
const entryMaxLength = 12;

let backspaceLock = false;
let disabled = false;
let isChaining = false;
let negated = false;
let operator = '';
let operatorSymbol = '';
let userEnteredEqual = false;
let userEnteredNum = true;
let userEnteredOperator = false;
let xFunction = '';
let currentNum = '0';
let currentNumStr = '0';
let storedNum = '';
let storedNumStr = '';
let result = '';

//  resets
function resetAll() {
    backspaceLock = false;
    disabled = false;
    isChaining = false;
    negated = false;
    operator = '';
    operatorSymbol = '';
    userEnteredEqual = false;
    userEnteredNum = true;
    userEnteredOperator = false;
    xFunction = '';
    currentNum = '0';
    currentNumStr = '0';
    storedNum = '';
    storedNumStr = '';
    result = '';
    entry.textContent = currentNum;
    operation.textContent = '';
}

//  formatting
function clearEntry() {
    entry.textContent = '';
    currentNum = '';
    currentNumStr = currentNum;
}
const displayOperation = () => operation.textContent = `${storedNumStr} ${operatorSymbol} ${currentNumStr} =`
const yeetCommas = () => entry.textContent.replace(/,/g, '');
const toNum = () => +yeetCommas();
function formatNum() {
    const decimalIndex = yeetCommas().indexOf('.');
    let maxDecimals = entryMaxLength;
    if (decimalIndex !== -1) maxDecimals = entryMaxLength - decimalIndex;
    entry.textContent = toNum().toLocaleString('en', {maximumFractionDigits: maxDecimals});
}
function yeetDot() {
    if (xFunction === '') {
        currentNum = +currentNum;
        currentNumStr = +currentNumStr;
        entry.textContent = currentNum;
        formatNum();
    }
}

//  key-press listener
calculator.addEventListener('click', function (e) {
    if (disabled === true) {
        resetAll();
    } else if (disabled === false) {
        switch(e.target.className) {
            case 'key number':
                addNumber(e.target.id);
                break;
            case 'key operator':
                operate(e.target.id);
                break;
            case 'key function':
                runFunction(e.target.id);
                break;
            case 'key modifier':
                modify(e.target.id);
        }
    } else {
        return console.log(`error: event listeners`)
        disabled = true;
    }
    });

//  numbers
function addNumber(id) {
    userEnteredNum = true;
    if (xFunction !== '') return;
    let digitCount = yeetCommas().length;
    if (digitCount >= entryMaxLength && userEnteredOperator === false) return;
    if (userEnteredEqual === true) resetAll();
    if (userEnteredOperator === true || entry.textContent === '0') clearEntry();
    userEnteredOperator = false;
    switch(id) {
        case 'zero':
            entry.textContent += '0';
            break;
        case 'one':
            entry.textContent += '1';
            break;
        case 'two':
            entry.textContent += '2';
            break;
        case 'three':
            entry.textContent += '3';
            break;
        case 'four':
            entry.textContent += '4';
            break;
        case 'five':
            entry.textContent += '5';
            break;
        case 'six':
            entry.textContent += '6';
            break;
        case 'seven':
            entry.textContent += '7';
            break;
        case 'eight':
            entry.textContent += '8';
            break;
        case 'nine':
            entry.textContent += '9';
    }
    currentNum = toNum();
    currentNumStr = currentNum;
    formatNum();
}

//  operations
function operate(id) {
    yeetDot();
    if (id === 'equal') {
        isChaining = false;
        userEnteredNum = false;
        if (operator === '') {
            userEnteredEqual = true;
            result = currentNum;
            return displayOperation();
        }
        if (userEnteredEqual === false) {
            userEnteredEqual = true;
            normalEqual();
        } else if (userEnteredEqual === true) {
            userEnteredEqual = false;
            chainEqual();
        } else {
            console.log(`error: equal`)
            disabled = true;
        }
    } else {
        backspaceLock = false;
        userEnteredOperator = true;
        if (isChaining === true && userEnteredNum === true) {
            userEnteredNum = false;
            chainOperation(id);
        } else {
            isChaining = true;
            userEnteredNum = false;
            normalOperation(id);
        }
        userEnteredEqual = false;
    }
    xFunction = '';
}

function normalEqual() {
    runOperations();
    if (typeof result === 'string' && result.indexOf('e') !== -1) {
        entry.textContent = `pfft lmao`;
        operation.textContent = result;
        disabled = true;
        return;
    }
    console.log(`${storedNumStr} ${operatorSymbol} ${currentNumStr} = ${result}`)
    displayOperation();
    entry.textContent = result;
    formatNum();
}

function chainEqual() {
    storedNum = result;
    storedNumStr = storedNum;
    userEnteredEqual = true;
    normalEqual();
}

function normalOperation(id) {
    if (userEnteredEqual === true) {
        currentNum = result;
        currentNumStr = currentNum;
    }
    storedNum = currentNum;
    storedNumStr = currentNumStr;
    setOperation(id);
    operation.textContent = `${storedNumStr} ${operatorSymbol}`
    entry.textContent = storedNum;
    formatNum();
}

function chainOperation(id) {
    operate('equal');
    operate(id);
}

function setOperation(id) {
    switch(id) {
        case 'add':
            operatorSymbol = '+';
            operator = 'add';
            break;
        case 'subtract':
            operatorSymbol = '-';
            operator = 'subtract';
            break;
        case 'multiply':
            operatorSymbol = '×';
            operator = 'multiply';
            break;
        case 'divide':
            operatorSymbol = '÷';
            operator = 'divide';
    }
    operation.textContent = `${storedNumStr} ${operatorSymbol}`;
}

const add = () => result = storedNum + currentNum;
const subtract = () => result = storedNum - currentNum;
const multiply = () => result = storedNum * currentNum;
const divide = () => result = storedNum / currentNum;

function runOperations() {
    switch(operator) {
        case 'add':
            add();
            break;
        case 'subtract':
            subtract();
            break;
        case 'multiply':
            multiply();
            break;
        case 'divide':
            if (currentNum === 0) return result = `error: x/0`;
            divide();
    }
}

//  x-functions
function runFunction(id) {
    backspaceLock = true;
    yeetDot();
    if (userEnteredEqual === true) {
        userEnteredEqual = false;
        let tempNum = result;
        resetAll();
        currentNum = tempNum;
        currentNumStr = currentNum;
    }
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

function percent() {
    if (operator === 'add' || operator === 'subtract') {
        currentNum = storedNum * currentNum / 100;
    } else {
        currentNum = currentNum / 100;
    }
    currentNumStr = currentNum;
    operation.textContent = `${storedNum} ${operatorSymbol} ${currentNum}`
    entry.textContent = currentNum;
    formatNum();
}

function squared() {
    xFunction = 'squared';
    currentNum = currentNum ** 2;
    currentNumStr = `(${currentNumStr})²`
    entry.textContent = currentNum;
    operation.textContent = `${storedNumStr} ${operatorSymbol} ${currentNumStr}`
    formatNum();
}

function sqrt() {
    xFunction = 'sqrt';
    if (currentNum < 0) {
        operation.textContent = `error: sqrt(negative)`
        entry.textContent = `imagine`
        disabled = true;
        return;
    } else if (currentNum >= 0) {
        currentNum = Math.sqrt(currentNum);
        currentNumStr = `√(${currentNumStr})`;
        entry.textContent = currentNum;
        operation.textContent = `${storedNumStr} ${operatorSymbol} ${currentNumStr}`;
        formatNum();
    } else {
        console.log(`error: sqrt`);
    }
}

//  entry modifiers
function modify(id) {
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
            currentNum = '0';
            currentNumStr = currentNum;
            entry.textContent = currentNum;
    }
}

function backspace() {
    if (backspaceLock === true) return;
    const absNumString = yeetCommas().replace(/-|(0.)/g, '');
    const absNumLength = absNumString.length;
    const numString = yeetCommas();
    const numLength = numString.length;
    if (absNumLength === 1) {
        xFunction = '';
        clearEntry();
        addNumber('zero');
        return;
    }
    currentNum = +numString.slice(0, numLength - 1);
    currentNumStr = currentNum;
    entry.textContent = currentNum;
    formatNum();
}

function dot() {
    if (xFunction !== '') return;
    if (userEnteredEqual === true || userEnteredOperator === true) addNumber('zero');
    if (entry.textContent.indexOf('.') === -1) {
        entry.textContent += '.';
        currentNum += '.';
        currentNumStr += '.';
    }
}

function negate() {
    if (currentNum === '0') return;
    numString = currentNumStr.toString();
    if (numString.indexOf('-') !== 0) {
        currentNumStr = `-${currentNumStr}`;
    } else if (numString.indexOf('-') === 0) {
        currentNumStr = currentNumStr.slice(1);
    } else {
        console.log(`error: negate`);
        disabled = true;
    }
    currentNum = -currentNum;
    operation.textContent = `${storedNumStr} ${operatorSymbol} ${currentNumStr}`
    entry.textContent = currentNum;
    formatNum();
}
