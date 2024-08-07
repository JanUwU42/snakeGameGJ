var canvas = document.getElementById('gameCanvas');
var context = canvas.getContext('2d');

var grid = 16;
var highscore = 0;
var lastTime = 0;
var speed = 0; // speed of the game in milliseconds (e.g. 100ms = 10fps)
var animationId; // variable to save the requestAnimationFrame-ID
var didChangeDirection = false; // variable to track wether the snake is already moving in this frame
var difficulty = "Mittel"
var buttons = document.getElementsByClassName('difficultyBtn');

const difficulties = [6, 10, 15, 25, 50, 100];

setDifficulty(difficulties[2], buttons[2]); // default speed = medium

// create snake
const snake = {
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
const apple = {
    x: 320,
    y: 320
};

// get random whole numbers in a specific range from min to max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function setDifficulty(fps, btn) {
    speed = 1000 / fps; // convert fps in milliseconds per Frame

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected');
    }
    btn.classList.add('selected');

    // sets difficulty as a text for the db
    switch (fps) {
        case 6:
            difficulty = "Sehr leicht";
            
            break;
        case 10:
            difficulty = "Leicht";
            break;
        case 15:
            difficulty = "Mittel";
            break;
        case 25:
            difficulty = "Schwer";
            break;
        case 50:
            difficulty = "Sehr Schwer";
            break;
        case 100:
            difficulty = "Unmöglich";
            break;
    }
}

function snakeEatApple() {
    snake.maxCells++;

    // canvas is 400x400 which is 25x25 grids
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;

    updateScore();
}

function resetGame() {
    if (animationId) {
        cancelAnimationFrame(animationId); // stop the game
        animationId = null; // set the animationId to null, to make sure, that the animation stopped
    }

    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;

    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;

    enableButtonsAndInput();
}

function enableButtonsAndInput() {
    document.getElementById('startGameBtn').disabled = false; // reactivate the start button

    document.getElementById('userName').disabled = false; // reactivate the UserName Field

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
}

// game loop
function gameLoop(timestamp) {
    if (!animationId) {
        return; // end game loop when animationID is null
    }

    if (timestamp - lastTime >= speed) {
        lastTime = timestamp;
        context.clearRect(0, 0, canvas.width, canvas.height);

        didChangeDirection = false; // reset direction change lock

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
        snake.cells.forEach(cell => {
            // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
            context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

            // snake ate apple
            if (cell.x === apple.x && cell.y === apple.y) {
                snakeEatApple();
            }
        });

        // check collision with all cells after this one (modified bubble sort)
        for (var i = 1; i < snake.cells.length; i++) {
            // snake occupies same space as a body part. reset game
            if (snake.cells[0].x === snake.cells[i].x && snake.cells[0].y === snake.cells[i].y) {
                setHighscore();
                resetGame();
                updateDB();
                return; // end the game loop to ensure that the game loop / requestanimationframe doesnt get called again
            }
        }
    }

    animationId = requestAnimationFrame(gameLoop);
}

function setHighscore() {
    if (snake.maxCells > highscore) {
        highscore = snake.maxCells;
        document.getElementById('highscore').innerHTML = `Highscore: ${highscore}`;
    }
}

function updateScore() {
    document.getElementById('currentScore').innerHTML = `Score: ${snake.maxCells}`;
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
            moveLeft();
            e.preventDefault();
            break;
        case 'a':
        case 'A':
            moveLeft();
            break;

        // move up
        case 'ArrowUp':
            moveUp();
            e.preventDefault();
            break;
        case 'w':
        case 'W':
            moveUp();
            break;

        // move right
        case 'ArrowRight':
            moveRight();
            e.preventDefault();
            break;
        case 'd':
        case 'D':
            moveRight();
            break;

        // move down
        case 'ArrowDown':
            moveDown();
            e.preventDefault();
            break;
        case 's':
        case 'S':
            moveDown();
            break;
    }
});

function moveLeft() {
    if (snake.dx === 0 && !didChangeDirection) {
        snake.dx = -grid;
        snake.dy = 0;
        didChangeDirection = true; // lock direction change
    }
}

function moveUp() {
    if (snake.dy === 0 && !didChangeDirection) {
        snake.dy = -grid;
        snake.dx = 0;
        didChangeDirection = true; // lock direction change
    }
}

function moveRight() {
    if (snake.dx === 0 && !didChangeDirection) {
        snake.dx = grid;
        snake.dy = 0;
        didChangeDirection = true; // lock direction change
    }
}

function moveDown() {
    if (snake.dy === 0 && !didChangeDirection) {
        snake.dy = grid;
        snake.dx = 0;
        didChangeDirection = true; // lock direction change
    }
}

// start the game
function startGame() {
    lastTime = 0; // reset lastTime to ensure smooth start
    if (!animationId) { // Start the game only if it is not already running
        animationId = requestAnimationFrame(gameLoop);
        disableButtonsAndInput();
    }
    updateScore();
}

function disableButtonsAndInput() {
    document.getElementById('startGameBtn').disabled = true;
    document.getElementById('userName').disabled = true;
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

async function updateDB() {
    const timestamp = new Date().toISOString();
    let data = {
        "username": document.getElementById("userName").value,
        "score": highscore,
        "difficulty": difficulty,
        "timestamp": timestamp
    }

    await fetch("../db/submit.php", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

document.getElementById('userName').addEventListener('input', function () {
    if (this.value == "") {
        document.getElementById('startGameBtn').disabled = true;
    } else {
        document.getElementById('startGameBtn').disabled = false;
    }
});
