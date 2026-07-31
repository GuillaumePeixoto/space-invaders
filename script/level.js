class Level {
    constructor(indexLevel) {
        this.formation = formations[indexLevel];
        this.enemies = [];
        
        this.offsetX = 0;
        this.step = 20;
        this.reverseMouvement = false;
        this.direction = 1;
        this.currentDelay = 800;
        this.moveTimeoutId = null;

        this.renderFormation();
        this.startMovement();
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
        console.log(this.formation[0].length);
        this.formation.forEach((columnEnemies) => {
            columnEnemies.forEach((EnemyType) => {
                console.log(EnemyType);
                const spaceNode = document.createElement('div');
                spaceNode.className = EnemyType !== 0 ? 'enemy-slot' : 'enemy-slot enemy-slot--empty';
                spaceNode.style.width = `${enemyWidth}px`;
                spaceNode.style.height = '40px';
                if (EnemyType != 0) {
                    let enemy = new Enemy(spaceNode, EnemyType);
                    this.enemies.push(enemy);
                }
                enemyZone.appendChild(spaceNode);
            })
        })
    }

    moveEnemies(step) {
        if(enemyZone.offsetWidth + this.offsetX >= gameScreen.offsetWidth){
            this.step = -(this.step);
            console.log('vers la gauche')
        } else if(this.offsetX + this.step < 0){
            this.step = -(this.step);
            console.log('vers la droite')
        }

        this.offsetX += this.step;
        enemyZone.style.transform = `translateX(${this.offsetX}px)`;
    }
}