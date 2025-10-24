// Ambil elemen dari HTML
const canvass = document.getElementById('gamecanvas');
const ctx = canvass.getContext('2d');
const scoreElement = document.getElementById('score');
const gameoverElement = document.getElementById('gameover');

// Ukuran kotak/grid
const gridSize = 20;
const gridwidth = canvass.width / gridSize;
const gridheight = canvass.height / gridSize;

// Variabel utama game
let snake = [{ x: Math.floor(gridwidth / 2), y: Math.floor(gridheight / 2) }];
let food = { x: 5, y: 5 };
let direction = 'RIGHT';
let score = 0;
let gameRunning = true;
let speed = 150;
let game;




// Fungsi menggambar game di canvas
function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvass.width, canvass.height);

    // Ular
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Makanan
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Fungsi logika permainan
function update() {
    if (!gameRunning) return;

    const head = { ...snake[0] };

    // Gerakan ular sesuai arah
    if (direction === 'UP') head.y--;
    if (direction === 'DOWN') head.y++;
    if (direction === 'LEFT') head.x--;
    if (direction === 'RIGHT') head.x++;

    // Cek tabrakan dinding
    if (head.x < 0 || head.x >= gridwidth || head.y < 0 || head.y >= gridheight) {
        endGame();
        return;
    }

    // Cek tabrakan dengan tubuh sendiri
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    // Cek apakah makan makanan
    
    
}

// Fungsi membuat makanan di posisi acak
function generateFood() {
    food = {
        x: Math.floor(Math.random() * gridwidth),
        y: Math.floor(Math.random() * gridheight)
    };
}

// Fungsi saat Game Over
function endGame() {
    gameRunning = false;
    gameoverElement.style.display = 'block';
    clearInterval(game);

    
}

// Fungsi utama game (loop)
function gameloop() {
    update();
    draw();
}

// Fungsi restart game
function restartGame() {
    snake = [{ x: Math.floor(gridwidth / 2), y: Math.floor(gridheight / 2) }];
    direction = 'RIGHT';
    score = 0;
    scoreElement.textContent = score;
    gameRunning = true;
    gameoverElement.style.display = 'none';
    generateFood();
    draw();

    // Reset kecepatan & musik
    speed = 150;
    clearInterval(game);
    game = setInterval(gameloop, speed);

  
}

// Arah gerak dengan keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

// Jalankan pertama kali
restartGame();
