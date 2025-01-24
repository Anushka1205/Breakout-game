// Game constants
const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');

const blockWidth = 60;
const blockHeight = 20;
const paddleWidth = 100;
const ballDiameter = 20;

const gridWidth = 600;
const gridHeight = 400;

let score = 0;

// Block class
class Block {
  constructor(x, y) {
    this.left = x;
    this.bottom = y;
    this.element = document.createElement('div');
    this.element.classList.add('block');
    this.element.style.left = `${this.left}px`;
    this.element.style.bottom = `${this.bottom}px`;
    grid.appendChild(this.element);
  }
}

// Create blocks
const blocks = [];
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 10; j++) {
    blocks.push(new Block(j * blockWidth, gridHeight - (i + 1) * blockHeight - 50));
  }
}

// Paddle
const paddle = document.createElement('div');
paddle.classList.add('paddle');
grid.appendChild(paddle);

let paddlePosition = 250;

// Move paddle
function movePaddle(e) {
  if (e.key === 'ArrowLeft' && paddlePosition > 0) {
    paddlePosition -= 20;
  } else if (e.key === 'ArrowRight' && paddlePosition < gridWidth - paddleWidth) {
    paddlePosition += 20;
  }
  paddle.style.left = `${paddlePosition}px`;
}

document.addEventListener('keydown', movePaddle);

// Ball
const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);

let ballPosition = { x: 290, y: 30 };
let ballDirection = { x: 2, y: 2 };

// Move ball
function moveBall() {
  ballPosition.x += ballDirection.x;
  ballPosition.y += ballDirection.y;

  // Ball collision with walls
  if (ballPosition.x <= 0 || ballPosition.x >= gridWidth - ballDiameter) {
    ballDirection.x *= -1;
  }
  if (ballPosition.y >= gridHeight - ballDiameter) {
    ballDirection.y *= -1;
  }

  // Ball collision with paddle
  if (
    ballPosition.x > paddlePosition &&
    ballPosition.x < paddlePosition + paddleWidth &&
    ballPosition.y <= ballDiameter
  ) {
    ballDirection.y *= -1;
  }

  // Ball collision with blocks
  blocks.forEach((block, index) => {
    if (
      ballPosition.x > block.left &&
      ballPosition.x < block.left + blockWidth &&
      ballPosition.y > block.bottom &&
      ballPosition.y < block.bottom + blockHeight
    ) {
      blocks.splice(index, 1);
      grid.removeChild(block.element);
      ballDirection.y *= -1;
      score++;
      scoreDisplay.textContent = score;
    }
  });

  // Ball falls off grid
  if (ballPosition.y <= 0) {
    clearInterval(ballInterval);
    alert(`Game Over! Your score: ${score}`);
    document.location.reload();
  }

  // Update ball position
  ball.style.left = `${ballPosition.x}px`;
  ball.style.bottom = `${ballPosition.y}px`;
}

const ballInterval = setInterval(moveBall, 20);
