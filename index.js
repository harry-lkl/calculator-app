const memory = document.getElementById('memory');
const operation = document.getElementById('operation');
const entry = document.getElementById('entry');
const calculator = document.getElementById('keys');
const entryMaxLength = 16;

let operator = 'add';
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
        case 'key modifier':
            modify(e.target.id);
            break;
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

function operate(id) {
    if (operation.textContent === '') {
        a = toNum();
        userEnteredNum = false;
        return setOperation(id);
    }
    if (userEnteredNum === false) {
        a = toNum();
        return setOperation(id);
    }
    if (userEnteredNum === true) {
        b = toNum();
        userEnteredNum = false;
        userSelectedOperator = true;
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
                if (b === 0) return;
                divide();
        }
        entry.textContent = result;
        formatNum();
        b = '';
        result = '';
        operate(id);
    }
}

function modify(id) {}

function setOperation(id) {
    switch(id) {
        case 'add':
            operation.textContent = entry.textContent + ' +';
            operator = 'add';
            break;
        case 'subtract':
            operation.textContent = entry.textContent + ' -';
            operator = 'subtract';
            break;
        case 'multiply':
            operation.textContent = entry.textContent + ' ×';
            operator = 'multiply';
            break;
        case 'divide':
            operation.textContent = entry.textContent + ' ÷';
            operator = 'divide';
    }
    userSelectedOperator = true;
}

//  formatting
const yeetCommas = () => entry.textContent.replace(/,/g, '');
const toNum = () => parseFloat(yeetCommas(), 10);
const formatNum = () => entry.textContent = parseFloat(yeetCommas(), 10).toLocaleString();
const clearEntry = () => entry.textContent = '';
