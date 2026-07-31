class Game {
    constructor() {
        this.currentLevelIndex = 0;
        this.player = new Player();
        this.level = new Level(this.currentLevelIndex);
        this.score = 0;
    }

    addScore(points) {
        this.score += points;
    }

    startLevel(index) {
        this.level = new Level(currentLevelIndex);
    }

    nextLevel() {
        this.startLevel(this.currentLevelIndex + 1);
    }
}