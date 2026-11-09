import { defineConfig } from 'vite';

export default defineConfig({
  base: '/city-capital-game/',
  server: { host: '0.0.0.0', allowedHosts: true },
  preview: { host: '0.0.0.0', allowedHosts: true },
});
