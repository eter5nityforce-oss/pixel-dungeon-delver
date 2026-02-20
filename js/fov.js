import { TileType } from './map/map.js';

export class FOV {
    constructor(map) {
        this.map = map;
    }

    update(cx, cy, radius) {
        this.map.visible.clear();

        // Always visible at center
        this.map.visible.add(`${cx},${cy}`);
        this.map.explored.add(`${cx},${cy}`);

        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                if (x * x + y * y <= radius * radius) {
                    const tx = cx + x;
                    const ty = cy + y;

                    // Check bounds
                    if (tx >= 0 && tx < this.map.width && ty >= 0 && ty < this.map.height) {
                         if (this.hasLineOfSight(cx, cy, tx, ty)) {
                            this.map.visible.add(`${tx},${ty}`);
                            this.map.explored.add(`${tx},${ty}`);
                        }
                    }
                }
            }
        }
    }

    hasLineOfSight(x0, y0, x1, y1) {
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            if (x0 === x1 && y0 === y1) return true;

            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }

            if (x0 === x1 && y0 === y1) return true; // Reached target

            if (this.isOpaque(x0, y0)) return false; // Blocked by wall
        }
    }

    isOpaque(x, y) {
        // Bounds check not needed here if we check before calling but safe to have
        if (x < 0 || x >= this.map.width || y < 0 || y >= this.map.height) return true;
        return this.map.getTile(x, y) === TileType.WALL;
    }
}
