// ELEMENTOS
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const music = document.getElementById("bgMusic");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 500;

let cloudX = 0;


// IMAGENS
const marioImg = new Image();
marioImg.src = './imagens/mario.gif';

const pipeImg = new Image();
pipeImg.src = './imagens/pipe.png';

const cloudsImg = new Image();
cloudsImg.src = './imagens/clouds.png';


// VARIÁVEIS
let score = 0;
let gameOver = false;
let speed = 1.5;
let highScore = sessionStorage.getItem("highScore") || 0;


// PULO
const jump = () => {

    if (gameOver) return;

    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);

};


// LOOP DE COLISÃO
const loop = setInterval(() => {

    const pipePosition = pipe.offsetLeft;

    const marioPosition =
        +window.getComputedStyle(mario)
            .bottom.replace('px', '');

    const marioWidth = mario.offsetWidth;
    const marioLeft = mario.offsetLeft;
    const marioRight = marioLeft + marioWidth;

    const pipeWidth = pipe.offsetWidth;
    const pipeLeft = pipePosition;
    const pipeRight = pipePosition + pipeWidth;

    const collision =
        pipeLeft < marioRight - 60 &&
        pipeRight > marioLeft + 60 &&
        marioPosition < 60;

    if (collision) {

        gameOver = true;

        // PARA A MÚSICA
        music.pause();

        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = './imagens/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        clearInterval(loop);
    }

}, 10);


// SISTEMA DE PONTUAÇÃO + DIFICULDADE
setInterval(() => {

    if (!gameOver) {

        score++;

        // ATUALIZA RECORDE
        if (score > highScore) {

            highScore = score;
            sessionStorage.setItem("highScore", highScore);

        }

        // AUMENTA DIFICULDADE
        if (score % 100 === 0) {

            speed -= 0.1;

            if (speed < 0.7) speed = 0.7;

            pipe.style.animation = `pipe-animation ${speed}s infinite linear`;
        }

    }

}, 200);


// DESENHO NO CANVAS
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pipePosition = pipe.offsetLeft;

    // NUVENS
    cloudX -= 0.5;

    if (cloudX <= -550) {
        cloudX = canvas.width;
    }

    ctx.drawImage(cloudsImg, cloudX, 50, 550, 200);


    // CANO
    ctx.drawImage(pipeImg, pipePosition, 420, 80, 80);


    // SCORE NEON
    ctx.font = "30px 'Press Start 2P'";
    ctx.fillStyle = "#f74646";
    ctx.shadowColor = "#f74646";
    ctx.shadowBlur = 15;

    ctx.fillText("Pontuação: " + score, 20, 40);
    ctx.fillText("Recorde: " + highScore, 20, 80);

    ctx.shadowBlur = 0;


    // GAME OVER
    if (gameOver) {

        ctx.font = "50px Arial";
        ctx.fillText("GAME OVER", 260, 200);

        ctx.font = "25px Arial";
        ctx.fillText("Pressione ENTER para reiniciar", 200, 250);
    }

    requestAnimationFrame(draw);
}

draw();


// CONTROLES
document.addEventListener('keydown', (event) => {

    if (event.code === "Space") {

        // INICIA MÚSICA SE NÃO ESTIVER TOCANDO
        if (music.paused) {

            music.volume = 0.4;
            music.play();

        }

        jump();
    }

    if (event.code === "Enter" && gameOver) {
        location.reload();
    }

});