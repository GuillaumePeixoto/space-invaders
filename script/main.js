// HTML Elements

let mainMenuHTML = document.querySelector('#main-menu');

let gameViewHTML = document.querySelector('#game-view');
let gameScreen = document.querySelector('#game-screen');
let invasionZone = document.querySelector('#invasion-zone');
let enemyZone = document.querySelector('#enemy-zone');
let scoreCount = document.querySelector('#score-count');
let nextLevelMessage = document.querySelector('#level-transition');

let scoreHTML = document.querySelector('#score');

let backButton = document.querySelector('#back-button');
let playButton = document.querySelector('#play-button');
let scoreButtons = document.querySelectorAll('.score-button');
let restartButton = document.querySelector('#restart-button');

let endScreenHTML = document.querySelector('#end-screen');
let endScreenScore = document.querySelector('#final-score');
let endScreenLevel = document.querySelector('#final-level');

// Global variables
let game = null;
let player = null;


// Global Functions

function startGame(){
    cleaningGameScreen();
    mainMenuHTML.style.display = "none";
    scoreHTML.style.display = "none";
    endScreenHTML.style.display = "none";
    gameViewHTML.style.display = "flex";
    game = new Game();
    game.start();
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function cleaningGameScreen() {
    enemyZone.innerHTML = '';
    enemyZone.style.transform = 'translateX(0px) translateY(0px)';

    // supprimer tous les tirs encore à l'écran (joueur)
    if (game && game.player && game.player.bullets) {
        game.player.bullets.forEach((bullet) => bullet.destroy());
        game.player.bullets = [];
    }

    // supprimer tous les tirs ennemis encore à l'écran
    if (game && game.level && game.level.enemyBullets) {
        game.level.enemyBullets.forEach((bullet) => bullet.destroy());
        game.level.enemyBullets = [];
    }

    if (game && game.player && game.player.node) {
        game.player.node.remove();
    }

    // remettre le texte de transition à zéro, au cas où
    const transitionEl = document.getElementById('level-transition');
    transitionEl.textContent = '';
    transitionEl.classList.remove('is-active');
}

// Event Listener

playButton.addEventListener('click', () => {
    startGame();
});

restartButton.addEventListener('click', () => {
    startGame();
});

scoreButtons.forEach((button) => {
    button.addEventListener('click', () => {
        mainMenuHTML.style.display = "none";
        endScreenHTML.style.display = "none";
        scoreHTML.style.display = "flex";
        Score.render();
    });
});

backButton.addEventListener('click', () => {
    scoreHTML.style.display = "none";
    mainMenuHTML.style.display = "flex";
});

window.addEventListener('keydown', (event) => {
    if(event.key === "ArrowLeft"){
        game.player.moveToTheLeft();
    }

    if(event.code === "ArrowRight"){
        game.player.moveToTheRight();
    }

    if(event.code === "Space"){
        game.player.shooting();
    }
})
