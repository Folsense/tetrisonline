class Board{
    constructor(config, ctx, seed){
        this.width = config.width;
        this.height = config.height;
        this.shapes = findTiles2(config.size);
        this.size = config.size;
        this.cellSize = ctx.cellSize;
        this.uictx = ctx.uictx;
        this.uicanvas = ctx.uicanvas;
        this.bctx = ctx.bctx;
        this.bcanvas = ctx.bcanvas;
        this.seed = config.seed;
        this.score = 0;
        this.totalClears = 0;
        this.level = config.level;
        this.setLevel(this.level);
        this.lost = false;
        //Actual board
        this.bdraw = {
            x: 0,
            y: 0,
            drawWidth: this.cellSize * this.width,
            drawHeight: this.cellSize * this.height
        }
        //Hold preview
        this.hpdraw = {
            x: (this.uicanvas.width - this.size * this.cellSize) / 2,
            y: this.cellSize,
            border: this.cellSize
        }
        //Next preview
        this.npdraw = {
            x: (this.uicanvas.width - this.size * this.cellSize) / 2,
            y: this.hpdraw.y + this.size * this.cellSize + this.cellSize,
            border: this.cellSize
        }
        this.sdraw = {
            x: this.uicanvas.width / 2,
            y: this.npdraw.y + this.size * this.cellSize + this.cellSize,
        }
        this.ldraw = {
            x: this.uicanvas.width / 2,
            y: this.sdraw.y + this.cellSize * 3,
        }
        this.tetromino = new Tetromino(Math.floor(this.width / 2), this.height - 1, this.shapes[Math.floor(this.random() * this.shapes.length)]);
        this.next = [];
        for(var i = 0; i < 3; i ++){
            this.next.push(new Tetromino(Math.floor(this.width / 2), this.height - 1, this.shapes[Math.floor(this.random() * this.shapes.length)]));
        }
        this.held = null;
        this.blocks = [];
        for(var i = 0; i < this.height * 2; i ++){
            this.blocks.push([]);
            for(var j = 0; j < this.width; j ++){
                this.blocks[i].push(null);
            }
        }
        this.dropTimer = 0;
        this.tickTime = 30;
        this.redraw();
        this.canHold = true;
    }

    redraw(){
        var x = this.bdraw.x;
        var y = this.bdraw.y;
        this.bctx.fillStyle = "bisque"
        this.bctx.fillRect(x, y, this.bdraw.drawWidth, this.bdraw.drawHeight);
        var ypos = y + (this.height - 1) * this.cellSize;
        for(var row = 0; row < this.height; row ++){
            var xpos = x;
            for(var col = 0; col < this.width; col ++){
                if(this.blocks[row][col]){
                    this.blocks[row][col].draw(xpos, ypos, this.cellSize, this.cellSize, this.bctx);
                }
                xpos += this.cellSize;
            }
            ypos -= this.cellSize;
        }
        if(this.tetromino){
            for(var i = 0; i < this.tetromino.blocks.length; i ++){
                var block = this.tetromino.blocks[i];
                block.draw(x + block.x * this.cellSize, y + (this.height - block.y - 1) * this.cellSize, this.cellSize, this.cellSize, this.bctx);
            }
        }

        this.uictx.fillStyle = "bisque"
        this.uictx.fillRect(0, 0, this.uicanvas.width, this.uicanvas.height);
        this.drawPreview(this.held, this.hpdraw.x, this.hpdraw.y, this.cellSize, this.hpdraw.border);
        this.drawPreview(this.next[0], this.npdraw.x, this.npdraw.y, this.cellSize, this.npdraw.border);
        this.uictx.fillStyle = "black";
        this.uictx.textAlign = "center";
        this.uictx.textBaseline = "top";
        this.uictx.font = this.cellSize + "px serif";
        this.uictx.fillText("Score:", this.sdraw.x, this.sdraw.y);
        this.uictx.fillText(this.score, this.sdraw.x, this.sdraw.y + this.cellSize);
        this.uictx.fillText("Level:", this.ldraw.x, this.ldraw.y);
        this.uictx.fillText(this.level, this.ldraw.x, this.ldraw.y + this.cellSize);
    }

    clearTetromino(){
        var x = this.bdraw.x;
        var y = this.bdraw.y;
        if(this.tetromino){
            for(var i = 0; i < this.tetromino.blocks.length; i ++){
                var block = this.tetromino.blocks[i];
                this.bctx.fillStyle = "bisque"
                this.bctx.fillRect(x + block.x * this.cellSize, y + (this.height - block.y - 1) * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }

    drawTetromino(){
        var x = this.bdraw.x;
        var y = this.bdraw.y;
        if(this.tetromino){
            for(var i = 0; i < this.tetromino.blocks.length; i ++){
                var block = this.tetromino.blocks[i];
                block.draw(x + block.x * this.cellSize, y + (this.height - block.y - 1) * this.cellSize, this.cellSize, this.cellSize, this.bctx);
            }
        }
    }

    setTickTime(n){
        this.tickTime = n;
    }

    clearRow(row){
        for(var k = row; k < this.blocks.length - 1; k ++){
            for(var l = 0; l < this.width; l ++){
                this.blocks[k][l] = this.blocks[k + 1][l];
            }
        }
    }

    checkLand(){
        if(!this.tetromino){
            return;
        }
        for(var i = 0; i < this.tetromino.blocks.length; i ++){
            var block = this.tetromino.blocks[i];
            if(block.y < 0 || this.blocks[block.y][block.x]){
                break;
            }
        }
        //If collision with board
        if(i < this.tetromino.blocks.length){
            this.tetromino.unfall();
            var ycheckmin = this.tetromino.blocks[0].y;
            var ycheckmax = ycheckmin;
            for(var i = 0; i < this.tetromino.blocks.length; i ++){
                block = this.tetromino.blocks[i];
                if(block.y > ycheckmax){
                    ycheckmax = block.y;
                } else if(block.y < ycheckmin){
                    ycheckmin = block.y;
                }
                this.blocks[block.y][block.x] = block;
            }
            var linesCleared = 0;
            for(var i = ycheckmax; i >= ycheckmin; i --){
                for(var j = 0; j < this.width; j ++){
                    if(!this.blocks[i][j]){
                        break;
                    }
                }
                //If collision
                if(j == this.width){
                    linesCleared += 1;
                    this.clearRow(i);
                }
            }
            this.score += Math.floor(this.level * Math.pow(linesCleared, 1.5) * 100);
            this.totalClears += linesCleared;
            if(this.totalClears > this.level * 5 && this.level < 20){
                this.setLevel(this.level + 1);
            }
            this.cycleTetromino();
            // If new piece collides with other piece, game is over
            if(this.checkCollide()){
                this.lost = true;
            }
        }
    }

    setLevel(l){
        this.level = l;
        this.dropTime = 500 - this.level * 22.5;
    }

    cycleTetromino(){
        this.tetromino = this.next.shift();
        this.next.push(new Tetromino(Math.floor(this.width / 2), this.height - 1, this.shapes[Math.floor(this.random() * this.shapes.length)]));
        this.canHold = true;
    }

    checkCollide(){
        if(!this.tetromino){
            return false;
        }
        for(var i = 0; i < this.tetromino.blocks.length; i ++){
            var block = this.tetromino.blocks[i];
            if(block.y < 0 || this.blocks[block.y][block.x] || block.x < 0 || block.x >= this.width){
                break;
            }
        }
        if(i < this.tetromino.blocks.length){
            return true;
        }
        return false;
    }

    update(dt){
        if(this.lost){
            return false;
        }
        if(this.tetromino === null){
            this.cycleTetromino();
        }
        this.dropTimer += dt;
        if(this.dropTimer > this.dropTime){
            this.dropTimer %= this.dropTime;
            this.runTick();
            return true;
        }
        return false;
    }

    runTick(){
        this.tetromino.fall();
        this.checkLand();
        this.redraw();    
    }

    leftEvent(){
        this.tetromino.moveLeft();
        if(this.checkCollide()){
            this.tetromino.moveRight();
        }
        this.redraw();
    }
    rightEvent(){
        this.tetromino.moveRight();
        if(this.checkCollide()){
            this.tetromino.moveLeft();
        }
        this.redraw();
    }
    downEvent(){
        this.tetromino.fall();
        this.dropTimer = 0;
        this.checkLand();
        this.redraw();
    }
    cwEvent(){
        this.tetromino.rotate(1);
        if(this.checkCollide()){
            this.tetromino.rotate(-1);
        }
        this.redraw();
    }
    ccwEvent(){
        this.tetromino.rotate(-1);
        if(this.checkCollide()){
            this.tetromino.rotate(1);
        }
        this.redraw();
    }
    holdEvent(){
        if(!this.canHold){
            return;
        }
        if(this.held === null){
            this.held = this.tetromino;
            this.held.reset(Math.floor(this.width / 2), this.height - 1);
            this.cycleTetromino();
        } else {
            var hold = this.tetromino;
            this.tetromino = this.held;
            this.held = hold;
            this.held.reset(Math.floor(this.width / 2), this.height - 1);
        }
        this.canHold = false;
        this.dropTimer = 0;
        this.redraw();
    }

    drawPreview(tetromino, x, y, cellSize, borderSize){
        borderSize /= 2;
        this.uictx.fillStyle = "rgb(0, 0, 0)";
        const padding = this.cellSize / 4;
        curvedRect(x - padding, y - padding, this.cellSize * this.size + padding * 2, cellSize * this.size + padding * 2, borderSize, this.uictx);
        if(tetromino === null){
            return;
        }
        for(var i = 0; i < tetromino.blocks.length; i ++){
            var block = tetromino.blocks[i];
            block.draw(x + (block.x - tetromino.x + (this.size - tetromino.width) / 2) * cellSize, y + (this.size - 1) * cellSize - (block.y - tetromino.y - tetromino.yAdjust + (this.size - tetromino.height) / 2) * cellSize, cellSize, cellSize, this.uictx);
        }
    }

    random(){
        // LCG RNG
        // Math.random is up to the browser so this makes sure it's consistent
        var m = Math.pow(2, 16) + 1;
        this.seed = (this.seed * 75 + 74) % m;
        return this.seed / m;
    }
}