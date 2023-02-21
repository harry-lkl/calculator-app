let operator = '';
let a = 0;
let b = 0;
let result = 0;

function add() {
    return result = a + b;
}

function subtract() {
    return result = a - b;
}

function multiply() {
    return result = a * b;
}

function divide() {
    if (b === 0) return;
    return result = a / b;
}

function operate() {
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
            divide();
    }
    }
