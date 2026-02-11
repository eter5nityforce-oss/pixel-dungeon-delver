import { Item } from './item.js';

export class HealthPotion extends Item {
    constructor(x, y) {
        super(x, y, '!', '#f0f', "Health Potion");
        this.healAmount = 20;
    }

    use(user, game) {
        if (user.hp >= user.maxHp) {
            game.log("You are already at full health.");
            return false;
        }
        user.takeDamage(-this.healAmount, game); // Heals
        if (user.hp > user.maxHp) user.hp = user.maxHp;
        game.log(`You use ${this.name} and recover ${this.healAmount} HP.`);
        return true;
    }
}
