import React, {Component} from 'react';
import Node from './Node/Node'
import './PathfindingVisualizer.css';
import {dijkstra, getShortestPath} from '../Algos/dijkstra';

const START_X = 11;
const START_Y = 10;
const FINISH_X = 11;
const FINISH_Y = 40;

export default class PathfindingVisualizer extends Component {
  constructor() {
      super();
      this.state = {
          grid: [],
          mousePressed: false,
      };
  }

  componentDidMount() {
      const grid = createGrid();
      this.setState({grid});
  }

  handleMouseUp(row, col) {
    this.setState({mousePressed: false});
  }

  handleMouseDown(row, col) {
    const newGrid = getGridWithWalls(this.state.grid, row, col);
    this.setState({grid: newGrid, mousePressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mousePressed) return;

    const newGrid = getGridWithWalls(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  animateAlgo(visitedOrdered, shortestPath) {
    for (let i = 0; i <= visitedOrdered.length; i++) {
      if (i === visitedOrdered.length) {
        setTimeout(() => {
          this.animateFinalPath(shortestPath);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedOrdered[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node visited-node';
      }, 10 * i);
    }
  }

  animateFinalPath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const node = shortestPath[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node final-path';
      }, 50 * i);
    }
  }

  visualizeAlgo() {
    const {grid} = this.state;
    const startNode = grid[START_X][START_Y];
    const finishNode = grid[FINISH_X][FINISH_Y];
    const visitedOrdered = dijkstra(grid, startNode, finishNode);
    const shortestPath = getShortestPath(finishNode);
    this.animateAlgo(visitedOrdered, shortestPath);
  }

  resetBoard() {
    const grid = createGrid();
    this.setState(grid);
  }

  render() {
      const {grid, mousePressed} = this.state;

      return (
        <>
          <button onClick={() => this.visualizeAlgo()}>
            Visualize
          </button>
          <button onClick={() => this.resetBoard()}>
            Reset
          </button>
          <div className="grid">
            {grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {row, col, startNode, finishNode, isBlocked} = node;
                    return (
                      <Node
                        key={nodeIdx}
                        row={row}
                        col={col}
                        startNode={startNode}
                        finishNode={finishNode}
                        isBlocked={isBlocked}
                        mousePressed={mousePressed}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                        onMouseUp={() => this.handleMouseUp()}></Node>
                    );
                  })}
              </div>
              );
            })}
          </div>
        </>
      );
  }
}

const createGrid = () => {
  const grid = [];

  for (let row = 0; row < 25; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    row,
    col,
    startNode: row === START_X && col === START_Y,
    finishNode: row === FINISH_X && col === FINISH_Y,
    distance: Infinity,
    isVisited: false,
    isBlocked: false,
    prev: null,
  };
};

const getGridWithWalls = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isBlocked: !node.isBlocked,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};