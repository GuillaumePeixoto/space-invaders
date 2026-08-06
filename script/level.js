class Level {
    constructor(indexLevel, maxDownEnemiesGo) {
        this.formation = formations[indexLevel];
        this.enemies = [];
        this.enemiesBullets = [];
        this.maxDownEnemiesGo = maxDownEnemiesGo;
        this.lastShooter = null;

        this.offsetY = 0;
        this.offsetX = 0;
        this.step = difficultyParams.step;
        this.stepDown = difficultyParams.stepDown;
        this.reverseMouvement = false;
        this.currentDelay = difficultyParams.currentDelay; // delai entre les mouvements des ennemis, en ms
        this.enemyShootingSameTme = difficultyParams.enemyShootingSameTme;
        this.moveTimeoutId = null;
        this.shootTimeoutId = null;
        this.minDelay = difficultyParams.minDelay;
        this.maxDelay = difficultyParams.maxDelay;

        if(indexLevel >= formations.length){
            // finished the game
        }

        this.renderFormation();
        this.startMovement();
        this.startEnemyShooting();
    }

    startMovement() {
        this.moveTimeoutId = setTimeout(() => {
            this.moveEnemies();
            this.startMovement();
        }, this.currentDelay);
    }

    stopMovement() {
        clearTimeout(this.moveTimeoutId);
    }

    renderFormation() {
        let zoneWidth = enemyZone.offsetWidth;
        let enemyWidth = zoneWidth / this.formation[0].length;
        enemyZone.style.display = 'grid';
        enemyZone.style.gridTemplateColumns = `repeat(${this.formation[0].length}, 1fr)`;
        enemyZone.style.rowGap = '30px';
        this.formation.forEach((rowEnemies, rowIndex) => {
            rowEnemies.forEach((EnemyType, columnIndex) => {
                const spaceNode = document.createElement('div');
                spaceNode.className = EnemyType !== 0 ? `enemy-slot row-${rowIndex} col-${columnIndex}` : 'enemy-slot enemy-slot--empty';
                spaceNode.style.width = `${enemyWidth}px`;
                spaceNode.style.height = '40px';
                if (EnemyType != 0) {
                    let enemy = new Enemy(spaceNode, EnemyType, rowIndex, columnIndex);
                    this.enemies.push(enemy);
                }
                enemyZone.appendChild(spaceNode);
            })
        })
    }

    moveEnemies(step) {
        let hitEdge = false;

        if(enemyZone.offsetWidth + this.offsetX + this.step > gameScreen.offsetWidth){
            this.step = -(this.step);
            hitEdge = true;
        } else if(this.offsetX + this.step < 0){
            this.step = -(this.step);
            hitEdge = true;
        }

        if (hitEdge && (this.maxDownEnemiesGo === null || (this.maxDownEnemiesGo !== null && this.offsetY + this.stepDown <= this.maxDownEnemiesGo))) {
            this.offsetY += this.stepDown;
            enemyZone.style.transform = `translateX(${this.offsetX}px) translateY(${this.offsetY}px)`;
            return;
        }

        this.offsetX += this.step;
        enemyZone.style.transform = `translateX(${this.offsetX}px) translateY(${this.offsetY}px)`;
    }

    getFrontlineEnemies() {
        return this.enemies.filter((enemy) => {
            const hasEnemyBelow = this.enemies.some((other) => (other.col === enemy.col && other.row > enemy.row));
            return !hasEnemyBelow;
        });
    }

    startEnemyShooting() {
        const delay = Math.floor(Math.random() * (this.maxDelay - this.minDelay + 1)) + this.minDelay; // Random delay between minDelay and maxDelay
        const frontline = this.getFrontlineEnemies();
        const candidates = (frontline.length > 1 && this.lastShooter)
            ? frontline.filter((enemy) => enemy.col !== this.lastShooter.col || enemy.row !== this.lastShooter.row)
            : frontline;

        this.shootTimeoutId = setTimeout(() => {
            if (frontline.length === 0) return;

            let selectedEnemies = [];

            const actualCount = Math.min(this.enemyShootingSameTme, candidates.length);

            for (let i = 0; i < actualCount; i++) {
                const index = Math.floor(Math.random() * candidates.length);
                const shooter = candidates.splice(index, 1)[0];

                const bullet = new Bullet(shooter, 1);
                this.enemiesBullets.push(bullet);
                this.lastShooter = shooter;
            }

            this.startEnemyShooting();
        }, delay);
    }

    stopEnemyShooting() {
        clearTimeout(this.shootTimeoutId);
    }

    cleanUp() {
        this.stopMovement();
        this.stopEnemyShooting();
        this.enemies.forEach((enemy) => enemy.destroy());
        this.enemies = [];
        this.enemiesBullets.forEach((bullet) => bullet.destroy());
        this.enemiesBullets = [];
        enemyZone.innerHTML = '';
        enemyZone.style.transform = 'translateX(0px) translateY(0px)';
    }

    showLevelTransition(levelIndex) {
        nextLevelMessage.textContent = `LEVEL ${levelIndex + 1}`;
        nextLevelMessage.classList.add('is-active');
    }
}