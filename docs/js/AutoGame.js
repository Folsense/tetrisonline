class AutoGame {
    constructor(config, dim, name, seed){
        //Set up variables
        if(!seed){
            //seed = Math.floor(Math.random() * 100);
            seed = 0;
        }
        this.seed = seed;
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
        var nameTag = document.createElement("p");
        nameTag.className = "nameTag";
        nameTag.innerHTML = name;
        gameHolder.appendChild(nameTag);
        this.bcanvas = document.createElement("canvas");
        this.uicanvas = document.createElement("canvas");
        gameHolder.appendChild(this.bcanvas);
        gameHolder.appendChild(this.uicanvas);
        document.getElementById("otherGamesHolder").appendChild(gameHolder);
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
    }

    runEvents(e){
        while(e.length > 0){
            switch(e[0]){
                case "U":
                    this.board.runTick();
                break;
                case "L":
                //Deal with key presses
                    this.board.leftEvent();
                break;
                case "R":
                    this.board.rightEvent();
                break;
                case "D":
                    this.board.downEvent();
                break;
                case "C":
                    this.board.cwEvent();
                break;
                case "W":
                    this.board.ccwEvent();
                break;
                case "H":
                    this.board.holdEvent();
                break;
            }
            e = e.substr(1, e.length - 1);
        }
    }
}