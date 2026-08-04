class Player {
    constructor() {

        this.node = document.createElement('div');
        this.node.innerHTML = "<div class='ship-wrap'><img src='images/Spaceship-flammes.png' class='ship-flame' alt=''><img src='images/Spaceship.png' class='ship' alt='Vaisseau du joueur'></div>";
        gameScreen.append(this.node);

        this.activeLaser = null;
        this.laserCharge = 0;
        this.laserMaxCharge = difficultyParams.laserMaxCharge;
        this.height = 40;
        this.width = 40;
        this.x = (gameScreen.offsetWidth / 2) - (this.width / 2);
        this.y = 600;
        this.bullets = [];
        this.lastShotTime = 0;
        this.shootCooldown = difficultyParams.shootCooldown;
        this.killCount = 0;

        this.node.style.width = `${this.width}px`;
        this.node.style.height = `${this.height}px`;
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.position = 'absolute';
    }

    positionMiddleOfThePlayer() {
        return this.x + (this.width / 2);
    }

    moveToTheLeft() {
        this.x = (this.x - (this.width / 2) < 0) ? 0 : this.x - (this.width / 2);
        this.node.style.left = `${this.x}px`;
    }

    moveToTheRight() {
        this.x = (this.positionMiddleOfThePlayer() > (gameScreen.offsetWidth - this.width)) ? gameScreen.offsetWidth - this.width : this.positionMiddleOfThePlayer();
        this.node.style.left = `${this.x}px`;
    }

    shooting() {
        const now = Date.now();
        if (now - this.lastShotTime < this.shootCooldown) {
            return;
        }
        this.lastShotTime = now;
        const bulletX = this.positionMiddleOfThePlayer() - 3; // 3 = moitié de la largeur du tir
        const bulletY = this.y;
        const bullet = new Bullet(this, -1);
        this.bullets.push(bullet);
    }

    addKillForLaser() {
        this.killCount++;
        if (this.killCount === 10) {
            this.rechargeLaser();
            this.refreshLaserCount();
            this.killCount = 0;
        }
    }

    refreshLaserCount() {
        laserCount.textContent = this.laserCharge;
    }

    rechargeLaser() {
        if (this.laserCharge < this.laserMaxCharge) {
            this.laserCharge += 1;
            this.refreshLaserCount()
        }
    }

    laser() {
        if (this.laserCharge < 1) {
            return;
        }

        const widthLaser = 50;
        const newLaser = new Laser(this, widthLaser);
        newLaser.fire();
        this.activeLaser = newLaser;

        this.laserCharge -= 1;
        this.refreshLaserCount();
    }
}