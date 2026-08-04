class Lazer {
    constructor(player) {
        this.player = player;
        this.width = 30;
        this.height = 20; // Hauteur initiale du laser
        this.x = this.player.positionMiddleOfThePlayer() - (this.width / 2);
        this.y = this.player.y;
        this.element = this.createElement('div');

        this.frames = [
            { src: 'lazer-frame1.png', height: 20 },
            { src: 'lazer-frame2.png', height: 35 },
            { src: 'lazer-frame3.png', height: 50 },
            { src: 'lazer-frame4.png', height: this.y },
        ];
    }

    refreshX() {
        this.x = this.player.positionMiddleOfThePlayer() - (this.width / 2);
    }

    refreshY(frameIndex) {
        this.y = this.player.y - this.frames[frameIndex].height;
    }

    createElement() {
        const node = document.createElement('div');
        node.style.position = 'absolute';
        node.style.left = `${this.x}px`;
        node.style.top = `${this.y}px`;
        node.style.width = `${this.width}px`;
        node.classList.add('lazer');
        gameScreen.append(node);
        return node;
    }

    fire() {
        let frameIndex = 0;

        const animateFrame = () => {
            this.refreshX();
            this.refreshY(frameIndex);
            this.height = this.frames[frameIndex].height;
            this.element.style.backgroundImage = `url(../images/${this.frames[frameIndex].src})`;
            this.element.style.height = `${this.frames[frameIndex].height}px`;
            this.element.style.top = `${(this.y)}px`;
            this.element.style.left = `${this.x}px`;

            frameIndex++;

            if (frameIndex < this.frames.length) {
                setTimeout(animateFrame, 100);
            } else {
                setTimeout(() => this.remove(), 200);
            }
        };

        animateFrame();
    }

    checkCollision(enemy) {
        // logique de collision
    }

    destroyEnemiesInPath() {
        const lazerLeft = this.x;
        const lazerRight = lazerLeft + this.width;

        enemies.forEach((enemy) => {
            const enemyLeft = enemy.x;
            const enemyRight = enemy.x + enemy.width;

            const isHit = enemyLeft < lazerRight && enemyRight > lazerLeft;

            if (isHit) {
                enemy.destroy();
            }
        });
    }

    remove() {
        this.element.remove();
        this.player.activeLazer = null;
    }
}