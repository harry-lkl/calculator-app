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
let a = '';
let b = '';
let c = '';
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
    a = '';
    b = '';
    c = '';
    result = '';
    entry.textContent = 0;
    operation.textContent = '';
}

function resetOperation() {
    operator = '';
    operatorSymbol = '';
    xFunction = '';
    a = '';
    b = '';
    c = '';
    result = '';
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
            console.log(`disabled`);
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
    formatNum();
}

//  operations
function operate(id) {
    xFunction = '';
    if (id === 'equal') {
        isChaining = false;
        userEnteredNum = false;
        if (operator === '') {
            userEnteredEqual = true;
            a = toNum();
            result = a;
            if (xFunction === 'squared') {
                operation.textContent = `(${c})² =`;
            } else if (xFunction === 'sqrt') {
                operation.textContent = `√(${c}) =`;
            } else  if (xFunction === '') {
                operation.textContent = `${a} =`;
            } else {
                console.log(`error: equal post operation`)
            }
        } else if (operator !== '' && userEnteredEqual === false) {
            userEnteredEqual = true;
            b = toNum();
            runOperations();
            if (typeof result === 'string' && result.indexOf('e') !== -1) {
                entry.textContent = `pfft lmao`;
                operation.textContent = result;
                disabled = true;
                return;
            }
            if (xFunction === 'squared') {
                operation.textContent = `${a} ${operatorSymbol} (${c})² =`;
            } else if (xFunction === 'sqrt') {
                operation.textContent = `${a} ${operatorSymbol} √(${c}) =`;
            } else  if (xFunction === '') {
                operation.textContent = `${a} ${operatorSymbol} ${b} =`;
            } else {
                console.log(`error: equal post operation`)
            }
            entry.textContent = result;
            formatNum();
        } else if (operator !== '' && userEnteredEqual === true) {
            userEnteredEqual = false;
            a = result;
            entry.textContent = b;
            result = '';
            b = '';
            operate(id);
        } else {
            console.log(`error: equal`)
            disabled = true;
        }
    } else {
        backspaceLock = false;
        userEnteredEqual = false;
        userEnteredOperator = true;
        if (isChaining === true && userEnteredNum === true) {
            userEnteredNum = false;
            operate('equal');
            a = toNum();
            setOperation(id);
            operate(id);
        } else {
            isChaining = true;
            userEnteredNum = false;
            a = toNum();
            setOperation(id);
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

const add = () => result = a + b;
const subtract = () => result = a - b;
const multiply = () => result = a * b;
const divide = () => result = a / b;

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
            if (b === 0) return result = `error: x/0`;
            divide();
    }
}

//  x-functions
function runFunction(id) {
    backspaceLock = true;
    b = toNum();
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
        b = toNum();
        result = a * b / 100;
    } else {
        b = toNum();
        result = b / 100;
    }
    entry.textContent = result;
    b = result;
    result = '';
    operation.textContent = `${a} ${operatorSymbol} ${b}`
    formatNum();
}

function squared() {
    xFunction = 'squared';
    b = toNum();
    c = toNum();
    result = b ** 2;
    entry.textContent = result;
    operation.textContent = `${a} ${operatorSymbol} (${c})²`;
    b = result;
    result = '';
    formatNum();
}

function sqrt() {
    xFunction = 'sqrt';
    b = toNum();
    c = toNum();
    operation.textContent = `${a} ${operatorSymbol} √(${c})`;
    if (b < 0) {
        entry.textContent = `imagine`
        disabled = true;
        console.log(b);
        return;
    } else if (b >= 0) {
        result = Math.sqrt(b);
        entry.textContent = result;
        console.log(result);
    } else {
        console.log(`error: sqrt`);
    }
    b = result;
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
            operation.textContent =`${a} ${operatorSymbol}`;
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

// negate + squared or sqrt + number
// a: first num c: first num string b: second num d: second num string