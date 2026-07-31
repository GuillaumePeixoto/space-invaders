class Enemy {
    constructor(frontElement ,enemyType){

        const enemyNode = document.createElement('img');
        enemyNode.src = `./images/alien-${enemyType}.png`;
        frontElement.appendChild(enemyNode);

    }
}