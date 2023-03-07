const memory = document.getElementById('memory');
const operation = document.getElementById('operation');
const entry = document.getElementById('entry');
const calculator = document.getElementById('keys');
const entryMaxLength = 12;

let backspaceLock = false;
let disabled = false;
let isChaining = false;
let operator = '';
let operatorSymbol = '';
let userEnteredEqual = false;
let userEnteredNum = true;
let userEnteredOperator = false;
let xFunction = '';
let storedNum = '';
let currentNum = '';
let storedNumStr = '';
let currentNumStr = '';
let result = '';

//  resets
function resetAll() {
    backspaceLock = false;
    disabled = false;
    isChaining = false;
    operator = '';
    operatorSymbol = '';
    userEnteredEqual = false;
    userEnteredNum = true;
    userEnteredOperator = false;
    xFunction = '';
    currentNum = '';
    currentNumStr = '';
    storedNum = '';
    storedNumStr = '';
    result = '';
    entry.textContent = 0;
    operation.textContent = '';
}

//  formatting
const yeetCommas = () => entry.textContent.replace(/,/g, '');
const toNum = () => +yeetCommas();
function formatNum() {
    const decimalIndex = yeetCommas().indexOf('.');
    let maxDecimals = entryMaxLength;
    if (decimalIndex !== -1) maxDecimals = entryMaxLength - decimalIndex;
    entry.textContent = toNum().toLocaleString('en', {maximumFractionDigits: maxDecimals});
}
const clearEntry = () => entry.textContent = '';

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
    let digitCount = yeetCommas().length;
    if (userEnteredEqual === true) {
        resetAll();
    }
    if (userEnteredOperator === true || entry.textContent === '0') clearEntry();
    if (digitCount >= entryMaxLength && userEnteredOperator === false) return;
    if (xFunction !== '') return;
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

function storeNum() {

}

//  operations
function operate(id) {
    xFunction = '';
    if (id === 'equal') {
        isChaining = false;
        userEnteredNum = false;
        if (userEnteredEqual === false) {
            userEnteredEqual = true;
            currentNum = toNum();
            currentNumStr = currentNum;
            if (operator === '') result = currentNum;
            if (operator !== '') runOperations();
            if (typeof result === 'string' && result.indexOf('e') !== -1) {
                entry.textContent = `pfft lmao`;
                operation.textContent = result;
                disabled = true;
                return;
            }
            operation.textContent = `${storedNumStr} ${operatorSymbol} ${currentNumStr} =`;
            entry.textContent = result;
            console.log(`${storedNumStr} ${operatorSymbol} ${currentNumStr} = ${result}`)
            formatNum();
        } else if (userEnteredEqual === true) {
            userEnteredEqual = false;
            if (operator === '') {
                return operate(id);
            } else if (operator !== '') {
                storedNum = toNum();
                storedNumStr = storedNum;
                entry.textContent = currentNum;
                operate(id);
            } else {
                console.log(`error: equal chain`);
                disabled = true;
            }
        } else {
            console.log(`error: equal`)
            disabled = true;
        }
        console.log(id);
    } else {
        backspaceLock = false;
        userEnteredEqual = false;
        userEnteredOperator = true;
        if (isChaining === true && userEnteredNum === true) {
            userEnteredNum = false;
            operate('equal');
            currentNum = toNum();
            currentNumStr = currentNum;
            setOperation(id);
            operate(id);
            console.log(id);
            return;
        } else {
            isChaining = true;
            userEnteredNum = false;
            storedNum = toNum();
            storedNumStr = storedNum;
            setOperation(id);
            console.log(id);
            return;
        }
    }
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
    operation.textContent = `${entry.textContent} ${operatorSymbol}`;
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
    currentNum = toNum();
    switch(id) {
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

function percent() {
    if (operator === 'add' || operator === 'subtract') {
        currentNum = toNum();
        result = storedNum * currentNum / 100;
    } else {
        currentNum = toNum();
        result = currentNum / 100;
    }
    entry.textContent = result;
    currentNum = result;
    result = '';
    operation.textContent = `${storedNum} ${operatorSymbol} ${currentNum}`
    formatNum();
}

function squared() {
    xFunction = 'squared';
    currentNum = toNum();
    c = toNum();
    result = currentNum ** 2;
    entry.textContent = result;
    operation.textContent = `${storedNum} ${operatorSymbol} (${c})²`;
    currentNum = result;
    result = '';
    formatNum();
}

function sqrt() {
    xFunction = 'sqrt';
    currentNum = toNum();
    c = toNum();
    operation.textContent = `${storedNum} ${operatorSymbol} √(${c})`;
    if (currentNum < 0) {
        entry.textContent = `imagine`
        disabled = true;
        return;
    } else if (currentNum >= 0) {
        result = Math.sqrt(currentNum);
        entry.textContent = result;
    } else {
        console.log(`error: sqrt`);
    }
    currentNum = result;
    result = '';
    formatNum();
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
            entry.textContent = 0;
            operation.textContent =`${storedNum} ${operatorSymbol}`;
            break;
        case 'negate':
            negate();
    }
}

function backspace() {
    if (backspaceLock === true) return;
    const currentNum = yeetCommas();
    if (currentNum.length === 1) return entry.textContent = '0';
    entry.textContent = currentNum.slice(0, currentNum.length - 1);
    formatNum();
}

function dot() {
    if (xFunction !== '') return;
    if (userEnteredEqual === true) addNumber('zero');
    if (entry.textContent.indexOf('.') === -1) entry.textContent += '.';
}

function negate() {
    const currentNum = toNum();
    entry.textContent = -currentNum;
    formatNum();
}
