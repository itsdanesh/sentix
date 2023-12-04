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
		outDir: path.join(process.cwd(), "..", "web", "static"),
	},
	server: {
		port: 3000,
	},
});
