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
	server: {
		port: 5173,
		hmr: {
			port: 5173,
		},
		proxy: {
			'/api': {
				target: 'http://localhost:9085',
				changeOrigin: true,
				secure: false,
				timeout: 30000,
				configure: (proxy, options) => {
					proxy.on('error', (err, req, res) => {
						console.log('Proxy error:', err);
					});
					proxy.on('proxyReq', (proxyReq, req, res) => {
						console.log('Sending Request to the Target:', req.method, req.url);
					});
					proxy.on('proxyRes', (proxyRes, req, res) => {
						console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
					});
				}
			}
		}
	},
	resolve: {
		alias: {
			'@server': path.resolve(__dirname, 'server/src'),
			'@client': path.resolve(__dirname, 'src/client'),
			'@components': path.resolve(__dirname, 'src/Components'),
			'@context': path.resolve(__dirname, 'src/context'),
		},
	},
});
