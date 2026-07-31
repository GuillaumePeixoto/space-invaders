// HTML Elements

let mainMenuHTML = document.querySelector('#main-menu');
let gameViewHTML = document.querySelector('#game-view');
let gameScreen = document.querySelector('#game-screen');
let invasionZone = document.querySelector('#invasion-zone');
let enemyZone = document.querySelector('#enemy-zone');
let endScreenHTML = document.querySelector('#end-screen');
let scoreHTML = document.querySelector('#score');
let playButton = document.querySelector('#play-button');
let scoreButton = document.querySelector('#score-button');

// Global variables
let game = null;
let player = null;


// Global Functions

function startGame(){
    mainMenuHTML.style.display = "none";
    gameViewHTML.style.display = "flex";
    game = new Game();


}

// Event Listener

playButton.addEventListener('click', () => {
    startGame();
});

window.addEventListener('keydown', (event) => {
    if(event.key === "ArrowLeft"){
        game.player.moveToTheLeft();
    }

    if(event.key === "ArrowRight"){
        game.player.moveToTheRight();
    }
})
