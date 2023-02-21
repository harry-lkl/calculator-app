const memory = document.getElementById('memory');
const operation = document.getElementById('operation');
const entry = document.getElementById('entry');
const calculator = document.getElementById('keys');

let sign = 'add';
let a = 0;
let b = 0;
let result = 0;

calculator.addEventListener('click', function (e) {
    switch(e.target.className) {
        case 'key number':
            number(e.target.id);
            break;
        case 'key operator':
            operate(e.target.id);
            break;
        case 'key modifier':
            modify(e.target.id);
            break;
        case 'key sign':
            setSign(e.target.id);
    }   
    });

function number(number) {
    switch(number) {
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
    const noCommas = entry.textContent.replace(/,/g, '');
    const formattedNumber = parseInt(noCommas, 10).toLocaleString();
    entry.textContent = formattedNumber;
}

const add = () => result = a + b;
const subtract = () => result = a - b;
const multiply = () => result = a * b;
const divide = () => result = a / b;

function operate() {
    switch(sign) {
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
    return result;
}

function modify(modifier) {}
function setSign(sign) {}