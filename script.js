//board stup
let board;
let tilesize = 25;
let row = 20;
let column = 20;
let boardWidth = tilesize * column;
let boardHeight = tilesize * row;

//gameBtnsvars
let playAgain;
let gameStartBtn;
let gameStartDiv;

//snake
let snakeWidth = tilesize;
let snakeHeight = tilesize;
let snakeX = tilesize;
let snakeY = boardHeight / 2;
let snakeBodyArray = [];
let snake = {
    x: snakeX,
    y: snakeY,
    width: snakeWidth,
    height: snakeHeight,
    radii: [0, 10, 10, 0]
}

//snakeEyes setup
let eyesWidth = 5;
let eyesHeight = 5;
let eyesX = snake.x + snake.width - 10;
let eyesY = snake.y + 5;
let eye = {
    x: eyesX,
    y: eyesY,
    width: eyesWidth,
    height: eyesHeight,
    radii: [3, 3, 3, 3]
}


//food
let foodWidth = tilesize;
let foodHeight = tilesize;
let foodX = null;
let foodY = null;
let food = {
    x: foodX,
    y: foodY,
    width: foodWidth,
    height: foodHeight
}


//physics
let velocityX = 1;
let velocityY = 0;

//interval setup
let timeInterval = 200;
let gameInterval;

//score
let score = 0;
let multiple = 1;
let gameover = false;

//sounds
let foodSound = new Audio("assets/snakeFood.mp3");
let snakeMoveSound = new Audio("assets/movement.mp3");
let gameoverSound = new Audio("assets/snakeGameover.mp3");


window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;

    //Btns elements
    playAgain = document.getElementById("playAgain");
    gameStartBtn = document.getElementById("play");
    gameStartDiv = document.getElementById("startgame");

    context = board.getContext("2d");
    gameStartBtn.addEventListener("click", start);
}

function start() {
    gameInterval = setInterval(update, timeInterval);
    snakeFood();
    document.addEventListener("keyup", moveSnakeHead);
    playAgain.addEventListener("click", restart);
}

function update() {
    if (gameover) {
        context.clearRect(0, 0, board.width, board.height);
        //gamover title
        context.fillStyle = "white";
        context.font = "65px Courier New";
        context.fillText("GAME OVER", 3 * tilesize, boardHeight / 2);
        //score title
        context.fillStyle = "white";
        context.font = "20px courier";
        context.fillText(`score: ${score}`, 8 * tilesize, boardHeight / 2 + 2 * tilesize);
        playAgain.style.display = "block";
        return;
    }

    gameStartDiv.style.display = "none";

    context.clearRect(0, 0, board.width, board.height);

    //snake food
    context.fillStyle = "rgba(200, 255, 0, 0.916)";
    context.fillRect(food.x, food.y, food.width, food.height);
    if (snake.x === food.x && snake.y === food.y) {
        foodSound.play();
        snakeFood();
        snakeBodyArray.push([food.x, food.y]);
        score++;
        if(score === 5*multiple){
            clearInterval(gameInterval); 
            timeInterval -= 5*multiple;
            multiple++;
            gameInterval = setInterval(update, timeInterval); 
        }
    }

    //pushing each parts to a new x and y coordinate
    for (let i = snakeBodyArray.length - 1; i > 0; i--) {
        snakeBodyArray[i] = snakeBodyArray[i - 1];
    }

    if (snakeBodyArray.length) {
        snakeBodyArray[0] = [snake.x, snake.y];
    }

    //snake draw
    context.fillStyle = "rgba(255, 255, 255, 0.397)";
    snake.x += velocityX * tilesize;
    snake.y += velocityY * tilesize;
    context.beginPath();
    context.roundRect(snake.x, snake.y, snake.width, snake.height, snake.radii);
    context.fill();
    for (let i = 0; i < snakeBodyArray.length; i++) {
        let snakepart = snakeBodyArray[i];
        context.fillStyle = "white";
        context.fillRect(snakepart[0], snakepart[1], snake.width, snake.height);
    }


    //gameover 
    if (snake.x < 0 || snake.x > boardWidth || snake.y < 0 || snake.y > boardHeight) {
        gameoverSound.play();
        gameover = true;
    }

    for (let i = 0; i < snakeBodyArray.length; i++) {
        if (snake.x == snakeBodyArray[i][0] && snake.y == snakeBodyArray[i][1]) {
            gameover = true;
            gameoverSound.play();
        }
    }

    //eyes setup
    context.fillStyle = "black";
    context.beginPath();
    eye.x += velocityX * tilesize;
    eye.y += velocityY * tilesize;
    context.roundRect(eye.x, eye.y, eye.width, eye.height, eye.radii);
    context.fill();


    //score
    context.fillStyle = "white";
    context.font = "20px courier";
    context.fillText(`score: ${score}`, 10, 17);
}

//restart game
function restart() {
    gameover = false;
    score = 0;
    velocityX = 1;
    velocityY = 0;
    snake.x = snakeX;
    snake.y = snakeY;
    snake.radii = [0, 10, 10, 0];
    snakeFood();
    snakeBodyArray = [];
    eye.x = eyesX;
    eye.y = eyesY;
    clearInterval(gameInterval); 
    timeInterval = 200;
    gameInterval = setInterval(update, timeInterval); 
    playAgain.style.display = "none";
}

//snakefood generation
function snakeFood() {
    let randomX = Math.floor(Math.random() * (column - 2)) * tilesize;
    let randomY = Math.floor(Math.random() * (row - 2)) * tilesize;
    //this checks is randomx and y are on the score box are if yes then it reallocate the food
    if(randomX <= 100 && randomY <= 50){
        console.log("this is randomx and y", randomX, randomY);
        snakeFood();
        return;
    }
    food.x = randomX;
    food.y = randomY;
}

//movement of the head of the snake 
function moveSnakeHead(e) {

    if (e.code === "ArrowLeft" && velocityX != 1) {
        snake.radii = [10, 0, 0, 10]
        eye.x = snake.x + 10;
        eye.y = snake.y +  5;
        snakeMoveSound.play();
        velocityX = -1;
        velocityY = 0;
    } else if (e.code === "ArrowRight" && velocityX != -1) {
        snake.radii = [0, 10, 10, 0];
        eye.x = snake.x + snake.width - 10;
        eye.y = snake.y + 5;
        snakeMoveSound.play();
        velocityX = 1;
        velocityY = 0;
    } else if (e.code === "ArrowUp" && velocityY != 1) {
        snake.radii = [10, 10, 0, 0];
        eye.x = snake.x + 5;
        eye.y = snake.y + 5;
        snakeMoveSound.play();
        velocityX = 0;
        velocityY = -1;
    } else if (e.code === "ArrowDown" && velocityY != -1) {
        snake.radii = [0, 0, 10, 10];
        eye.x = snake.x + snake.width - 10;
        eye.y = snake.y + snake.height - 10;
        snakeMoveSound.play();
        velocityX = 0;
        velocityY = 1;
    }
}
