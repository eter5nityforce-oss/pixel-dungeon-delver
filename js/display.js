import { TileType } from './map/map.js';

export class Display {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.tileSize = 24;
    }

    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawMap(map) {
        this.clear();
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const key = `${x},${y}`;
                const isVisible = map.visible.has(key);
                const isExplored = map.explored.has(key);

                if (!isVisible && !isExplored) continue; // Don't draw

                const tile = map.getTile(x, y);
                let color = '#000';

                if (isVisible) {
                    // Normal colors
                    if (tile === TileType.WALL) color = '#888';
                    else if (tile === TileType.FLOOR) color = '#444';
                    else if (tile === TileType.DOOR) color = '#852';
                    else if (tile === TileType.STAIRS_DOWN) color = '#aaf';
                } else {
                    // Explored colors (fog)
                    if (tile === TileType.WALL) color = '#444';
                    else if (tile === TileType.FLOOR) color = '#222';
                    else if (tile === TileType.DOOR) color = '#421';
                    else if (tile === TileType.STAIRS_DOWN) color = '#558';
                }

                this.ctx.fillStyle = color;
                this.ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }
}
