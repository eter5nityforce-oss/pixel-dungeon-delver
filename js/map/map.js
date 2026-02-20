export const TileType = {
    WALL: 0,
    FLOOR: 1,
    DOOR: 2,
    STAIRS_DOWN: 3
};

export class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.rooms = [];
        this.entities = [];
        this.explored = new Set(); // Stores indices of explored tiles
        this.visible = new Set();  // Stores indices of currently visible tiles

        this.initialize();
    }

    initialize() {
        // Initialize all tiles as walls
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = TileType.WALL;
            }
        }
    }

    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return TileType.WALL;
        }
        return this.tiles[y][x];
    }

    setTile(x, y, type) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.tiles[y][x] = type;
        }
    }

    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        return tile === TileType.FLOOR || tile === TileType.DOOR || tile === TileType.STAIRS_DOWN;
    }

    // Helper to get unique key for a coordinate
    static toKey(x, y) {
        return `${x},${y}`;
    }
}
