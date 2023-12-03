#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function wait(ms) {
	  return new Promise((resolve) => setTimeout(resolve, ms));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Use vite's connect instance as middleware. If you use your own
  // express router (express.Router()), you should use router.use
  app.use((req, res, next) => {
    // When the server restarts (for example after the user modifies
    // vite.config.js), `vite.middlewares` will be reassigned. Calling
    // `vite.middlewares` inside a wrapper handler ensures that the
    // latest Vite middlewares are always used.
    vite.middlewares.handle(req, res, next)
  })

  app.use('*', async (req, res, next) => {
	// Add some TTFB
	await wait(1000);

	console.log(req.originalUrl);

	const options = {
        root: path.join(__dirname)
    };

	const url = new URL(req.originalUrl, 'http://localhost'); // TODO: replace this with the real ip:port
	let fileName = url.pathname;
	if (fileName === '/') fileName = './index.html';
 
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
  })

  app.listen(5173)
}

createServer()