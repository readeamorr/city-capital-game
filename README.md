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

Open the local address printed in the terminal in Chrome, including the `/city-capital-game/` path. Drag on the scene to orbit the camera, scroll to zoom, and click a colored property plot to see its details. Press `Ctrl+C` in the terminal to stop the server.

## Production build

```bash
npm run build
npm run preview
```

The build command checks the TypeScript code and creates the production-ready site in `dist/`. The preview command serves that build locally; open the address printed in the terminal in Chrome. `dist/` and installed packages are generated locally and are not committed to Git.

## Development status

This prototype includes a temporary city board with 12 selectable property plots, a separate START tile, roads, sidewalks, camera, lighting, shadows, and a small interface. There are no gameplay mechanics or external art assets yet. The Babylon.js glTF loader is registered for future glTF 2.0/GLB assets.

## GitHub Pages

The site is configured for `https://readeamorr.github.io/city-capital-game/`. In the repository's **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. Once the deployment workflow is on `main`, pushes to `main` build and deploy the site automatically. Check the **Actions** tab for deployment progress. The workflow can also be started manually from that tab.

## Future GLB assets

Place GLB files in `public/assets/models/`; Vite copies the `public` folder into the build unchanged. Construct asset URLs using Vite's base path instead of a root-relative path, so they work locally and on GitHub Pages. For example, a file at `public/assets/models/building.glb` can be addressed in TypeScript as:

```ts
const buildingUrl = `${import.meta.env.BASE_URL}assets/models/building.glb`;
```

Pass that URL to Babylon.js's glTF loading API when asset loading is implemented. No model is included yet.
