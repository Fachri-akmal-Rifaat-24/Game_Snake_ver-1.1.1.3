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

// 🔊 Suara dan musik
const eatSound = new Audio('coin-257878.mp3');           // suara saat makan
const gameOverSound = new Audio('game-over-401236.mp3'); // suara saat game over
const bgMusic = new Audio('funny-bgm-240795.mp3');       // musik latar

// Atur musik latar
bgMusic.loop = true;
bgMusic.volume = 0.4; // 0 = pelan, 1 = keras

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
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        eatSound.play();
        generateFood();

        // Ular makin cepat tiap 50 poin
        if (score % 50 === 0 && speed > 40) {
            clearInterval(game);
            speed -= 10;
            game = setInterval(gameloop, speed);
        }
    } else {
        snake.pop();
    }
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

    // 🔇 Hentikan musik latar dan mulai suara game over
    bgMusic.pause();
    bgMusic.currentTime = 0;
    gameOverSound.play();
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

    // 🔊 Mainkan musik latar lagi dari awal
    bgMusic.currentTime = 0;
    bgMusic.play();
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
