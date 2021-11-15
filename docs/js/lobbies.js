if(!sessionStorage.getItem("uname")){
    sessionStorage.setItem("uname", "User" + Math.floor(Math.random() * 10000));
}

var nameInput = document.getElementById("changeName");
nameInput.value = sessionStorage.getItem("uname");
nameInput.addEventListener("change", function(){
    sessionStorage.setItem("uname", document.getElementById("changeName").value.substring(0, 15));
})

var socket = new WebSocket('wss://ec2-54-149-36-5.us-west-2.compute.amazonaws.com:8081');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({type: "ggames"}));
});

socket.addEventListener('message', function (event) {
    const msg = JSON.parse(event.data);
    switch (msg.type){
        case "games":
            for(var i = 0; i < msg.games.length; i ++){
                showGame(msg.games[i]);
            }
        break;
    }
});

var makeBtn = document.getElementById("makeGame");
makeBtn.onclick = function(){
    var blur = document.getElementById("blur");
    var options = document.getElementById("makeOptions");
    blur.classList.remove("hidden");
    options.classList.remove("hidden");
}

function showGame(game){
    var containerDiv = document.createElement("div");
    containerDiv.onclick = function(){window.location="lobby.html?id=" + game.id;};
    containerDiv.className = "lobby";
    var descriptor = document.createElement("p");
    descriptor.className = "descriptor";
    descriptor.innerHTML = "Created By: " + game.uname;
    containerDiv.appendChild(descriptor);
    var prescripts = ["Size", "Width", "Height", "Level"];
    var i = 0;
    for(value in game.config){
        if(i >= 4){
            break;
        }
        var descriptor = document.createElement("p");
        descriptor.className = "descriptor";
        descriptor.innerHTML = prescripts[i++] + ": " + game.config[value];
        containerDiv.appendChild(descriptor);
    }
    document.body.appendChild(containerDiv);
}

var nameInput = document.getElementById("uname");
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

document.getElementById("cancelMake").onclick = function(){
    var blur = document.getElementById("blur");
    var options = document.getElementById("makeOptions");
    blur.classList.add("hidden");
    options.classList.add("hidden");
}

document.getElementById("genGame").onclick = function(){
    console.log(sessionStorage.getItem("uname"));
    socket.send(JSON.stringify({type: "mgame", uname: sessionStorage.getItem("uname"),
        config: {
        size: boundNum(sizeInput.value, 4, 5),
        width: boundNum(widthInput.value, 8, 20),
        height: boundNum(heightInput.value, 10, 40),
        level: boundNum(levelInput.value, 0, 20)}
    }));
    location.reload();
}
