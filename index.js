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

function number(number) {}

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