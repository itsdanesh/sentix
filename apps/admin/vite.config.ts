import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.join(process.cwd(), "src"),
		},
	},
	build: {
		// TODO in the future, change this to django's public directory
		outDir: "./dist",
	},
	server: {
		port: 3000,
	},
});
