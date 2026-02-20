export class Entity {
    constructor(x, y, char, color) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.color = color;
        this.name = "Entity";

        // Stats
        this.hp = 10;
        this.maxHp = 10;
        this.attackValue = 2;
        this.defenseValue = 0;
        this.xp = 0;
        this.level = 1;

        this.dead = false;
    }

    draw(display, map) {
        // Check visibility
        if (map && !map.visible.has(`${this.x},${this.y}`)) return;

        const tileSize = display.tileSize;
        display.ctx.fillStyle = this.color;

        // Draw circle
        display.ctx.beginPath();
        display.ctx.arc(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, Math.PI * 2);
        display.ctx.fill();

        // Draw HP bar for damaged entities?
        if (this.hp < this.maxHp) {
            const barWidth = tileSize - 4;
            const healthPercent = this.hp / this.maxHp;

            display.ctx.fillStyle = '#f00';
            display.ctx.fillRect(this.x * tileSize + 2, this.y * tileSize - 4, barWidth, 4);

            display.ctx.fillStyle = '#0f0';
            display.ctx.fillRect(this.x * tileSize + 2, this.y * tileSize - 4, barWidth * healthPercent, 4);
        }
    }

    attack(target, game) {
        const damage = Math.max(0, this.attackValue - target.defenseValue);
        game.log(`${this.name} attacks ${target.name} for ${damage} damage!`);
        target.takeDamage(damage, game);
    }

    takeDamage(amount, game) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.die(game);
        }
    }

    die(game) {
        this.dead = true;
        game.log(`${this.name} dies!`);

        // Remove from entities list
        const index = game.entities.indexOf(this);
        if (index > -1) {
            game.entities.splice(index, 1);
        }

        // Drop XP?
        if (this !== game.player) {
            game.player.gainXp(10 + this.level * 5, game);
        }

        if (this === game.player) {
            game.gameOver();
        }
    }
}
