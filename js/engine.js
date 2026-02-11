export class Engine {
    constructor(game) {
        this.game = game;
        this.running = false;
    }

    start() {
        this.running = true;
        this.loop();
    }

    loop() {
        if (!this.running) return;

        // Input is handled by InputHandler triggering update()

        this.game.render();
        requestAnimationFrame(() => this.loop());
    }

    update() {
        // Entities act
        for (const entity of this.game.entities) {
            if (entity !== this.game.player && entity.act) {
                entity.act(this.game);
            }
        }
        // Player actions processed in InputHandler
    }
}
