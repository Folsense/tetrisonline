class Tetromino {
    constructor(x, y, shape){
        this.width = 0;
        this.height = 0;
        this.rotation = 0;
        //Top left of tetromino
        this.shape = shape;
        this.size = this.shape.length;
        this.blocks = [];

        this.color = "rgb(" + Math.floor(Math.random() * 150 + 50) + "," + Math.floor(Math.random() * 150 + 50) + "," + Math.floor(Math.random() * 150 + 50) + ")";
        for(var y2 = 0; y2 < this.shape.length; y2 ++){
            for(var x2 = 0; x2 < this.shape[0].length; x2 ++){
                if(this.shape[y2][x2]){
                    if(x2 > this.width){
                        this.width = x2;
                    }
                    if(y2 > this.height){
                        this.height = y2;
                    }
                }
            }
        }
        this.size = this.width > this.height ? this.width : this.height;
        this.yAdjust = Math.ceil((this.size - this.height) / 2);
        this.xAdjust = Math.floor((this.size - this.width) / 2);
        this.offcenter = (this.size - this.width) % 2 + (this.size - this.height) % 2;
        this.offset = {
            x: 0,
            y: 0,
            mode: this.width > this.height ? 1 : 0
        }

        //Center the block and make sure it's on the screen
        x -= Math.ceil((this.width + this.xAdjust) / 2);
        y -= this.height + this.yAdjust;
        this.x = x;
        this.y = y;

        for(var y2 = 0; y2 < this.shape.length; y2 ++){
            for(var x2 = 0; x2 < this.shape[0].length; x2 ++){
                if(this.shape[y2][x2]){
                    this.blocks.push(new Block(x + x2 + this.xAdjust, y + y2 + this.yAdjust, this.color));
                }
            }
        }
        this.width += 1;
        this.height += 1;
    }

    fall(){
        for(var i = 0; i < this.blocks.length; i ++){
            this.blocks[i].fall();
        }
        this.y -= 1;
    }

    unfall(){
        for(var i = 0; i < this.blocks.length; i ++){
            this.blocks[i].unfall();
        }
        this.y += 1;
    }

    moveLeft(){
        for(var i = 0; i < this.blocks.length; i ++){
            this.blocks[i].moveLeft();
        }
        this.x -= 1;
    }

    moveRight(){
        for(var i = 0; i < this.blocks.length; i ++){
            this.blocks[i].moveRight();
        }
        this.x += 1;
    }

    moveX(val){
        for(var i = 0; i < this.blocks.length; i ++){
            this.blocks[i].moveX(val);
        }
        this.x += val;
    }

    moveY(val){
        for(var i = 0; i < this.blocks.length; i ++){
            this.blocks[i].moveY(val);
        }
        this.y += val;
    }

    moveBlocksY(val){
        for(var i = 0; i < this.blocks.length; i ++){
            this.blocks[i].moveY(val);
        }
    }

    moveBlocksX(val){
        for(var i = 0; i < this.blocks.length; i ++){
            this.blocks[i].moveX(val);
        }
    }

    //This took waaay too long to figure out for so little code
    rotate(dir){
        for(var i = 0; i < this.blocks.length; i ++){
            this.blocks[i].rotate(this.x, this.y, this.size, dir);
        }
        var hold = this.width;
        this.width = this.height;
        this.height = hold;
        //All this stuff makes sure the center of the tetromino stays at or to the right of and at or above the middle (bounding box is same for between 90/270 and between 0/180) 
        this.rotation += (dir > 0 ? 1 : -1);
        //Have it wrap from 0 - 3
        this.rotation = this.rotation < 0 ? 4 + this.rotation : this.rotation % 4; 
        var targetOffset = {x:0, y: 0};
        //If width first offsets are one rotation ahead
        switch((this.rotation + this.offset.mode) % 4){
            case 0:
                targetOffset = {x: 0, y: 0}
            break;
            case 1:
                targetOffset = {x: 0, y: 0}
            break;
            case 2:
                targetOffset = {x: -this.offcenter, y: 0}
            break;
            case 3:
                targetOffset = {x: 0, y: this.offcenter};
            break;
        }
        this.moveX(targetOffset.x - this.offset.x);
        this.moveY(targetOffset.y - this.offset.y);
        this.offset = {x: targetOffset.x, y: targetOffset.y, mode: this.offset.mode};
    }

    reset(x, y){
        x -= Math.ceil((this.width - 1 + this.xAdjust) / 2);
        y -= this.height - 1 + this.yAdjust;
        this.moveX(x - this.x);
        this.moveY(y - this.y);
        if(this.rotation < 2){
            while(this.rotation > 0){
                this.rotate(-1);
            }
        } else {
            while(this.rotation != 0){
                this.rotate(1);
            }
        }
        this.offset.x = 0;
        this.offset.y = 0;
    }
}