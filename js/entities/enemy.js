import { Entity } from './entity.js';
import { Pathfinding } from '../pathfinding.js';

export class Enemy extends Entity {
    constructor(x, y) {
        super(x, y, 'g', '#f00'); // Red 'g' goblin
        this.name = "Goblin";
    }

    act(game) {
        const player = game.player;
        const map = game.map;

        // If not in player's FOV, do nothing (sleep)
        if (map.visible.has(`${this.x},${this.y}`)) {
            const dist = Math.abs(this.x - player.x) + Math.abs(this.y - player.y);

            if (dist > 1) {
                const pf = new Pathfinding(map);
                const path = pf.findPath(this.x, this.y, player.x, player.y);

                if (path.length > 1) {
                    const nextStep = path[1];

                    // Check if occupied by another entity
                    let blocked = false;
                    for (const entity of game.entities) {
                        if (entity.x === nextStep.x && entity.y === nextStep.y) {
                            blocked = true;
                            break;
                        }
                    }

                    if (!blocked) {
                        this.x = nextStep.x;
                        this.y = nextStep.y;
                    }
                }
            } else {
                // Attack player
                this.attack(player, game);
            }
        }
    }
}
