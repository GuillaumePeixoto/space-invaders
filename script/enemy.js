class Enemy {
    constructor(frontElement ,enemyType, row, col){
        this.row = row;
        this.col = col;
        this.enemyNode = document.createElement('img');
        this.enemyNode.src = `./images/alien-${enemyType}.png`;
        frontElement.appendChild(this.enemyNode);
    }

    get x() {
        const rect = this.enemyNode.getBoundingClientRect();
        const screenRect = gameScreen.getBoundingClientRect();
        return rect.left - screenRect.left;
    }

    get y() {
        const rect = this.enemyNode.getBoundingClientRect();
        const screenRect = gameScreen.getBoundingClientRect();
        return rect.top - screenRect.top;
    }

    get width() {
        return this.enemyNode.getBoundingClientRect().width;
    }

    get height() {
        return this.enemyNode.getBoundingClientRect().height;
    }

    destroy() {
        this.enemyNode.src = './images/explosion.gif';

        setTimeout(() => {
            this.enemyNode.remove();
        }, 200);
    }
}