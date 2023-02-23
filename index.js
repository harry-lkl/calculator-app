const memory = document.getElementById('memory');
const operation = document.getElementById('operation');
const entry = document.getElementById('entry');
const calculator = document.getElementById('keys');
const entryMaxLength = 16;

let operator = '';
let operatorSymbol = '';
let userSelectedOperator = false;
let userEnteredNum = false;
let a = '';
let b = '';
let result = '';

calculator.addEventListener('click', function (e) {
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
    });

function addNumber(id) {
    if (entry.textContent.length >= entryMaxLength) return;
    if (userSelectedOperator === true) clearEntry();
    userSelectedOperator = false;
    userEnteredNum = true;
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
const inverse = () => result = 1 / a;
const squared = () => result = a ** 2;
const sqrt = () => result = Math.sqrt(a);
const add = () => result = a + b;
const subtract = () => result = a - b;
const multiply = () => result = a * b;
const divide = () => result = a / b;

/* function equal() {
    //  if no sign is selected, push entry to operation with = sign and keep the entry
    //  if a sign is selected, push entry into b, operate, post operation with a, b, and equal sign to operation, answer to entry
    //  if it is pressed again, keep sign and b, update entry into a, operate
}

function operate(id) {
    //  if no ongoing operation, save anything in entry to a and post the operation
    if (operation.textContent === '') {
        userEnteredNum = false;
        a = toNum();
        return setOperation(id);
    //  if no number was entered but there is an operation, switch between the signs
    } else if (userEnteredNum === false) {
        return setOperation(id);
    } else if (userEnteredNum === true) {
        userEnteredNum = false;
        b = toNum();
        operations();
        entry.textContent = result;
        formatNum();
        a = '';
        b = '';
        result = '';
        operate(id);
    }
} */

function operate(id) {
    if (id === 'equal') {
        userEnteredNum = false;
        userSelectedOperator = true;
        if (a === '' && b === '' && operator === '') {
            result = toNum(entry.textContent);
            operation.textContent = `${result} =`;
        } else if (a !== '' && operator !== "") {
            b = toNum(entry.textContent);
            operations();
            operation.textContent = `${a} ${operatorSymbol} ${b} =`;
            entry.textContent = result;
            formatNum();
        }
    }
    //  +-x/
        //  a = toNum(entry.textContent);
        //  setOperation(id)
    //  equal sign
        //  if a, b, operation === '';
            //  result = toNum(entry.textContent);
            //  operation.textContent = entry.textContent + ' =';
        //  if a !== '';    <- operation is set, a stored, currently a number in entry
            //  b = toNum(entry.textContent);
            //  operations()
            //  operation.textContent = a 'operator' b =
            //  entry.textContent = formatNum(result)

}

function setOperation(id) {
    switch(id) {
        case 'add':
            operation.textContent = `${entry.textContent} +`;
            operatorSymbol = '+';
            operator = 'add';
            break;
        case 'subtract':
            operation.textContent = `${entry.textContent} -`;
            operatorSymbol = '-';
            operator = 'subtract';
            break;
        case 'multiply':
            operation.textContent = `${entry.textContent} ×`;
            operatorSymbol = '×';
            operator = 'multiply';
            break;
        case 'divide':
            operation.textContent = `${entry.textContent} ÷`;
            operatorSymbol = '÷';
            operator = 'divide';
    }
    userSelectedOperator = true;
}

function operations() {
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
            if (b === 0) return `error: x/0`;
            divide();
    }
}

function modify(id) {
    switch(id) {
        case 'clearAll':
            clearAll();
            break;
        case 'clearEntry':
            entry.textContent = 0;
    }
}

//  formatting
const yeetCommas = () => entry.textContent.replace(/,/g, '');
const toNum = () => parseFloat(yeetCommas(), 10);
const formatNum = () => entry.textContent = parseFloat(yeetCommas(), 10).toLocaleString();
const clearEntry = () => entry.textContent = '';

function clearAll() {
    operator = '';
    operatorSymbol = '';
    userSelectedOperator = false;
    userEnteredNum = false;
    a = '';
    b = '';
    result = '';
    entry.textContent = 0;
    operation.textContent = '';
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