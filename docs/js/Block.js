class Block {
    constructor(x, y, c){
        this.x = x;
        this.y = y;
        this.c = c;
    }

    draw(x, y, w, h, ctx){
        ctx.fillStyle = this.c;
        ctx.fillRect(x, y, w + 0.5, h + 0.5);
    }

    fall(){
        this.y -= 1;
    }

    unfall(){
        this.y += 1;
    }

    moveLeft(){
        this.x -= 1;
    }

    moveRight(){
        this.x += 1;
    }

    moveX(val){
        this.x += val;
    }

    moveY(val){
        this.y += val;
    }

    rotate(bx, by, n, dir){
        var rx = this.x - bx;
        var ry = this.y - by;
        if(dir < 0){
            //ccw
            this.x = bx + n - ry;
            this.y = by + rx;
        } else {
            //cw
            this.x = bx + ry;
            this.y = by + n - rx;
        }
    }
}