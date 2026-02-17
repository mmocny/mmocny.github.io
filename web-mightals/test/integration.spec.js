import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundlePath = path.resolve(__dirname, '../dist/web-mightals.iife.js');
const bundleScript = fs.readFileSync(bundlePath, 'utf8');

test.describe('WebMightals Integration', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`PAGE LOG: ${msg.text()}`));
    page.on('pageerror', err => console.log(`PAGE ERROR: ${err.message}`));
    // Navigate to a blank page or a simple test server
    await page.goto('about:blank');
    
    // Inject the bundle
    await page.addScriptTag({ content: bundleScript });
  });

  test('should capture initial hard navigation', async ({ page }) => {
    const navData = await page.evaluate(() => new Promise(resolve => {
      // performance$ is a global after IIFE injection
      performance$.subscribe(record => {
        if (record.type === 'hard-navigation') {
          resolve({
            url: record.data.url,
            type: record.data.type
          });
        }
      });
    }));

    expect(navData.url).toBe('about:blank');
    expect(navData.type).toBe('Hard');
  });

  test('should capture interaction updates', async ({ page }) => {
    // Set up a listener for interaction updates
    const interactionPromise = page.evaluate(() => new Promise(resolve => {
      performance$.subscribe(record => {
        if (record.type === 'update' && record.data.entries.some(e => e.entryType === 'event')) {
          resolve(true);
        }
      });
    }));

    // Trigger a click interaction
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.textContent = 'Click Me';
      btn.onclick = () => { /* noop */ };
      document.body.appendChild(btn);
      // Wait a bit to ensure the observer is ready
      setTimeout(() => btn.click(), 100);
    });

    const success = await interactionPromise;
    expect(success).toBe(true);
  });
});
