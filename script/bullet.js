class Bullet {
  constructor(shooter, direction) {
    this.x = shooter.x + (shooter.width / 2 - 2);
    this.y = direction === -1 ? shooter.y : shooter.y + shooter.height;
    this.speed = 3; // speed du tir
    this.direction = direction; // direction du tir (-1 pour le joueur, 1 pour les ennemis)

    this.shoot = document.createElement('div');
    this.width = 4
    this.height = 12;
    this.shoot.style.width = `${this.width}px`;
    this.shoot.style.height = `${this.height}px`;
    this.shoot.style.position = 'absolute';
    this.shoot.style.left = `${this.x}px`;
    this.shoot.style.top = `${this.y}px`;
    this.shoot.style.background = direction === -1 ? '#d9a441' : '#ff0000'; // ou la couleur que tu veux
    this.shoot.style.borderRadius = '2px';

    gameScreen.appendChild(this.shoot);
  }

  moving() {
    this.y += this.speed * this.direction; // vers le haut si direction = -1, vers le bas si direction = 1
    this.shoot.style.top = `${this.y}px`;
  }

  destroy() {
    this.shoot.remove();
  }
}