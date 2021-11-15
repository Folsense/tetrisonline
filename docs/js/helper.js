var foundTiles = [
    [[[1]]], 
    [[[1, 1], 
      [0, 0]]]
];

//This is faster than my first try nice 10 tiles in well under a second
function findTiles2(size){
    if(size <= foundTiles.length){
        return foundTiles[size - 1];
    }
    //Array of tiles of size - 1 (each size - 1 by size - 1 arrays)
    baseline = findTiles2(size - 1);
    //Array of the found tetrominos
    tetrominos = [];
    //Array of the found tetromino IDs
    foundIDs = new BST();
    //Loop through all the tetrominos of size - 1
    for(var i = 0; i < baseline.length; i ++){
        baseArr = Array(size);
        for(var j = 0; j < size - 1; j ++){
            baseArr[j + 1] = baseline[i][j].slice();
            baseArr[j + 1].unshift(0);
        }
        baseArr[0] = Array(size).fill(0);
        //Get the bounding box of the tetromino
        var xboundh = 0, yboundh = 0, xboundl = 1, yboundl = 1;
        for(var x = 1; x < size; x ++){
            for(var y = 1; y < size; y ++){
                if(baseArr[y][x]){
                    if(x > xboundh){
                        xboundh = x;
                    }
                    if(y > yboundh){
                        yboundh = y;
                    }
                }
            }
        }
        //Loop through all the cells in the tetromino resized to size by size
        for(var x = 0; x < xboundh + 2; x ++){
            if(x == size){
                continue;
            }
            for(var y = 0; y < yboundh + 2; y ++){
                if(y == size){
                    continue;
                }
                //If any are empty...
                if(baseArr[y][x] == 0){
                    //Check if they are next to a filled cell
                    if((x < size - 1 && baseArr[y][x + 1] == 1) || (y < size - 1 && baseArr[y + 1][x]) == 1 ||
                    (x > 0 && baseArr[y][x - 1] == 1) || (y > 0 && baseArr[y - 1][x] == 1)){
                        baseArr[y][x] = 1;
                        //Get the bounds of this new tetromino
                        var xb = x > xboundh ? x : xboundh;
                        var yb = y > yboundh ? y : yboundh;
                        var xbl = x < xboundl ? x : xboundl;
                        var ybl = y < yboundl ? y : yboundl;
                        //Generate the id of this tetromino
                        id = "";
                        for(var x2 = 0; x2 < size; x2 ++){
                            for(var y2 = 0; y2 < size; y2 ++){
                                if(baseArr[y2][x2]){
                                    id += ((x2 - xbl) + (y2 - ybl) * size) + "_";
                                }
                            }
                        }
                        //If this tetromino has been found, ignore it
                        if(foundIDs.contains(id)){
                            baseArr[y][x] = 0;
                            continue;
                        }
                        //console.log(id);
                        //check if the tetromino can be made any other way (all tetrominos use (0, 0), so see if it fits in the square if another cell is at (0, 0))
                        foundIDs.insert(id);
                        //If the top right cell is used
                        //if(nArr[0][xb]){
                            id = "";
                            for(var x2 = 0; x2 < size; x2 ++){
                                for(var y2 = 0; y2 < size; y2 ++){
                                    if(y2 <= xb && baseArr[x2][xb - y2]){
                                        id += (x2 - ybl + y2 * size) + "_";
                                    }
                                }
                            }
                            foundIDs.insert(id);
                            //console.log(id);
                        //}
                        //If the bottom right cell is used
                        //if(nArr[yb][xb]){
                            id = "";
                            for(var x2 = 0; x2 < size; x2 ++){
                                for(var y2 = 0; y2 < size; y2 ++){
                                    if(y2 <= yb && x2 <= xb && baseArr[yb - y2][xb - x2]){
                                        id += (x2 + y2 * size) + "_";
                                    }
                                }
                            }
                            foundIDs.insert(id);
                            //console.log(id);
                        //}
                        //If the bottom left cell is used
                        //if(nArr[yb][0]){
                            id = "";
                            for(var x2 = 0; x2 < size; x2 ++){
                                for(var y2 = 0; y2 < size; y2 ++){
                                    if(x2 <= yb && baseArr[yb - x2][y2]){
                                        id += (x2 + (y2 - xbl) * size) + "_";
                                    }
                                }
                            }
                            foundIDs.insert(id);
                            //console.log(id);
                        //}
                        //Make a copy of the tetromino
                        var nArr = Array(size);
                        if(y == 0){
                            for(var j = 0; j < size; j ++){
                                nArr[j] = baseArr[j].slice();
                            }
                        } else {
                            for(var j = 0; j < size - 1; j ++){
                                nArr[j] = baseArr[j + 1].slice();
                            }
                            nArr[size - 1] = Array(size).fill(0);
                        }
                        if(x > 0){
                            for(var j = 0; j < size; j ++){
                                nArr[j].shift();
                                nArr[j].push(0);
                            }
                        }
                        baseArr[y][x] = 0;
                        tetrominos.push(nArr);
                    }
                }
            }
        }
    }
    foundTiles[size - 1] = tetrominos;
    return tetrominos;
}

class Node {
    constructor(val){
        this.val = val;
        this.left = null;
        this.right = null;
    }

    insert(num){
        if(num < this.val){
            if(this.left){
                this.left.insert(num);
            } else {
                this.left = new Node(num);
            }
        }
        if(num > this.val){
            if(this.right){
                this.right.insert(num);
            } else {
                this.right = new Node(num);
            }
        }
    }

    contains(num){
        if(num < this.val){
            if(this.left){
                return this.left.contains(num);
            }
            return false;
        }
        if(num > this.val){
            if(this.right){
                return this.right.contains(num);
            }
            return false;
        }
        return true;
    }
}

class BST{
    constructor(){
        this.root = null;
    }

    insert(num){
        if(this.root){
            this.root.insert(num);
        } else {
            this.root = new Node(num);
        }
    }

    contains(num){
        if(this.root){
            return this.root.contains(num);
        } 
        return false;
    }
}

function curvedRect(x, y, w, h, b, ctx){
    ctx.fillRect(x + b, y + b, w - 2 * b, h - 2 * b);
    ctx.fillRect(x + b, y, w - 2 * b, b);
    ctx.fillRect(x + b, y + h - b, w - 2 * b, b);
    ctx.fillRect(x, y + b, b, h - 2 * b);
    ctx.fillRect(x + w - b, y + b, b, h - 2 * b);
    ctx.beginPath();
    ctx.arc(x + b, y + b, b, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - b, y + b, b, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + b, y + h - b, b, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w - b, y + h - b, b, 0, 2 * Math.PI);
    ctx.fill();
}