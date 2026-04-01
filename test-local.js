#!/usr/bin/env node

// Local Testing Script
// Run this to test the CLI locally without publishing to npm
// Usage: node test-local.js

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, 'index.js');

console.log('Starting Unified Playwright CLI in test mode...\n');

const child = spawn('node', [cliPath], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  console.log(`\nCLI exited with code ${code}`);
});
