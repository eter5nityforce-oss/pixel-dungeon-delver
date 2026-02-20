export class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener('keydown', (e) => this.handleKey(e));
    }

    handleKey(e) {
        const player = this.game.player;
        if (!player) return;

        let dx = 0;
        let dy = 0;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                dy = -1;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                dy = 1;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                dx = -1;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                dx = 1;
                break;
            case 'g':
            case 'G':
            case ',':
                player.pickUp(this.game);
                if (this.game.engine.update) this.game.engine.update();
                if (this.game.updateUI) this.game.updateUI();
                return;
            case '>':
            case '.':
                player.descend(this.game);
                // Descend consumes turn?
                // nextLevel resets map and entities.
                // engine.update not needed because new level.
                return;
            case 'i':
            case 'I':
                if (this.game.toggleInventory) this.game.toggleInventory();
                return;
            default:
                return;
        }

        if (dx !== 0 || dy !== 0) {
            const moved = player.move(dx, dy, this.game);
            if (moved) {
                if (this.game.updateFov) this.game.updateFov();
                if (this.game.engine.update) this.game.engine.update();
                if (this.game.updateUI) this.game.updateUI();
            }
        }
    }
}
