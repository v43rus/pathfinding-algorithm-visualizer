# Pathfinding Algorithm Visualizer

[Live Preview](https://v43rus.github.io/pathfinding-algorithm-visualizer/)

This project is an interactive visualizer for pathfinding algorithms, built with React. It allows users to generate random mazes and visualize how different algorithms, such as Breadth-First Search (BFS) and Depth-First Search (DFS), find the shortest path from a start to an end point.

## Features

- **Maze Generation:** Generates a random maze using recursive backtracking.
- **Pathfinding Algorithms:** Visualize BFS and DFS in real-time.
- **Interactive Controls:** Refresh the maze and run algorithms with a click.
- **Animated Visualization:** Watch the algorithms explore the maze and highlight the found path.
- **Responsive Design:** Works well on desktop and mobile browsers.

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/v43rus/pathfinding-algorithm-visualizer.git
   cd pathfinding-algorithm-visualizer
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build for Production

To build the app for production:
```sh
npm run build
```
The build output will be in the `build/` directory.

## Usage

- Click **Refresh Maze** to generate a new random maze.
- Click **Breadth-First Search** or **Depth-First Search** to visualize the algorithm.
- The green cell is the start, and the red cell is the end.
- Blue cells are visited during the search; light green highlights the found path.

## Deployment

This project is automatically deployed to GitHub Pages on every push to the `master` branch.  
You can view the live site here: [https://v43rus.github.io/pathfinding-algorithm-visualizer/](https://v43rus.github.io/pathfinding-algorithm-visualizer/)

## License

This project is licensed under the MIT License.

---

Made with ❤️ using [Create React App](https://github.com/facebook/create-react-app).