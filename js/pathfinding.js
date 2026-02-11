export class Pathfinding {
    constructor(map) {
        this.map = map;
    }

    findPath(startX, startY, endX, endY) {
        const openList = [];
        const closedList = new Set();
        const startNode = { x: startX, y: startY, g: 0, h: 0, f: 0, parent: null };
        openList.push(startNode);

        while (openList.length > 0) {
            // Get node with lowest f
            // Simple sort is O(N log N). For small path length it's fine.
            openList.sort((a, b) => a.f - b.f);
            const currentNode = openList.shift();

            if (currentNode.x === endX && currentNode.y === endY) {
                // Path found
                const path = [];
                let curr = currentNode;
                while (curr) {
                    path.push({ x: curr.x, y: curr.y });
                    curr = curr.parent;
                }
                return path.reverse();
            }

            closedList.add(`${currentNode.x},${currentNode.y}`);

            const neighbors = this.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (closedList.has(`${neighbor.x},${neighbor.y}`)) continue;

                const gScore = currentNode.g + 1; // Assuming cost 1
                const hScore = Math.abs(neighbor.x - endX) + Math.abs(neighbor.y - endY);
                const fScore = gScore + hScore;

                const existingNode = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);
                if (existingNode) {
                    if (gScore < existingNode.g) {
                        existingNode.g = gScore;
                        existingNode.f = fScore;
                        existingNode.parent = currentNode;
                    }
                } else {
                    neighbor.g = gScore;
                    neighbor.h = hScore;
                    neighbor.f = fScore;
                    neighbor.parent = currentNode;
                    openList.push(neighbor);
                }
            }
        }
        return []; // No path
    }

    getNeighbors(node) {
        const neighbors = [];
        const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
        for (const [dx, dy] of dirs) {
            const x = node.x + dx;
            const y = node.y + dy;
            if (this.map.isWalkable(x, y)) {
                neighbors.push({ x, y });
            }
        }
        return neighbors;
    }
}
