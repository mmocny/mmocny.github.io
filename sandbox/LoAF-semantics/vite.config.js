import { defineConfig } from 'vite';

export default defineConfig({
	build: {
	  emptyOutDir: false,
	  outDir: "dist",
	  sourcemap: true,
	  lib: {
		fileName: "[name]",
		formats: ["cjs", "es"],
	  },
	  rollupOptions: {
		input: {
		  "wrapper": "./wrapper.js",
		  "index": "./index.js",
		},
	  },
	},
  });
  