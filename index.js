//  input listeners
window.addEventListener('click', clickInput);
function clickInput(e) {
    if (e.target.id === 'backspaceIcon') return mainSelector('key modifier', 'backspace');
    mainSelector(`${e.target.className}`, `${e.target.id}`);
}

window.addEventListener('keydown', keyInput);
function keyInput(e) {
    let key = document.querySelector(`.key[data-key = "${e.key}"]`)
    if (e.key === '\\') key = document.querySelector(`.key[data-key = "÷"]`)
    if (!key) return;
    mainSelector(`${e.target.className}`, `${e.target.id}`);
}

// main selector
function mainSelector(className, id) {
    console.log(className, id);
    switch(className) {
        case 'key number':
            addNumber(id);
            break;
        case 'key operator':
            setOperator(id);
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
}

//  numbers
function addNumber(id) {
    console.log(id);
}

function setOperator(id) {
    return console.log(id);
}
//  operations
function operate() {
    console.log('hi')
}

//  x-functions
function runFunction(id) {
    return console.log(id);
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

//  entry modifiers
function modifyDisplay(id) {
    return console.log(id);
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
            clearEntry();
    }
}

function memorySelector(id) {
    return console.log(id);
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
