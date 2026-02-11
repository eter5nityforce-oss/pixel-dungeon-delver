# Pixel Dungeon Explorer (픽셀 던전 탐험가)

A complex, turn-based roguelike dungeon crawler built with JavaScript and HTML5 Canvas.

## Features

-   **Procedural Dungeon Generation**: Unique levels every time using BSP trees.
-   **Turn-Based Combat**: Strategic combat with enemies that chase you.
-   **Field of View**: Fog of War and Line of Sight mechanics.
-   **RPG Elements**: Level up, gain stats, and manage inventory.
-   **Items**: Weapons, shields, and potions.
-   **Win Condition**: Retrieve the Amulet of Yendor on Level 5.

## Controls

-   **Movement**: Arrow Keys or WASD
-   **Pick Up**: 'G' or ','
-   **Descend Stairs**: '>' or '.'
-   **Inventory**: 'I' (Click item to use/equip)

## Demo

To run the project locally:

1.  Clone the repository.
2.  Open `index.html` in a modern web browser.
    -   Since the project uses ES6 Modules, you need to run a local server to avoid CORS errors with file:// protocol.
    -   You can use Python: `python3 -m http.server`
    -   Then navigate to `http://localhost:8000`.

## Architecture

-   **Engine**: `js/engine.js` - Main game loop.
-   **Game**: `js/game.js` - Game state manager.
-   **Map**: `js/map/bsp_generator.js` - Dungeon generation.
-   **Rendering**: `js/display.js` - Canvas rendering.
-   **Entities**: `js/entities/` - Player, Enemy, Items.
-   **Systems**: `js/fov.js`, `js/pathfinding.js`, `js/input.js`.
