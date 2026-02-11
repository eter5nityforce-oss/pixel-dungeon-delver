import { Display } from './display.js';
import { Engine } from './engine.js';
import { BSPGenerator } from './map/bsp_generator.js';
import { Player } from './entities/player.js';
import { InputHandler } from './input.js';
import { FOV } from './fov.js';
import { Enemy } from './entities/enemy.js';
import { HealthPotion } from './entities/potion.js';
import { Equipment } from './entities/equipment.js';
import { TileType } from './map/map.js';
import { Item } from './entities/item.js';

export class Game {
    constructor() {
        this.display = null;
        this.engine = null;
        this.map = null;
        this.entities = [];
        this.player = null;
        this.dungeonLevel = 1;
    }

    init() {
        console.log("Initializing Pixel Dungeon Explorer...");
        const canvas = document.getElementById('game-canvas');
        this.display = new Display(canvas);
        this.engine = new Engine(this);

        this.generateLevel();

        // Initialize Input
        this.inputHandler = new InputHandler(this);

        this.engine.start();
    }

    generateLevel() {
        // Generate Map
        const mapWidth = Math.floor(this.display.width / this.display.tileSize);
        const mapHeight = Math.floor(this.display.height / this.display.tileSize);

        const generator = new BSPGenerator(mapWidth, mapHeight);
        this.map = generator.generate();

        // Clear entities except player
        if (this.player) {
            this.entities = [this.player];
            // Place player
            if (this.map.rooms.length > 0) {
                const startRoom = this.map.rooms[0];
                this.player.x = Math.floor(startRoom.x + startRoom.w / 2);
                this.player.y = Math.floor(startRoom.y + startRoom.h / 2);
            }
        } else {
             // Create Player first time
            if (this.map.rooms.length > 0) {
                const startRoom = this.map.rooms[0];
                const startX = Math.floor(startRoom.x + startRoom.w / 2);
                const startY = Math.floor(startRoom.y + startRoom.h / 2);
                this.player = new Player(startX, startY);
                this.entities.push(this.player);
            }
        }

        // Spawn Enemies
        for (let i = 1; i < this.map.rooms.length; i++) {
            const room = this.map.rooms[i];
            const x = Math.floor(room.x + room.w / 2);
            const y = Math.floor(room.y + room.h / 2);

            const enemy = new Enemy(x, y);
            enemy.level = this.dungeonLevel;
            enemy.maxHp += (this.dungeonLevel - 1) * 5;
            enemy.hp = enemy.maxHp;
            enemy.attackValue += (this.dungeonLevel - 1);
            this.entities.push(enemy);
        }

        // Spawn Items
        this.spawnItems();

        // Stairs or Amulet
        if (this.map.rooms.length > 0) {
            const lastRoom = this.map.rooms[this.map.rooms.length - 1];
            const sx = Math.floor(lastRoom.x + lastRoom.w / 2);
            const sy = Math.floor(lastRoom.y + lastRoom.h / 2);

            if (this.dungeonLevel >= 5) {
                 const amulet = new Item(sx, sy, '*', '#ff0', "Amulet of Yendor");
                 this.entities.push(amulet);
            } else {
                 this.map.setTile(sx, sy, TileType.STAIRS_DOWN);
            }
        }

        // Initialize FOV
        this.fov = new FOV(this.map);
        this.updateFov();

        // UI
        this.updateUI();
        this.log(`You are on Level ${this.dungeonLevel}.`);
    }

    nextLevel() {
        this.dungeonLevel++;
        this.generateLevel();
    }

    spawnItems() {
         for (let i = 1; i < this.map.rooms.length; i++) {
            const room = this.map.rooms[i];
            if (Math.random() < 0.6) { // 60% chance
                const x = Math.floor(Math.random() * (room.w - 2)) + room.x + 1;
                const y = Math.floor(Math.random() * (room.h - 2)) + room.y + 1;

                let item;
                const r = Math.random();
                if (r < 0.6) {
                    item = new HealthPotion(x, y);
                } else if (r < 0.8) {
                    item = new Equipment(x, y, '/', '#aaa', "Sword", "weapon", 2);
                } else {
                    item = new Equipment(x, y, '[', '#66a', "Shield", "armor", 1);
                }
                this.entities.push(item);
            }
        }
    }

    updateFov() {
        if (this.player) {
            this.fov.update(this.player.x, this.player.y, 8);
        }
    }

    log(message) {
        const logElement = document.getElementById('message-log');
        if (logElement) {
            const entry = document.createElement('div');
            entry.textContent = message;
            logElement.appendChild(entry);
            logElement.scrollTop = logElement.scrollHeight;
        }
    }

    updateUI() {
        if (!this.player) return;
        const hpElem = document.getElementById('hp-value');
        const levelElem = document.getElementById('level-value');
        const xpElem = document.getElementById('xp-value');

        if (hpElem) hpElem.textContent = `${this.player.hp}/${this.player.maxHp}`;
        if (levelElem) levelElem.textContent = this.player.level;
        if (xpElem) xpElem.textContent = this.player.xp;
    }

    toggleInventory() {
        const invPanel = document.getElementById('inventory-panel');
        if (invPanel) {
            invPanel.classList.toggle('hidden');
            if (!invPanel.classList.contains('hidden')) {
                this.updateInventoryUI();
            }
        }
    }

    updateInventoryUI() {
        const list = document.getElementById('inventory-list');
        if (!list) return;
        list.innerHTML = '';

        this.player.inventory.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name}`;
            if (item.type === 'equipment') {
                 li.textContent += ` (Slot: ${item.slot}, Bonus: +${item.bonus})`;
            }
            li.onclick = () => {
                this.player.useItem(index, this);
                this.updateInventoryUI();
            };
            list.appendChild(li);
        });
    }

    gameOver() {
        this.log("GAME OVER!");
        this.engine.running = false;
        alert("Game Over!");
    }

    winGame() {
        this.log("CONGRATULATIONS! You found the Amulet of Yendor and won the game!");
        this.engine.running = false;
        alert("You Win!");
    }

    render() {
        this.display.drawMap(this.map);

        const items = this.entities.filter(e => e.type === 'item' || e.type === 'equipment');
        const actors = this.entities.filter(e => e.type !== 'item' && e.type !== 'equipment');

        for (const entity of items) {
            entity.draw(this.display, this.map);
        }
        for (const entity of actors) {
            entity.draw(this.display, this.map);
        }
    }
}
