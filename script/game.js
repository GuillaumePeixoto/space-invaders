class Game {
    constructor() {
        this.currentLevelIndex = 0;
        this.maxDownEnemiesGo = difficultyParams.maxDownEnemiesGo; // Si valeur, on bloque, sinon on laisse les ennemis descendre jusqu'en bas de l'écran et atteindre le niveau du joueur alors game over
        this.player = new Player();
        this.level = new Level(this.currentLevelIndex, this.maxDownEnemiesGo);
        this.score = 0;
        this.scoreMultiplicator = difficultyParams.scoreMultiplicator;
        this.loop = this.loop.bind(this);
        this.music = play('sounds/music1.mp3', false);
    }

    addScore(points) {
        this.score += points * this.scoreMultiplicator;
        scoreCount.textContent = this.score;
    }

    start() {
        requestAnimationFrame(this.loop);
        // this.intervalId = setInterval(this.loop, 1000/60); // Remplacé par requestAnimationFrame car plus performant et plus fluide
    }

    gameOver(titleContent, win = false) {
        this.level.stopMovement();
        this.level.stopEnemyShooting();
        this.player.bullets.filter((bullet) => {
            bullet.destroy();
        });
        gameViewHTML.style.display = "none";
        endScreenHTML.style.display = "flex";
        gameOverTitle.textContent = titleContent;
        endScreenScore.textContent = this.score;
        endScreenLevel.textContent = this.currentLevelIndex + 1;
        this.music.pause();
        win ? play('sounds/game_over_sound.mp3') : play('sounds/game_over_sound.mp3') ;
        Storage.saveScore(this.currentLevelIndex + 1, this.score, difficulty);
    }

    startLevel(index) {
        this.level = new Level(this.currentLevelIndex, this.maxDownEnemiesGo);
        this.start();
    }

    nextLevel() {
        this.level.cleanUp();
        this.addScore(1000);
        if(formations.length <= this.currentLevelIndex + 1 ){
            this.gameOver('You win');
            return;
        }
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
        this.checkLaserCollisions();
        this.checkEnnemyBulletCollisions();
        this.checkingEnemyRemaining();
        this.checkingEnemyReachPlayer();
        if (this.level.enemies.length > 0) {
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
                this.player.addKillForLaser();
            }
            return !enemy.hit;
        });
    }

    checkLaserCollisions() {
        if (!this.level || !this.player.activeLaser) return;

        const laser = this.player.activeLaser;

        this.level.enemies.forEach((enemy) => {
            if (enemy.hit) return;
            laser.refreshX();
            if (isColliding(laser, enemy)) {
                enemy.hit = true;
            }
        });

        this.level.enemies = this.level.enemies.filter((enemy) => {
            if (enemy.hit) {
                enemy.destroy();
                this.addScore(100);
                this.player.addKillForLaser();
            }
            return !enemy.hit;
        });
    }

    checkEnnemyBulletCollisions() {
        this.level.enemiesBullets.forEach((bullet) => {
            if (bullet.hit) return;
            if (isColliding(bullet, this.player)) {
                bullet.hit = true;
                this.gameOver('Game Over');
            }
        });
    }

    checkingEnemyReachPlayer(){
        if(this.maxDownEnemiesGo < this.player.y && this.maxDownEnemiesGo != null){
            return;
        }
        this.level.enemies.forEach((enemy) => {
            if(enemy.y + enemy.height >= this.player.y){
                this.gameOver('Game Over');
            }
        })
    }

    checkingEnemyRemaining() {
        if (this.level.enemies.length === 0) {
            this.nextLevel();
        }
    }

}