var socket = new WebSocket('ws://ec2-54-149-36-5.us-west-2.compute.amazonaws.com:8081');
var myID = null;
var players = new Map();
var numPlayers = 0;
var numReady = 0;
var game = null;

//Should really use OOP for all this but idk if I'll reuse any of it
//If I do sometime I can make a class ig

var ready = false;

function addPlayer(player){
    var id = player.id;
    wasReady = false;
    if(!players.has(id)){
        numPlayers += 1;
    } else {
        wasReady = players.get(id).ready;
    }
    players.set(id, player);
    if(player.ready && !wasReady){
        numReady += 1;
    } else if (wasReady && !player.ready){
        numReady -= 1;
    }
    updateCounts();
}

function removePlayer(player){
    players.delete(player.id);
    numPlayers -= 1;
    if(player.ready){
        numReady -= 1;
    }
    updateCounts();
}

var countsHolder = document.getElementById("countsHolder");
var playerCounter = document.getElementById("playerCount");
var startWarning = document.getElementById("startWarning");
function updateCounts(){
    playerCounter.innerHTML = "Ready: " + numReady + "/" + numPlayers;
    if(numReady + 1 == numPlayers && !ready){
        startWarning.className = "";
    } else {
        startWarning.className = "hidden";
    }
}

function start(config){
    countsHolder.classList.add("hidden");
    var gameHolder = document.getElementById("mainGameHolder");
    var otherHolder = document.getElementById("otherGamesHolder");
    otherHolder.style.height = document.body.clientHeight - otherHolder.getBoundingClientRect().top - 50;
    game = new Game(config, {width: gameHolder.width - 50, height: document.body.clientHeight - 200}, players.get(myID).uname);
    var ids = players.keys();
    for(id of ids){
        if(id != myID){
            
            players.get(id).game = new AutoGame(config, {width: otherHolder.width - 20, height: 500}, players.get(id).uname);
        }
    }
    setInterval(function(){
        var outgoing = {type: "gdata", data: game.clearEventLog(), lost: game.over};
        if(outgoing.data.length > 0){
            socket.send(JSON.stringify(outgoing));
        }
    }, 100);
}

var ready = false;
var connected = false;

if(!sessionStorage.getItem("uname")){
    sessionStorage.setqItem("uname", "User" + Math.floor(Math.random() * 10000));
}

// Connection opened
socket.addEventListener('open', function (event) {
});

// Listen for messages
socket.addEventListener('message', function (event) {
    const msg = JSON.parse(event.data);
    switch (msg.type){
        case "id":
            myID = msg.id;
            //Not sure if this is necessary, but only send connect once server responds with id
            const gameID = parseInt(new URL(window.location.href).searchParams.get("id"));
            var data = {type: "connect", gameID: gameID, uname: sessionStorage.getItem("uname")};
            socket.send(JSON.stringify(data));
            connected = true;
        break;
        case "join":
            addPlayer(msg.player);
            console.log(msg.player);
        break;
        case "leave":
            removePlayer(msg.player);
        break;
        case "ready":
            addPlayer(msg.player);
        break;
        case "start":
            start(msg.config);
        break;
        case "gdata":
            players.get(msg.player.id).game.runEvents(msg.data);
        break;
        case "finished":
            alert("Game over");
        break;
    }
});
var readyBtn = document.getElementById("readyBtn");
readyBtn.onclick = function(){
    if(!connected){
        return;
    }
    readyBtn.classList.add("hidden");
    ready = true;
    var data = {type: "ready"};
    socket.send(JSON.stringify(data));
}