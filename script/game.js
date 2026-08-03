class Game {
    constructor() {
        this.currentLevelIndex = 0;
        this.maxDownEnemiesGo = 0; // Si valeur, on bloque, sinon on laisse les ennemis descendre jusqu'en bas de l'écran et atteindre le niveau du joueur alors game over
        this.player = new Player();
        this.level = new Level(this.currentLevelIndex, this.maxDownEnemiesGo);
        this.score = 0;
        this.loop = this.loop.bind(this);
    }

    addScore(points) {
        this.score += points;
        scoreCount.textContent = this.score;
    }

    start() {
        requestAnimationFrame(this.loop);
        // this.intervalId = setInterval(this.loop, 1000/60); // Remplacé par requestAnimationFrame car plus performant et plus fluide
    }

    gameOver() {
        this.level.stopMovement();
        this.level.stopEnemyShooting();
        this.player.bullets.filter((bullet) => {
            bullet.destroy();
        });
        gameViewHTML.style.display = "none";
        endScreenHTML.style.display = "flex";
        endScreenScore.textContent = this.score;
        endScreenLevel.textContent = this.currentLevelIndex + 1;
        Score.add(this.currentLevelIndex, this.score);
    }

    startLevel(index) {
        this.level = new Level(this.currentLevelIndex, this.maxDownEnemiesGo);
        this.start();
    }

    nextLevel() {
        this.level.cleanUp();
        this.addScore(1000);
        this.currentLevelIndex++;
        this.level.showLevelTransition(this.currentLevelIndex);
        setTimeout(() => {
            nextLevelMessage.classList.remove('is-active');
            this.startLevel(this.currentLevelIndex);
        }, 2000);

    }

    loop() {
        this.updateBullets();
        this.updateEnemiesBullets();
        this.checkPlayerBulletsCollisions();
        this.checkEnnemyBulletCollisions();
        this.checkingEnemyRemaining();
        if(this.level.enemies.length > 0) {
            requestAnimationFrame(this.loop); // se relance à chaque frame, ~60 fois/seconde -> meilleur perf que setInterval et ne se mets pas en pause si l'onglet n'est pas actif
        } 
    }

    updateEnemiesBullets() {
        this.level.enemiesBullets.forEach((bullet) => bullet.moving());

        this.level.enemiesBullets = this.level.enemiesBullets.filter((bullet) => {
            const stillOnScreen = bullet.y < gameScreen.offsetHeight;
            if (!stillOnScreen) bullet.destroy();
            return stillOnScreen;
        });
    }

    updateBullets() {
        this.player.bullets.forEach((bullet) => bullet.moving());

        this.player.bullets = this.player.bullets.filter((bullet) => {
            const stillOnScreen = bullet.y > 0;
            if (!stillOnScreen) bullet.destroy();
            return stillOnScreen;
        });
    }

    checkPlayerBulletsCollisions() {
        if (!this.level) return;

        this.player.bullets.forEach((bullet) => {
            this.level.enemies.forEach((enemy) => {
                if (bullet.hit || enemy.hit) return; // évite de compter deux fois le même coup
                if (isColliding(bullet, enemy)) {
                    bullet.hit = true;
                    enemy.hit = true;
                }
            });
        });

        this.player.bullets = this.player.bullets.filter((bullet) => {
            if (bullet.hit) bullet.destroy();
            return !bullet.hit;
        });

        this.level.enemies = this.level.enemies.filter((enemy, index) => {
            if (enemy.hit) {
                enemy.destroy();
                this.addScore(100);
                this.level.enemies.splice(index, 0);
                this.player.addKillForLazer();
            }
            return !enemy.hit;
        });
    }

    checkEnnemyBulletCollisions() {
        this.level.enemiesBullets.forEach((bullet) => {
            if (bullet.hit) return;
            if (isColliding(bullet, this.player)) {
                bullet.hit = true;
                this.gameOver();
            }
        });
    }

    checkingEnemyRemaining() {
        if (this.level.enemies.length === 0) {
            this.nextLevel();
        }
    }

}