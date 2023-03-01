const memory = document.getElementById('memory');
const operation = document.getElementById('operation');
const entry = document.getElementById('entry');
const calculator = document.getElementById('keys');
const entryMaxLength = 12;

let disabled = false;
let isChaining = false;
let operator = '';
let operatorSymbol = '';
let userEnteredEqual = false;
let userEnteredNum = true;
let userEnteredOperator = false;
let a = '';
let b = '';
let result = '';

//  resets
function resetAll() {
    disabled = false;
    isChaining = false;
    operator = '';
    operatorSymbol = '';
    userEnteredEqual = false;
    userEnteredNum = true;
    userEnteredOperator = false;
    a = '';
    b = '';
    result = '';
    entry.textContent = 0;
    operation.textContent = '';
}

function resetOperation() {
    operator = '';
    operatorSymbol = '';
    a = '';
    b = '';
    result = '';
}

//  formatting
const yeetCommas = () => entry.textContent.replace(/,/g, '');
const toNum = () => +yeetCommas();
const formatNum = () => entry.textContent = toNum().toLocaleString('en', {maximumFractionDigits: entryMaxLength}); // <- maxdigits need to be dynamic?
const clearEntry = () => entry.textContent = '';

//  key-press listener
calculator.addEventListener('click', function (e) {
        if (disabled === true) {
            console.log(`it's true`);
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
        resetOperation();
        clearEntry();
        operation.textContent = '';
        userEnteredEqual = false;
    }
    if (userEnteredOperator === true || entry.textContent === '0') clearEntry();
    if (digitCount >= entryMaxLength) return;
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
const add = () => result = a + b;
const subtract = () => result = a - b;
const multiply = () => result = a * b;
const divide = () => result = a / b;

function operate(id) {
    if (id === 'equal') {
        isChaining = false;
        userEnteredNum = false;
        if (operator === '') {
            userEnteredEqual = true;
            a = toNum();
            result = a
            operation.textContent = `${a} =`;
            resetOperation();
        } else if (operator !== '' && userEnteredEqual === false) {
            userEnteredEqual = true;
            b = toNum();
            runOperations();
            if (typeof result === 'string') {
                entry.textContent = `pfft lmao`;
                operation.textContent = result;
                disabled = true;
                resetOperation();
                // disable most buttons, operator and clear buttons will resetAll();
                return;
            }
            operation.textContent = `${a} ${operatorSymbol} ${b} =`;
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
            console.log('error: equal')
            disabled = true;
        }
    } else {
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
const inverse = () => result = 1 / a;
const squared = () => result = a ** 2;
const sqrt = () => result = Math.sqrt(a);

function runFunction() {

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
            break;
        case 'negate':
            negate();
    }
}

function backspace() {
    const currentNum = yeetCommas();
    if (currentNum.length === 1) return entry.textContent = '0';
    entry.textContent = currentNum.slice(0, currentNum.length - 1);
    formatNum();
}

function dot() {
    if (userEnteredEqual === true) addNumber('zero');
    if (entry.textContent.indexOf('.') === -1) entry.textContent += '.';
}

function negate() {
    const currentNum = toNum();
    entry.textContent = -currentNum;
    formatNum();
}

// x functions: immediately execute on the number in entry
    //  the operation is posted in operation
    //  the answer is posted in entry
    //  if there is already an operation (a and operator is set), execute on the number in entry plus complete the operation
    //  the operation is posted in operation
// signs: if there isn't an operation, post the current operation with the sign
    //  if there is an operation, execute on the number in entry
    //  the result is posted in entry
    //  the result is posted in operation with the new selected sign
// equal: if there is no sign set, operation equal entry
    //  if there is a sign set, a has a value, b = entry and operate