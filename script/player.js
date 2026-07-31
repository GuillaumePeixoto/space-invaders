class Player {
    constructor(){

        this.node = document.createElement('div');
        this.node.innerHTML = "<div class='ship-wrap'><img src='images/Spaceship-flammes.png' class='ship-flame' alt=''><img src='images/Spaceship.png' class='ship' alt='Vaisseau du joueur'></div>";
        gameScreen.append(this.node);

        this.score = 0;
        this.lazerCharge = 0;
        this.height = 40;
        this.width = 40;
        this.x = (gameScreen.offsetWidth / 2) - (this.width / 2);
        this.y = 600;

        this.node.style.width = `${this.width}px`;
        this.node.style.height = `${this.height}px`;
        this.node.style.left = `${this.x}px`;
        this.node.style.top = `${this.y}px`;
        this.node.style.position = 'absolute';
    }

    
    moveToTheLeft(){
        this.x = (this.x - (this.width / 2) < 0 ) ? 0 : this.x - (this.width / 2);
        this.node.style.left = `${this.x}px`;
    }

    moveToTheRight(){
        this.x = (this.x + (this.width / 2) > (gameScreen.offsetWidth - this.width) ) ? gameScreen.offsetWidth - this.width : this.x + (this.width / 2);
        this.node.style.left = `${this.x}px`;
    }
}