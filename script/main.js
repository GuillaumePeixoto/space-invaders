// HTML Elements

let mainMenuHTML = document.querySelector('#main-menu');
let difficultyChoices = document.querySelector('#choose-difficulty');
let difficultyButtons = document.querySelectorAll('.difficulty-buttons');
let helpPopup = document.querySelector('#controls-popup');

let customDifficulty = document.querySelector('#custom-difficulty');
let customDifficultyForm = document.querySelector('#custom-difficulty-form');
let localDifficultiesContainer = document.querySelector('#saved-difficulties-list');
let mainMenuButtons = document.querySelector('.buttons-group');

let toggleSoundEffectButton = document.querySelector('#toggle-sounds-effect');
let volumeEffectRangeBar = document.querySelector('#sound-effect-volume');
let toggleSoundSongButton = document.querySelector('#toggle-songs-effect');
let volumeSongRangeBar = document.querySelector('#sound-song-volume');

let gameViewHTML = document.querySelector('#game-view');
let gameScreen = document.querySelector('#game-screen');
let invasionZone = document.querySelector('#invasion-zone');
let enemyZone = document.querySelector('#enemy-zone');
let scoreCount = document.querySelector('#score-count');
let nextLevelMessage = document.querySelector('#level-transition');
let laserCount = document.querySelector('#laser-count');
let laserIcon = document.querySelector('#laser-item');

let scoreHTML = document.querySelector('#score');

let playButton = document.querySelector('#play-button');
let scoreButtons = document.querySelectorAll('.score-button');
let restartButton = document.querySelector('#restart-button');
let helpButton = document.querySelector('#help-button');
let closePopupButton = document.querySelector('#close-help-popup');

let endScreenHTML = document.querySelector('#end-screen');
let endScreenScore = document.querySelector('#final-score');
let endScreenLevel = document.querySelector('#final-level');
let gameOverTitle = document.querySelector('#game-over');

let backButtonToDifficulty = document.querySelector('#back-to-choose-difficulty');
let backButtonFromDifficuity = document.querySelector('#back-to-main-menu');
let backButtonFromScore = document.querySelector('#back-button');


// Global variables
let game = null;
let player = null;
let difficulty = "Custom not saved";
let difficultyParams = null;
let enableSoundsEffect = true;
let EFFECT_VOLUME = 0.5;
let enableSoundsSong = true;
let SONG_VOLUME = 0.5;



const DIFFICULTIES_RULES = {
    maxDownEnemiesGo: { min: 0, max: 800, step: 5, allowNull: true },
    scoreMultiplicator: { min: 1, max: 10, step: 1 },
    step: { min: 5, max: 40, step: 5 },
    stepDown: { min: 5, max: 40, step: 5 },
    currentDelay: { min: 100, max: 1000, step: 100 },
    laserMaxCharge: { min: 1, max: 10, step: 1 },
    shootCooldown: { min: 100, max: 1000, step: 100 },
    enemyShootingSameTme: { min: 1, max: 8, step: 1 },
    minDelay: { min: 100, max: 1000, step: 100 },
    maxDelay: { min: 200, max: 2000, step: 100 }
};

// Global Functions

function startGame() {
    cleaningGameScreen();
    mainMenuHTML.style.display = "none";
    scoreHTML.style.display = "none";
    endScreenHTML.style.display = "none";
    gameViewHTML.style.display = "flex";
    scoreCount.textContent = "0";
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

    laserCount.textContent = '0';

    // remettre le texte de transition à zéro, au cas où
    const transitionEl = document.querySelector('#level-transition');
    transitionEl.textContent = '';
    transitionEl.classList.remove('is-active');
}

function sanitizeCustomDifficultyEntries(difficultyEntries) {
    // Easy mode as default values
    let sanitizedEntries = {};
    let defaultValues = difficulties

    for (const [key, defaultValue] of Object.entries(difficulties['easy'])) {
        const rawValue = difficultyEntries[key];
        const rule = DIFFICULTIES_RULES[key];

        // Special case : maxDownEnemiesGo
        if (rule?.allowNull && (rawValue === null || rawValue === "")) {
            sanitizedEntries[key] = null;
            continue;
        }

        // Conversion to number
        const numValue = Number(rawValue);

        const isValid =
            rawValue !== "" &&
            rawValue !== null &&
            rawValue !== undefined &&
            Number.isInteger(numValue) &&
            rule &&
            numValue >= rule.min &&
            numValue <= rule.max &&
            numValue % rule.step === 0;

        sanitizedEntries[key] = isValid ? numValue : defaultValue;
    }

    if (sanitizedEntries.maxDelay < sanitizedEntries.minDelay) {
        sanitizedEntries.minDelay = DEFAULT_DIFFICULTY.minDelay;
        sanitizedEntries.maxDelay = DEFAULT_DIFFICULTY.maxDelay;
    }

    return sanitizedEntries;
}

function applyDifficultyToForm(difficultyKey) {

    difficulty = difficultyKey;
    let savedDifficulties = Storage.getAll('difficulties');
    let config = savedDifficulties.find(savedDifficulty => savedDifficulty.name === difficultyKey);;

    if (!config) {
        console.warn(`Aucune configuration trouvée pour : ${difficultyKey}`);
        return;
    }

    Object.entries(config).forEach(([key, value]) => {
        const input = document.querySelector(`#${key}`) || document.querySelector(`[name="${key}"]`);

        if (input) {
            input.value = value === null ? "" : value;
        }
    });
}

function addSavedDifficulty(formValues){
    let sanitizedDifficulty = sanitizeCustomDifficultyEntries(formValues);
    let newDifficultyName = Storage.saveDifficulty(sanitizedDifficulty);
    localDifficultiesContainer.innerHTML += `<button class='saved-difficulties' value='${newDifficultyName}'>${newDifficultyName}</button>`;
    difficulty = newDifficultyName;
}

function play(src, effect = true) {
    if (!enableSoundsEffect) return;
    const audio = new Audio(src);
    audio.volume = effect ? EFFECT_VOLUME : SONG_VOLUME;
    if(!effect){
        bgMusic.loop = true;
    }
    audio.play();
    return audio;
}

function toggleEnableSounds(){
    enableSoundsEffect = !enableSoundsEffect;
    if(enableSoundsEffect){
        toggleSoundEffectButton.textContent = "🔊";
    }else{
        toggleSoundEffectButton.textContent = "🔇";
    }
}

function toggleEnableSongs(){
    enableSoundsSong = !enableSoundsSong;
    if(enableSoundsSong){
        toggleSoundSongButton.textContent = "🔊";
    }else{
        toggleSoundSongButton.textContent = "🔇";
    }
}

// Event Listener

playButton.addEventListener('click', () => {
    mainMenuButtons.style.display = "none";
    difficultyChoices.style.display = "flex";
});

difficultyButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        difficulty = button.getAttribute('difficulty');
        difficultyParams = difficulties[difficulty];
        if (difficulty === 'custom') {
            difficultyChoices.style.display = "none";
            customDifficulty.style.display = "flex";
            Storage.renderDifficulties()
        } else {
            startGame();
        }
    });
});

document.querySelector('#saved-difficulties-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('saved-difficulties')) {
        const name = event.target.value;
        applyDifficultyToForm(name);
    }
});

volumeEffectRangeBar.addEventListener('input', (event) => {
    const output = document.querySelector(`output[for="sound-effect-volume"]`);
    let volumeValue = parseInt(event.target.value);
    output.textContent = volumeValue;
    EFFECT_VOLUME = volumeValue / 100;
    if(volumeValue === 0){
        toggleSoundEffectButton.textContent = "🔇";
        enableSoundsEffect = false;
    }else{
        toggleSoundEffectButton.textContent = "🔊";
        enableSoundsEffect = true;
    }
});

volumeSongRangeBar.addEventListener('input', (event) => {
    const output = document.querySelector(`output[for="sound-song-volume"]`);
    let volumeValue = parseInt(event.target.value);
    output.textContent = volumeValue;
    SONG_VOLUME = volumeValue / 100;
    if(game){
        game.music.volume = SONG_VOLUME;
    }
    if(volumeValue === 0){
        toggleSoundSongButton.textContent = "🔇";
        enableSoundsSong = false;
    }else{
        toggleSoundSongButton.textContent = "🔊";
        enableSoundsSong = true;
    }
});

customDifficultyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target, event.submitter);
    const values = Object.fromEntries(formData.entries());
    const action = values.action;
    delete values.action;
    if (action === "save") {
        addSavedDifficulty(values);
    } else if (action === "play") {
        difficultyParams = sanitizeCustomDifficultyEntries(values)
        startGame();
    }
});

document.querySelectorAll('#custom-difficulty-form input[type="range"]').forEach((input) => {
    const output = document.querySelector(`.field-value[for="${input.id}"]`);
    output.textContent = input.value; // valeur initiale au chargement
    difficulty = 'Custom not saved';
    input.addEventListener('input', (event) => {
        output.textContent = event.target.value;
    });
});

document.querySelectorAll('.saved-difficulties').forEach((button) => {
  button.addEventListener('click', () => {
    const key = event.currentTarget.value;
    applyDifficultyToForm(key);
  });
});

restartButton.addEventListener('click', () => {
    startGame();
});

scoreButtons.forEach((button) => {
    button.addEventListener('click', () => {
        mainMenuHTML.style.display = "none";
        endScreenHTML.style.display = "none";
        scoreHTML.style.display = "flex";
        Storage.renderScore();
    });
});

backButtonFromScore.addEventListener('click', () => {
    scoreHTML.style.display = "none";
    difficultyChoices.style.display = "none";
    customDifficulty.style.display = "none";
    mainMenuButtons.style.display = "flex";
    mainMenuHTML.style.display = "flex";
});

backButtonFromDifficuity.addEventListener('click', () => {
    scoreHTML.style.display = "none";
    difficultyChoices.style.display = "none";
    customDifficulty.style.display = "none";
    mainMenuButtons.style.display = "flex";
    mainMenuHTML.style.display = "flex";
});

backButtonToDifficulty.addEventListener('click', () => {
    scoreHTML.style.display = "none";
    customDifficulty.style.display = "none";
    mainMenuButtons.style.display = "none";
    difficultyChoices.style.display = "flex";
    mainMenuHTML.style.display = "flex";
});

helpButton.addEventListener('click', () => {
    helpPopup.classList.toggle('visible');
});

closePopupButton.addEventListener('click', () => {
    helpPopup.classList.remove('visible');
});

window.addEventListener('keydown', (event) => {
    if (event.key === "ArrowLeft") {
        game.player.moveToTheLeft();
    }

    if (event.code === "ArrowRight") {
        game.player.moveToTheRight();
    }

    if (event.code === "Space") {
        game.player.shooting();
    }

    if (event.code === "KeyX") {
        game.player.laser();
    }
})
