class Player {
    constructor(){

        this.node = document.createElement('div');
        this.node.innerHTML("<div class='ship-wrap'><img src='images/Spaceship-flammes.png' class='ship-flame' alt=''><img src='images/Spaceship.png' class='ship' alt='Vaisseau du joueur'></div>");

        this.score = 0;
        this.lazerCharge = 0;
        this.x = 0;
        this.y = 0;
        this.height = 40;
        this.width = 30;

        this.node.style.width = `${this.width}px`;
        this.node.style.width = `${this.width}px`;

        
    }

    
    moveToTheLeft(){
        this.x = (this.x - (this.width / 2) < 0 ) ? 0 : this.x - (this.width / 2);
        this.node.style.left = `${this.y}px`;
    }

    moveDown(){
        this.y = (this.x + (this.width / 2) > (gameBoxNode.offsetWidth - this.width) ) ? gameBoxNode.offsetWidth - this.width : this.y + (this.width / 2);
        this.node.style.left = `${this.y}px`;
    }
}