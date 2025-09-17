import { sveltekit } from '@sveltejs/kit/vite';
import { configDotenv } from 'dotenv';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";
import fs from 'fs';
import { webSocketServer } from './websocketVitePlugin.js';

configDotenv();

/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), webSocketServer],
	server: {
		https: {
			key: fs.readFileSync(process.env.KEY_PATH),
			cert: fs.readFileSync(process.env.CERT_PATH)
		},

		host: "0.0.0.0",
		port: process.env.PORT,
		strictPort: true,
		hmr: {
			host: "localhost",
			protocol: "wss",
			port: process.env.WS_DEV_PORT,
			clientPort: process.env.WS_DEV_PORT,
		},
	},
	preview: {
		https: {
			key: fs.readFileSync(process.env.KEY_PATH),
			cert: fs.readFileSync(process.env.CERT_PATH)
		},
		port: process.env.PORT
	}
});
