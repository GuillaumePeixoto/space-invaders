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

let endScreenHTML = document.querySelector('#end-screen');
let endScreenScore = document.querySelector('#final-score');
let endScreenLevel = document.querySelector('#final-level');

// Global variables
let game = null;
let player = null;


// Global Functions

function startGame(){
    mainMenuHTML.style.display = "none";
    gameViewHTML.style.display = "flex";
    game = new Game();
    game.start();
    console.log(game.currentLevelIndex)
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Event Listener

playButton.addEventListener('click', () => {
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
