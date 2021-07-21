let snakeDirection = { x: 0, y: 0 }
const soundFood = new Audio("music/food.mp3");
const soundMusic = new Audio("music/music.mp3");
const soundGameOver = new Audio("music/gameover.mp3");
const soundMove = new Audio("music/move.mp3");
let speed = parseInt(speedInput.value);
let score = 0;
let lastPaintTime = 0;
let snakeBody = [{ x: 13, y: 15 }]
let food = { x: 8, y: 8 }
let pauseGame = false

speedInput.addEventListener("change", (e) => {
    speed = parseInt(e.target.value) || 1

})



const initialFunction = (ctime) => {
    window.requestAnimationFrame(initialFunction);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed || pauseGame)
        return;
    lastPaintTime = ctime
    gameLogic();

    drawGameAndFood();
}



function gameLogic() {
    // soundMusic.play();
    if (isCollide()) {
        endGame();
        return;
    }
    eatenFood();
    moveSnake();
}

function eatenFood() {
    if (snakeBody[0].x === food.x && snakeBody[0].y === food.y) {
        soundFood.play()
        snakeBody.unshift({ x: snakeBody[0].x + snakeDirection.x, y: snakeBody[0].y + snakeDirection.y })
        generateNewFood();
        score += speed;
        scoreArea.innerHTML = `Your Score : ${score}`
        if (snakeBody.length % 5 === 0) { speed += 1; speedInput.value = speed }
    }

}

function moveSnake() {
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] }
    }
    snakeBody[0].x += snakeDirection.x;
    snakeBody[0].y += snakeDirection.y;
}

function endGame() {
    soundGameOver.play();
    soundMusic.pause();
    snakeDirection = { x: 0, y: 0 };
    alert(`Game over, Your Score is ${score} `);
    snakeBody = [{ x: 13, y: 15 }]
    score = 0;
    scoreArea.innerHTML = `Your Score : 0`
    speed = 5;
    speedInput.value = speed
}

function isCollide() {
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i].x === snakeBody[0].x && snakeBody[i].y === snakeBody[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snakeBody[0].x >= 18 || snakeBody[0].x <= 0 || snakeBody[0].y >= 18 || snakeBody[0].y <= 0) {
        return true;
    }

    return false;
}

function generateNewFood() {
    const a = 2;
    const b = 16;
    food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }

}


function drawGameAndFood() {
    gameGrid.innerHTML = ""
    drawSnake();
    drawFood();


}

function drawSnake() {
    snakeBody.forEach((e, i) => {
        snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (i === 0) {
            snakeElement.classList.add("snake-head")
            snakeElement.style.transform = changeSnakeHeadDirection(snakeDirection)
        }
        else {
            snakeElement.classList.add("snake-body");
        } gameGrid.appendChild(snakeElement)
    })
}

function drawFood() {
    foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food")
    gameGrid.appendChild(foodElement)
}


window.requestAnimationFrame(initialFunction);

// key press handler
window.addEventListener("keydown", (event) => {
    snakeDirection = { x: 0, y: 1 }
    soundMove.play();
    const head = document.getElementsByClassName("snake-head");
    switch (event.key) {
        case "ArrowUp":
            changeDirection(0, -1);
            break;
        case "ArrowDown":
            changeDirection(0, 1);
            head[0].style.transform = "rotate(0deg)"

            break;
        case "ArrowLeft":
            changeDirection(-1, 0);
            break;
        case "ArrowRight":
            changeDirection(1, 0);
            break;

        default:
            pauseAndResumeGame();
            break;
    }
})

function pauseAndResumeGame() {
    pauseGame = true;
    soundMusic.pause();
}

function changeDirection(x, y) {
    pauseGame = false
    snakeDirection.x = x;
    snakeDirection.y = y
}

function changeSnakeHeadDirection({ x, y }) {
    if (x === 0 && y === -1) {
        return "rotate(180deg) scale(2.5)"
    } else if (x === 0 && y === 1) {
        return "rotate(0deg) scale(2.5)"
    } else if (x === -1 && y === 0) {
        return "rotate(90deg) scale(2.5)"
    }
    else if (x === 1 && y === 0) {
        return "rotate(-90deg) scale(2.5)"
    }
}


