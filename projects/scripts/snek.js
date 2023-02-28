const canvas = document.getElementById("snek");
const ctx = canvas.getContext("2d");
var victoryFlag = false;
var continueFlag = true;
var refreshRate = 1;
var gameMatrix = new Array(2);
var gameLocationMatrixX = new Array(2);
var gameLocationMatrixY = new Array(2);
var currentFoodW;
var currentFoodH;
var nextMove;
var headW;
var headH;
var isFoodSpawned;
var snakeLength;
var myInterval;
var windowX;

window.onload = function starting() {
    //Init canvas with black color
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,800,600);
    
    
    for (w=0; w<38; w++) {
        gameMatrix[w] = new Array(2);
        gameLocationMatrixX[w] = new Array(2);
        gameLocationMatrixY[w] = new Array(2); 
    }

    for (w=0; w<38; w++) {
        for (h=0; h<28; h++) {
            gameMatrix[w][h] = "empty";
            gameLocationMatrixX[w][h] = (h + 1) * 20;
            gameLocationMatrixY[w][h] = (w + 1) * 20;
            
        }
    }
    
    //draw text
    addText("white",340,150,"S N E K", "30px Arial");
    addText("white",380,350,"Play", "15px Arial");

    //checking if "Play" is hit
    canvas.addEventListener("mousedown", function clickCheck(evt) {
        var x = evt.clientX;
        var y = evt.clientY;
        
        windowX = window.screen.availWidth;
        var offset = (windowX - 800)/2
        if ( y<390 && y>365 && x>380+offset && x <420+offset) {
            startGame();
            canvas.removeEventListener("mousedown", clickCheck);
        }
    }, false);
    
}

function resetGame() {
    canvas.removeEventListener("keydown", keypress);

    //Init canvas with black color
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,800,600);

    for (w=0; w<38; w++) {
        for (h=0; h<28; h++) {
            gameMatrix[w][h] = "empty";
            gameLocationMatrixX[w][h] = (h + 1) * 20;
            gameLocationMatrixY[w][h] = (w + 1) * 20;
            
        }
    }
    
    //draw text
    addText("white",340,150,"S N E K", "30px Arial");
    addText("white",380,350,"Play", "15px Arial");

    //checking if "Play" is hit
    canvas.addEventListener("mousedown", function clickCheck(evt) {
        var x = evt.clientX;
        var y = evt.clientY;
        if ( y<365 && y>340 && x>380 && x <420) {
            startGame();
            canvas.removeEventListener("mousedown", clickCheck);
        }
    }, false);
}

//Draws text on target location
function addText(color, x, y, string, font) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(string,x,y);
}

//Game creation
function startGame() {

    //Empty canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,800,600);

    //White border of play area
    ctx.fillStyle = "white";
    ctx.fillRect(18,18,764,564);
    ctx.fillStyle = "black";
    ctx.fillRect(19,19,762,562);

    //event listener for wasd
    document.addEventListener("keydown", keypress);

    //Snake first spawn
    gameMatrix[5][5] = 2;
    gameMatrix[5][4] = 1;
    headW = 5;
    headH = 5;
    snakeLength = 2;
    nextMove = "down";

    //Game loop
    isFoodSpawned = false;
    myInterval = setInterval(function () {gameLoop()}, 800);  
}

function gameLoop() {

    //Move S N E K
    moveSnek();

    //draw S N E K
    ctx.fillStyle = "white";
    for (w=0; w<38; w++) {
        for (h=0; h<28; h++) {
            if (gameMatrix[w][h]>0) {
                if (gameMatrix[w][h] === "empty") {

                } else {
                    if(headW == w && headH == h) {
                        ctx.fillStyle = "lime";
                        gameMatrix[w][h] = gameMatrix[w][h] - 1;
                        ctx.fillRect(gameLocationMatrixY[w][h],gameLocationMatrixX[w][h],18,18);
                        ctx.fillStyle = "white";
                    } else {
                        gameMatrix[w][h] = gameMatrix[w][h] - 1;
                        ctx.fillRect(gameLocationMatrixY[w][h],gameLocationMatrixX[w][h],18,18);
                    }
                }
                if (gameMatrix[w][h] == 0) {
                    ctx.fillStyle = "black";
                    ctx.fillRect(gameLocationMatrixY[w][h],gameLocationMatrixX[w][h],18,18);
                    ctx.fillStyle = "white";
                }
            }
        }
    }

    //draw food
    if (!isFoodSpawned) {
        ctx.fillStyle = "red";
        flag = true;
        var counter = 0;
        do {
            w = Math.floor(Math.random()*38);
            h = Math.floor(Math.random()*28);
            if (gameMatrix[w][h] === "empty") {
                flag = false;
            }
            counter += 1
            if (counter == 1064) {
                victory();
            }
        } while(flag)
        currentFoodW = w;
        currentFoodH = h;
        gameMatrix[w][h] = "food";
        ctx.fillRect(gameLocationMatrixY[w][h],gameLocationMatrixX[w][h],18,18);
        isFoodSpawned = true;
    }

    
}


//Move S N E K
function moveSnek() {
    switch(nextMove) {
        case "up": if(headH<=0) {lose()} 
                   else {
                    if(gameMatrix[headW][headH-1] > 0) {
                        lose()
                    } else {
                        if (gameMatrix[headW][headH-1] == "food") {
                            for (w=0; w<38; w++) {
                                for (h=0; h<28; h++) {
                                    if (gameMatrix[w][h] > 0) {
                                        gameMatrix[w][h] += 1;
                                    }
                                }
                            }
                            snakeLength += 1;
                            isFoodSpawned = false;
                        }
                        gameMatrix[headW][headH-1] = snakeLength+1;
                        headH -= 1; 
                    }
                   }
            break;
        case "down": if(headH>27) {lose()} 
                    else {
                    if(gameMatrix[headW][headH+1] > 0) {
                        lose()
                    } else {
                        if (gameMatrix[headW][headH+1] == "food") {
                            for (w=0; w<38; w++) {
                                for (h=0; h<28; h++) {
                                    if (gameMatrix[w][h] > 0) {
                                        gameMatrix[w][h] += 1;
                                    }
                                }
                            }
                            snakeLength += 1;
                            isFoodSpawned = false;
                        }
                        gameMatrix[headW][headH+1] = snakeLength+1;
                        headH += 1;  
                    }
                    }
            break;
        case "left":if(headW<=0) {lose()} 
                    else {
                    if(gameMatrix[headW-1][headH] > 0) {
                        lose()
                    } else {
                        if (gameMatrix[headW-1][headH] == "food") {
                            for (w=0; w<38; w++) {
                                for (h=0; h<28; h++) {
                                    if (gameMatrix[w][h] > 0) {
                                        gameMatrix[w][h] += 1;
                                    }
                                }
                            }
                            snakeLength += 1;
                            isFoodSpawned = false;
                        }
                        gameMatrix[headW-1][headH] = snakeLength+1;
                        headW -= 1;  
                    }
                    }
            break;
        case "right":if(headW>37) {lose()} 
                    else {
                    if(gameMatrix[headW+1][headH] > 0) {
                        lose()
                    } else {
                        if (gameMatrix[headW+1][headH] == "food") {
                            for (w=0; w<38; w++) {
                                for (h=0; h<28; h++) {
                                    if (gameMatrix[w][h] > 0) {
                                        gameMatrix[w][h] += 1;
                                    }
                                }
                            }
                            snakeLength += 1;
                            isFoodSpawned = false;
                        }
                        gameMatrix[headW+1][headH] = snakeLength+1; 
                        headW += 1; 
                    }
                    }
            break;
    }
}

function keypress(evt) {
    switch(evt.code) {
        case "KeyW": nextMove = "up";
            break;
        case "KeyA": nextMove = "left";
            break;
        case "KeyS": nextMove = "down";
            break;
        case "KeyD": nextMove = "right";
            break;
        default: break;
    }
}

function foodEaten() {
    snakeLength = snakeLength + 1
    gameMatrix[currentFoodW][currentFoodH] = snakeLength + 2;
    isFoodSpawned = false;
    victoryFlag = true;
    for (w=0; w<38; w++) {
        for (h=0; h<28; h++) {
            if (gameMatrix[w][h] === "empty") {
                victoryFlag = false;
                break;
            }
        }
    }
    if (victoryFlag) {
        continueFlag = true;
    }
}

function victory() {
    clearInterval(myInterval);
    alert("You Won!");
    resetGame();
}

function lose() {
    clearInterval(myInterval);
    alert("You Lost!");
    resetGame();
}
