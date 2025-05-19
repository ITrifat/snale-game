const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const eatSound = document.getElementById("eatSound");
const bgMusic = document.getElementById("bgMusic");
const gameOverSound = document.getElementById("gameOverSound");
const skinSelector = document.getElementById("skinSelector");
const pauseBtn = document.getElementById("pauseBtn");

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let dx = gridSize;
let dy = 0;
let food = generateFood();
let score = 0;
let level = 1;
let speed = 150;
let gameInterval;
let paused = false;
let currentSkin = 'classic';

const skinColors = {
  classic: { head: 'yellow', body: 'lime' },
  blue: { head: 'lightblue', body: 'deepskyblue' },
  fire: { head: 'orange', body: 'red' }
};

function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
  };
}

function drawSnake() {
  const colors = skinColors[currentSkin];
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? colors.head : colors.body;
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + gridSize/2, food.y + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
  ctx.fill();
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    eatSound.play();
    score += 10;
    updateScoreAndLevel();
    food = generateFood();
  } else {
    snake.pop();
  }
}

function updateScoreAndLevel() {
  scoreDisplay.textContent = score;
  if (score % 50 === 0) {
    level++;
    levelDisplay.textContent = level;
    speed = Math.max(50, speed - 10);
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
  }
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    gameOverSound.play();
    alert("💀 Game Over!");
    resetGame();
  }
}

function resetGame() {
  snake = [{ x: 200, y: 200 }];
  dx = gridSize;
  dy = 0;
  score = 0;
  level = 1;
  speed = 150;
  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
  if (paused) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
  moveSnake();
  checkCollision();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0; dy = -gridSize;
  } else if (e.key === "ArrowDown" && dy === 0) {
    dx = 0; dy = gridSize;
  } else if (e.key === "ArrowLeft" && dx === 0) {
    dx = -gridSize; dy = 0;
  } else if (e.key === "ArrowRight" && dx === 0) {
    dx = gridSize; dy = 0;
  } else if (e.key === " " || e.key === "p") {
    togglePause();
  }
});

function togglePause() {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶️ Resume" : "⏸ Pause";
}

pauseBtn.addEventListener("click", togglePause);

skinSelector.addEventListener("change", (e) => {
  currentSkin = e.target.value;
});

// Start the game with music
// Start the game with music
bgMusic.volume = 0.3;
// bgMusic.play();  // autoplay বন্ধ রাখলাম
gameInterval = setInterval(gameLoop, speed);
