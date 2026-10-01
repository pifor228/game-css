let bird = { x: 50, y: 200, width: 40, height: 40, velocity: 0 };
let gravity = 0.5;
let gameOver = false;
let score = 0;
let pipes = [];

const gameContainer = document.querySelector('.game');
const birdElement = document.getElementById('bird');
const scoreDisplay = document.getElementById('score');

class Pipe {
    constructor(x) {
        this.x = x;
        this.width = 60;
        this.gapSize = 120;
        this.gapY = Math.random() * (gameContainer.clientHeight - this.gapSize - 100) + 50;
        this.scored = false;

        // Create pipe elements
        this.topElement = document.createElement('div');
        this.bottomElement = document.createElement('div');

        this.topElement.className = 'pipe top';
        this.bottomElement.className = 'pipe bottom';

        gameContainer.appendChild(this.topElement);
        gameContainer.appendChild(this.bottomElement);
    }
}

function gameLoop() {
    if (gameOver) return;
    
    // Apply gravity
    bird.velocity += gravity;
    bird.y += bird.velocity;
    
    // Update bird position
    birdElement.style.top = bird.y + 'px';
    
    // Move pipes
    pipes.forEach((pipe, index) => {
        pipe.x -= 5;

        // Update pipe position
        pipe.topElement.style.left = pipe.x + 'px';
        pipe.topElement.style.height = pipe.gapY + 'px';

        pipe.bottomElement.style.left = pipe.x + 'px';
        pipe.bottomElement.style.height =
            (gameContainer.clientHeight - pipe.gapY - pipe.gapSize) + 'px';
        
        // Check score
        if (pipe.x < bird.x && !pipe.scored) {
            score++;
            pipe.scored = true;
            scoreDisplay.textContent = 'Score: ' + score;
        }
        
        // Check collision
        // BUG: Wrong collision detection - should be > not <
        if (bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipe.width &&
            (bird.y < pipe.gapY || bird.y + bird.height > pipe.gapY + pipe.gapSize)) {
            gameOver = true;
            scoreDisplay.textContent = 'Game Over! Score: ' + score;
        }
        
        // Remove offscreen pipes
        if (pipe.x < -pipe.width) {
            pipe.topElement.remove();
            pipe.bottomElement.remove();
            pipes.splice(index, 1);
        }
    });
    
    // Check if bird hit ground or ceiling
    if (bird.y > gameContainer.clientHeight || bird.y < 0) {
        gameOver = true;
        scoreDisplay.textContent = 'Game Over! Score: ' + score;
    }
}

// Spawn pipes
setInterval(() => {
    if (!gameOver && pipes.length < 3) {
        pipes.push(new Pipe(gameContainer.clientWidth));
    }
}, 2000);

// Jump on click
document.addEventListener('click', () => {
    bird.velocity = -10;
});

// Game loop
setInterval(gameLoop, 20);