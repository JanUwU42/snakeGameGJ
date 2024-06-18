var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
var highscore = 0;

// create snake
var snake = {
    x: 160,
    y: 160,

    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: grid,
    dy: 0,

    // keep track of all grids the snake body occupies
    cells: [],

    // length of the snake. grows when eating an apple
    // also counts as the score of the player
    maxCells: 4
};

// create apple
var apple = {
    x: 320,
    y: 320
};

/* Difficulties
    Slows down game loop to less fps instead of 60 (60/desiredFPS = difficulty)
    very easy = 10
    easy = 6
    medium/normal = 4
    Hard = 3
    Insane = 1 
*/
var difficulty = 4;

// get random whole numbers in a specific range from min to max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function setDifficulty(dDifficulty) {
    difficulty = dDifficulty;
}

function snakeEatApple() {
    snake.maxCells++;

    // canvas is 400x400 which is 25x25 grids
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
}

function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;

    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
}

// game loop
function gameLoop() {
    requestAnimationFrame(gameLoop);

    // set difficulty/speed of the game 
    if (++count < difficulty) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // move snake by it's velocity
    snake.x += snake.dx;
    snake.y += snake.dy;

    // wrap snake position horizontally on edge of screen
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    // wrap snake position vertically on edge of screen
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    }
    else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // keep track of where snake has been. front of the array is always the head
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // draw apple
    context.fillStyle = '#f53b57';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // draw snake one cell at a time
    context.fillStyle = '#0be881';
    snake.cells.forEach(function (cell, index) {

        // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // snake ate apple
        if (cell.x === apple.x && cell.y === apple.y) {
            snakeEatApple();
        }

        // check collision with all cells after this one (modified bubble sort)
        for (var i = index + 1; i < snake.cells.length; i++) {
            // snake occupies same space as a body part. reset game
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                setHighscore();
                resetGame();
            }
        }
    });
}

function setHighscore() {
    if (snake.maxCells > highscore) {
        highscore = snake.maxCells;
        document.getElementById('highscore').innerHTML = `Highscore: ${snake.maxCells}`;
    }
}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function (e) {
    // prevent snake from backtracking on itself by checking that it's
    // not already moving on the same axis (pressing left while moving
    // left won't do anything, and pressing right while moving left
    // shouldn't let you collide with your own body)

    // handle arrow keys and WASD keys
    switch (e.key) {
        // move left
        case 'ArrowLeft':
        case 'a':
            moveLeft();
            break;

        // move up
        case 'ArrowUp':
        case 'w':
            moveUp();
            break;

        // move right
        case 'ArrowRight':
        case 'd':
            moveRight();
            break;

        // move down
        case 'ArrowDown':
        case 's':
            moveDown();
            break;
    }
});

function moveLeft() {
    if (snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
}

function moveUp() {
    if (snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
}

function moveRight() {
    if (snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
}

function moveDown() {
    if (snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
}

// start the game
function startGame() {
    requestAnimationFrame(gameLoop);
    document.getElementById('startGameBtn').disabled = true;
}
