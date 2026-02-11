import { Map, TileType } from './map.js';

class Leaf {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.leftChild = null;
        this.rightChild = null;
        this.room = null;
    }

    split(minSize) {
        if (this.leftChild || this.rightChild) return false;

        // Determine split direction
        // If width is 25% larger than height, split vertically
        // If height is 25% larger than width, split horizontally
        // Otherwise random
        let splitH = Math.random() > 0.5;
        if (this.width > this.height && this.width / this.height >= 1.25) splitH = false;
        else if (this.height > this.width && this.height / this.width >= 1.25) splitH = true;

        const max = (splitH ? this.height : this.width) - minSize;
        if (max <= minSize) return false; // Too small to split

        // Generate split position
        const split = Math.floor(Math.random() * (max - minSize)) + minSize;

        if (splitH) {
            this.leftChild = new Leaf(this.x, this.y, this.width, split);
            this.rightChild = new Leaf(this.x, this.y + split, this.width, this.height - split);
        } else {
            this.leftChild = new Leaf(this.x, this.y, split, this.height);
            this.rightChild = new Leaf(this.x + split, this.y, this.width - split, this.height);
        }
        return true;
    }

    getRoom() {
        if (this.room) return this.room;
        if (this.leftChild && this.rightChild) {
            return Math.random() < 0.5 ? this.leftChild.getRoom() : this.rightChild.getRoom();
        }
        if (this.leftChild) return this.leftChild.getRoom();
        if (this.rightChild) return this.rightChild.getRoom();
        return null;
    }
}

export class BSPGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.map = new Map(width, height);
        this.minLeafSize = 12; // Minimum size of a leaf (container for a room)
    }

    generate() {
        const root = new Leaf(0, 0, this.width, this.height);
        this.splitRecursively(root);
        this.createRoomsAndCorridors(root);
        return this.map;
    }

    splitRecursively(leaf) {
        // Try to split if the leaf is large enough
        if (leaf.width > this.minLeafSize || leaf.height > this.minLeafSize) {
             // We can split if the resulting leaves will be at least minLeafSize
             // Leaf.split handles the check if max > minSize
             if (leaf.split(this.minLeafSize)) {
                 this.splitRecursively(leaf.leftChild);
                 this.splitRecursively(leaf.rightChild);
             }
        }
    }

    createRoomsAndCorridors(leaf) {
        if (leaf.leftChild || leaf.rightChild) {
            if (leaf.leftChild) {
                this.createRoomsAndCorridors(leaf.leftChild);
            }
            if (leaf.rightChild) {
                this.createRoomsAndCorridors(leaf.rightChild);
            }
            if (leaf.leftChild && leaf.rightChild) {
                const room1 = leaf.leftChild.getRoom();
                const room2 = leaf.rightChild.getRoom();
                if (room1 && room2) {
                    this.createCorridor(room1, room2);
                }
            }
        } else {
            // Create Room
            // Room size should be at least 6x6, and fit within the leaf with some padding
            const minRoomSize = 6;
            // Ensure we have enough space
            if (leaf.width >= minRoomSize + 2 && leaf.height >= minRoomSize + 2) {
                const roomW = Math.floor(Math.random() * (leaf.width - minRoomSize - 2)) + minRoomSize;
                const roomH = Math.floor(Math.random() * (leaf.height - minRoomSize - 2)) + minRoomSize;

                // Center roughly in leaf, or random position
                const roomX = Math.floor(Math.random() * (leaf.width - roomW - 1)) + leaf.x + 1;
                const roomY = Math.floor(Math.random() * (leaf.height - roomH - 1)) + leaf.y + 1;

                leaf.room = { x: roomX, y: roomY, w: roomW, h: roomH };
                this.createRoom(leaf.room);
            } else {
                // Leaf too small for room, just fill with wall (default) or make a tiny room?
                // Ideally this shouldn't happen if minLeafSize is large enough relative to minRoomSize
            }
        }
    }

    createRoom(room) {
        for (let y = room.y; y < room.y + room.h; y++) {
            for (let x = room.x; x < room.x + room.w; x++) {
                this.map.setTile(x, y, TileType.FLOOR);
            }
        }
        this.map.rooms.push(room);
    }

    createCorridor(room1, room2) {
        const x1 = Math.floor(room1.x + room1.w / 2);
        const y1 = Math.floor(room1.y + room1.h / 2);
        const x2 = Math.floor(room2.x + room2.w / 2);
        const y2 = Math.floor(room2.y + room2.h / 2);

        if (Math.random() > 0.5) {
            this.hCorridor(x1, x2, y1);
            this.vCorridor(y1, y2, x2);
        } else {
            this.vCorridor(y1, y2, x1);
            this.hCorridor(x1, x2, y2);
        }
    }

    hCorridor(x1, x2, y) {
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);
        for (let x = start; x <= end; x++) {
            this.map.setTile(x, y, TileType.FLOOR);
        }
    }

    vCorridor(y1, y2, x) {
        const start = Math.min(y1, y2);
        const end = Math.max(y1, y2);
        for (let y = start; y <= end; y++) {
            this.map.setTile(x, y, TileType.FLOOR);
        }
    }
}
