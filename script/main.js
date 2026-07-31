// HTML Elements

let mainMenuDivHTML = document.querySelector('#main-menu');
let gameViewDivHTML = document.querySelector('#game-view');
let endScreenDivHTML = document.querySelector('#end-screen');
let scoreDivHTML = document.querySelector('#score');
let playButton = document.querySelector('#play-button');
let scoreButton = document.querySelector('#score-button');

// Global variables

// Global Functions

function startGame(){
    mainMenuDivHTML.style.display = "none";
    gameViewDivHTML.style.display = "flex";
}

// Event Listener

playButton.addEventListener('click', () => {
    startGame();
});
