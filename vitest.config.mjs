/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    base: './',
    plugins: [react(), viteTsconfigPaths()],
    test: {
        globals: true,
        environment: 'jsdom',
        exclude: ['**/node_modules/**', '**/e2e/**'],
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
});
