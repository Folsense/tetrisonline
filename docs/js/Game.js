class Game {
    constructor(config, dim, name, seed){
        //Set up variables
        this.over = false;
        this.seed = seed;
        if(!seed){
            //seed = Math.floor(Math.random() * 100);
            seed = 0;
        }
        //Make the canvases
        const cwhratio = config.width / config.height;
        if(cwhratio > 1/2){
            this.cellSize = Math.floor(dim.width * (2 / 3) / config.width);
            dim.width = config.width * this.cellSize * 3 / 2;
            dim.height = (dim.width * 2 / 3) * config.height / config.width;
        } else {
            this.cellSize = Math.floor(dim.height / config.height);
            dim.height = config.height * this.cellSize;
            dim.width = dim.height * config.width / config.height * 3 / 2;
        }
        this.width = config.width;
        this.height = config.height;
        var gameHolder = document.createElement("div");
        gameHolder.className = "gameHolder";
        if(name){
            var nameTag = document.createElement("p");
            nameTag.className = "nameTag";
            nameTag.innerHTML = name;
            gameHolder.appendChild(nameTag);
        }
        this.bcanvas = document.createElement("canvas");
        this.uicanvas = document.createElement("canvas");
        gameHolder.appendChild(this.bcanvas);
        gameHolder.appendChild(this.uicanvas);
        document.getElementById("mainGameHolder").appendChild(gameHolder);
        this.bcanvas.width = dim.width * 2 / 3 * 2;
        this.bcanvas.height = dim.height * 2;
        this.uicanvas.width = dim.width / 3 * 2;
        this.uicanvas.height = this.height * this.cellSize * 2;
        this.cellSize *= 2;
        
        this.bcanvas.style.width = (dim.width * 2 / 3) + "px";
        this.bcanvas.style.height = dim.height + "px";
        this.uicanvas.style.width = (dim.width / 3) + "px";
        this.uicanvas.style.height = dim.height + "px";
                
        this.bctx = this.bcanvas.getContext("2d");
        this.uictx = this.uicanvas.getContext("2d");
        //Make a board
        this.board = new Board(config, {cellSize: this.cellSize, bctx: this.bctx, uictx: this.uictx, bcanvas: this.bcanvas, uicanvas: this.uicanvas}, seed);
        //Start the timer
        this.lastTime = Date.now();
        this.rollingTimer = 0;
        this.keys = [];
        this.cooldowns = [];
        this.eventLog = "";
        this.update = setInterval(() => {
            if(this.over){
                return;
            }
            var events = "";
            var now = Date.now();
            var dt = now - this.lastTime;
            //This might cause rounding errors, should compare to some initial time if I add online
            this.lastTime = now;
            //Update the board
            var ticked = this.board.update(dt);
            if(ticked){
                events += "U";
            }
            //Deal with key presses
            var runCooldown = (key, func, first, second) => {
                this.cooldowns[key] -= dt;
                if(this.cooldowns[key] > 100000){
                    func();
                    this.cooldowns[key] = first;
                } else if (this.cooldowns[key] < 0){
                    func();
                    this.cooldowns[key] += second;
                }
            }
            if(this.keys["ArrowLeft"] === true){
                runCooldown("ArrowLeft", () => {this.board.leftEvent(); events += "L";}, 400, 50);
            }
            if(this.keys["ArrowRight"] === true){
                runCooldown("ArrowRight", () => {this.board.rightEvent(); events += "R";}, 400, 50);
            }
            if(this.keys["ArrowDown"] === true){
                runCooldown("ArrowDown", () => {this.board.downEvent(); events += "D";}, 400, 50);
            }
            if(this.keys["KeyE"] === true){
                runCooldown("KeyE", () => {this.board.cwEvent(); events += "C";}, 400, 50);
            }
            if(this.keys["KeyQ"] === true){
                runCooldown("KeyQ", () => {this.board.ccwEvent(); events += "W";}, 400, 50);
            }
            if(this.keys["KeyW"] === true){
                runCooldown("KeyW", () => {this.board.holdEvent(); events += "H";}, 400, 50);
            }
            this.eventLog += events;
            this.over = this.board.lost;
        }, 30);
        //Track key presses
        document.onkeydown = (e) => {
            if(!this.keys[e.code]){
                this.cooldowns[e.code] = 9999999;
            }
            this.keys[e.code] = true;
        }
        document.onkeyup = (e) => {
            this.keys[e.code] = false;
        }
    }

    clearEventLog(){
        var hold = this.eventLog;
        this.eventLog = "";
        return hold;
    }
}