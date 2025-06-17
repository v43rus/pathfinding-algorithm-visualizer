import React from "react";
import "./App.css";

// Directions for moving in the maze: right, down, left, up
const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function MazeGrid() {
  // Ref to track if an algorithm is running
  const running = React.useRef(false);
  // State for UI and maze matrix
  const [isRunning, setIsRunning] = React.useState(false);
  const [maze, setMaze] = React.useState([]);
  // Ref to always have latest maze state in async functions
  const mazeRef = React.useRef(maze);

  React.useEffect(() => {
    mazeRef.current = maze;
  }, [maze]);

  // Utility: pause execution for animation
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Mark a cell as visited during search (except start/end)
  const markVisited = React.useCallback((x, y) => {
    setMaze((prevMaze) =>
      prevMaze.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
          if (rowIndex === x && cellIndex === y) {
            if (cell !== "start" && cell !== "end") {
              return "visited";
            }
          }
          return cell;
        })
      )
    );
  }, []);

  // Highlight the final path found by the algorithm
  const highlightPath = React.useCallback((path) => {
    setMaze((prevMaze) =>
      prevMaze.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
          if (
            path.some(([x, y]) => x === rowIndex && y === cellIndex) &&
            cell !== "start" &&
            cell !== "end"
          ) {
            return "path-found";
          }
          return cell;
        })
      )
    );
  }, []);

  // Breadth-First Search for shortest path
  async function bfs(startNode) {
    if (running.current) return;
    clearMaze();
    running.current = true;
    setIsRunning(true);
    let queue = [startNode];
    let visited = new Set();
    let parent = {};
    visited.add(`${startNode[0]}-${startNode[1]}`);

    async function visitCell([x, y]) {
      if (maze[x][y] === "end") {
        running.current = false;
        return true;
      }
      markVisited(x, y);
      await delay(100);
      return false;
    }

    let found = false;
    let endNode = null;
    while (queue.length > 0 && running.current) {
      const [x, y] = queue.shift();
      if (await visitCell([x, y])) {
        found = true;
        endNode = [x, y];
        break;
      }
      for (const [dx, dy] of DIRECTIONS) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          ny >= 0 &&
          nx < mazeRef.current.length &&
          ny < mazeRef.current[0].length &&
          mazeRef.current[nx][ny] !== "wall" &&
          !visited.has(`${nx}-${ny}`)
        ) {
          visited.add(`${nx}-${ny}`);
          parent[`${nx}-${ny}`] = [x, y];
          queue.push([nx, ny]);
        }
      }
    }

    // Reconstruct and highlight the path if found
    if (found && endNode) {
      let path = [];
      let curr = endNode;
      while (curr && maze[curr[0]][curr[1]] !== "start") {
        path.push(curr);
        curr = parent[`${curr[0]}-${curr[1]}`];
      }
      path.reverse();
      await highlightPath(path);
    }

    running.current = false;
    setIsRunning(false);
    return false;
  }

  // Depth-First Search for pathfinding
  async function dfs(startNode) {
    if (running.current) return;
    clearMaze();
    running.current = true;
    setIsRunning(true);
    let stack = [startNode];
    let visited = new Set();
    let parent = {};
    visited.add(`${startNode[0]}-${startNode[1]}`);

    async function visitCell([x, y]) {
      if (maze[x][y] === "end") {
        running.current = false;
        return true;
      }
      markVisited(x, y);
      await delay(100);
      return false;
    }

    let found = false;
    let endNode = null;

    async function step() {
      if (stack.length === 0 || !running.current) {
        running.current = false;
        setIsRunning(false);
        return false;
      }
      const [x, y] = stack.pop();
      if (await visitCell([x, y])) {
        found = true;
        endNode = [x, y];
        return true;
      }
      for (const [dx, dy] of DIRECTIONS) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          ny >= 0 &&
          nx < mazeRef.current.length &&
          ny < mazeRef.current[0].length &&
          mazeRef.current[nx][ny] !== "wall" &&
          !visited.has(`${nx}-${ny}`)
        ) {
          visited.add(`${nx}-${ny}`);
          parent[`${nx}-${ny}`] = [x, y];
          stack.push([nx, ny]);
        }
      }
      await step();
    }
    await step();

    // Reconstruct and highlight the path if found
    if (found && endNode) {
      let path = [];
      let curr = endNode;
      while (curr && maze[curr[0]][curr[1]] !== "start") {
        path.push(curr);
        curr = parent[`${curr[0]}-${curr[1]}`];
      }
      path.reverse();
      await highlightPath(path);
    }
    running.current = false;
    setIsRunning(false);
  }

  // Reset all visited/path-found cells to path
  function clearMaze() {
    running.current = false;
    setIsRunning(false);
    setMaze((prevMaze) =>
      prevMaze.map((row) =>
        row.map((cell) => {
          if (cell === "visited" || cell === "path-found") {
            return "path";
          }
          return cell;
        })
      )
    );
  }

  // Generate a new random maze using recursive backtracking
  function generateMaze(height, width) {
    let matrix = [];
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push("wall");
      }
      matrix.push(row);
    }

    function isCellValid(x, y) {
      return (
        x >= 0 && y >= 0 && x < height && y < width && matrix[x][y] === "wall"
      );
    }

    // Carve out a path recursively
    function carvePath(x, y) {
      matrix[x][y] = "path";
      const directions = [...DIRECTIONS].sort(() => Math.random() - 0.5);
      for (let [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        if (isCellValid(nx, ny)) {
          matrix[x + dx][y + dy] = "path";
          carvePath(nx, ny);
        }
      }
    }
    carvePath(1, 1);

    // Set start and end points
    matrix[1][0] = "start";
    matrix[height - 2][width - 1] = "end";

    setMaze(matrix);
  }

  function refreshMaze() {
    running.current = false;
    setIsRunning(false);
    generateMaze(16, 16);
  }

  // Generate maze on first render
  React.useEffect(() => {
    generateMaze(16, 16);
  }, []);

  return (
    <div className={"maze-grid"}>
      <div className={"controls"}>
        <button className={"maze-button"} onClick={refreshMaze}>
          Refresh Maze
        </button>
        <button
          className={"maze-button"}
          onClick={() => bfs([1, 0])}
          disabled={isRunning}
        >
          Breadth-First Search
        </button>
        <button
          className={"maze-button"}
          onClick={() => dfs([1, 0])}
          disabled={isRunning}
        >
          Depth-First Search
        </button>
      </div>
      <div className={"maze"}>
        {maze.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div
                className={`cell ${cell}`}
                key={`${rowIndex}-${cellIndex}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MazeGrid;
