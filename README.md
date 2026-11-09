# City Capital

City Capital is an early browser-based 3D property trading and city-building game prototype. It uses Babylon.js for 3D rendering, Vite for development and builds, TypeScript for application code, and HTML/CSS for the interface. The target browser is Google Chrome.

## Requirements

Install a current Node.js LTS release (Node.js 22.12+ or 24+ is recommended) and npm, which is included with Node.js. Check your installation with `node --version` and `npm --version`.

## Install and run locally

Open a terminal in this repository and run:

```bash
npm install
npm run dev
```

Open the local address printed in the terminal in Chrome. Drag on the scene to orbit the camera and scroll to zoom. Press `Ctrl+C` in the terminal to stop the server.

## Production build

```bash
npm run build
npm run preview
```

The build command checks the TypeScript code and creates the production-ready site in `dist/`. The preview command serves that build locally; open the address printed in the terminal in Chrome. `dist/` and installed packages are generated locally and are not committed to Git.

## Development status

This is the project foundation only: a basic scene with a temporary box, camera, lighting, shadows, and a small interface. There are no gameplay mechanics or external art assets yet. The Babylon.js glTF loader is registered for future glTF 2.0/GLB assets.
