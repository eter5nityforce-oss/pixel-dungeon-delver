import { Item } from './item.js';

export class Equipment extends Item {
    constructor(x, y, char, color, name, slot, bonus) {
        super(x, y, char, color, name);
        this.slot = slot; // "weapon", "armor"
        this.bonus = bonus; // attack or defense
        this.type = "equipment";
    }

    // Equip logic handled by player/inventory
    use(user, game) {
        // Equips the item
        user.equip(this, game);
        return true; // Moved to equipment slot, removed from inventory
    }
}
