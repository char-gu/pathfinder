export function dijkstra(grid, startNode, finishNode) { 
    const visitedOrdered = [];

    if (!startNode || !finishNode || startNode === finishNode) {
        return false;
    }

    startNode.distance = 0;
    const unvisitedNodes = getNodes(grid);

    while (unvisitedNodes.length !== 0) {
        sortNodesByDistance(unvisitedNodes);
        const nearestNode = unvisitedNodes.shift();
        
        if (nearestNode.isBlocked) continue;
        if (nearestNode.distance === Infinity) return visitedOrdered;

        nearestNode.isVisited = true;
        visitedOrdered.push(nearestNode);

        if (nearestNode === finishNode) return visitedOrdered;
        updateNeighbors(nearestNode, grid);
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateNeighbors(node, grid) {
    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.prev = node;
    }
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row-1][col]);
    if (row < grid.length-1) neighbors.push(grid[row+1][col]);
    if (col > 0) neighbors.push(grid[row][col-1]);
    if (col < grid[0].length-1) neighbors.push(grid[row][col+1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

export function getShortestPath(finishNode) {
    const shortestPath = [];
    let curr = finishNode;
    while (curr !== null) {
        shortestPath.unshift(curr);
        curr = curr.prev;
    }
    return shortestPath;
}
