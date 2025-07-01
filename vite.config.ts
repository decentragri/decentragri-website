import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import FullReload from 'vite-plugin-full-reload';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		FullReload([
			'public/assets/css/**/*.css',
			'src/**/*.{ts,tsx,js,jsx}',
			'src/**/*.css'
		])
	],
	resolve: {
		alias: {
			'@server': path.resolve(__dirname, 'server/src'),
			'@client': path.resolve(__dirname, 'src/client'),
			'@components': path.resolve(__dirname, 'src/Components'),
			'@context': path.resolve(__dirname, 'src/context'),
		},
	},
});
