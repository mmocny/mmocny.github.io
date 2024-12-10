#!/usr/bin/env node

/**
 * This server will add 500ms of delay between each newline for the /delayed route.
 * You can observe this via: `curl -N localhost:3000/delayed`
 * If you navigate to localhost:3000 and navigate to /delayed by clicking the link
 * you will notice paint holding in action.  Try interacting...
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/delayed', async (req, res) => {
  const filePath = path.join(__dirname, 'public/delayed.html');

  try {
    // Read the file synchronously
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    // Send headers immediately
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // res.write("<!doctype html>\n");
    // await delay(5000);

    // Loop through lines with delays
    for (let line of lines) {
      res.write(line + '\n');
      await delay(500);
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading file');
  }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});