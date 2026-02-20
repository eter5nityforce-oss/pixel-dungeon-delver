import { Entity } from './entity.js';
import { Item } from './item.js';
import { Equipment } from './equipment.js';
import { TileType } from '../map/map.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, '@', '#ff0');
        this.name = "Player";
        this.hp = 100;
        this.maxHp = 100;
        this.attackValue = 10;
        this.defenseValue = 2;
        this.xp = 0;
        this.xpToLevel = 50;
        this.level = 1;
        this.inventory = [];
        this.equipment = { weapon: null, armor: null };
    }

    gainXp(amount, game) {
        this.xp += amount;
        game.log(`You gain ${amount} XP.`);
        if (this.xp >= this.xpToLevel) {
            this.levelUp(game);
        }
        game.updateUI();
    }

    levelUp(game) {
        this.level++;
        this.xp -= this.xpToLevel;
        this.xpToLevel = Math.floor(this.xpToLevel * 1.5);
        this.maxHp += 10;
        this.hp = this.maxHp;
        this.attackValue += 2;
        this.defenseValue += 1;
        game.log(`Level up! You are now level ${this.level}.`);
        game.updateUI();
    }

    move(dx, dy, game) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        const map = game.map;

        // Check for entity
        for (const entity of game.entities) {
            if (entity !== this && entity.x === newX && entity.y === newY) {
                if (entity instanceof Item) {
                    game.log(`You see ${entity.name} here.`);
                } else {
                    this.attack(entity, game);
                    return true;
                }
            }
        }

        if (map.isWalkable(newX, newY)) {
            this.x = newX;
            this.y = newY;
            return true;
        }
        return false;
    }

    pickUp(game) {
        for (let i = 0; i < game.entities.length; i++) {
            const entity = game.entities[i];
            if (entity !== this && entity.x === this.x && entity.y === this.y) {
                 if (entity instanceof Item) {
                    if (this.inventory.length >= 10) {
                        game.log("Inventory full!");
                        return;
                    }
                    this.inventory.push(entity);
                    game.entities.splice(i, 1);
                    game.log(`You picked up ${entity.name}.`);

                    // Check if Amulet
                    if (entity.name === "Amulet of Yendor") {
                        game.winGame();
                    }

                    game.updateInventoryUI();
                    return;
                 }
            }
        }
        game.log("There is nothing here to pick up.");
    }

    useItem(index, game) {
        const item = this.inventory[index];
        if (!item) return;

        if (item.use(this, game)) {
            this.inventory.splice(index, 1);
            game.updateInventoryUI();
        }
    }

    equip(item, game) {
        const oldItem = this.equipment[item.slot];
        if (oldItem) {
            this.unequip(oldItem, game);
            game.log(`You unequipped ${oldItem.name}.`);
            this.inventory.push(oldItem);
        }

        this.equipment[item.slot] = item;

        if (item.slot === 'weapon') this.attackValue += item.bonus;
        if (item.slot === 'armor') this.defenseValue += item.bonus;

        game.log(`You equipped ${item.name}.`);
        game.updateUI();
    }

    unequip(item, game) {
        if (item.slot === 'weapon') this.attackValue -= item.bonus;
        if (item.slot === 'armor') this.defenseValue -= item.bonus;
        this.equipment[item.slot] = null;
    }

    descend(game) {
        if (game.map.getTile(this.x, this.y) === TileType.STAIRS_DOWN) {
            game.nextLevel();
        } else {
            game.log("There are no stairs here.");
        }
    }
}
