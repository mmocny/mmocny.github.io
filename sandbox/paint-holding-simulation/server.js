#!/usr/bin/env node

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

    // Loop through lines with delays
    for (let line of lines) {
      res.write(line);
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