import { Entity } from './entity.js';

export class Item extends Entity {
    constructor(x, y, char, color, name) {
        super(x, y, char, color);
        this.name = name;
        this.type = "item";
    }

    use(user, game) {
        game.log(`You use ${this.name}. Nothing happens.`);
        return false;
    }
}
