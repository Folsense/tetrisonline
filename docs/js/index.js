var sizeInput = document.getElementById("pieceSize");
var widthInput = document.getElementById("boardWidth");
var heightInput = document.getElementById("boardHeight");
var levelInput = document.getElementById("level");

boundInput(sizeInput, 4, 5);
boundInput(widthInput, 8, 20);
boundInput(heightInput, 10, 40);
boundInput(levelInput, 1, 20);

function boundInput(input, min, max){
    input.addEventListener("change", function(){
        if(input.value < min){
            input.value = min;
        } else if(input.value > max){
            input.value = max;
        }
    }); 
}

function boundNum(num, min, max){
    num = num < min ? min : num;
    return num > max ? max : num;
}

document.getElementById("genGame").onclick = function(){
    document.getElementById("makeOptions").classList.add("hidden");
    var config = {
        size: boundNum(sizeInput.value, 4, 5),
        width: boundNum(widthInput.value, 8, 20),
        height: boundNum(heightInput.value, 10, 40),
        level: boundNum(levelInput.value, 0, 20),
        seed: Math.floor(Math.random() * 10000)
    };
    var game = new Game(config, {width: 800, height: 500});
}