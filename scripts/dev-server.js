#!/usr/bin/env node
/**
 * Start the dev server on an available port
 * Writes the port to a file that can be used by tests
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const findAvailablePort = require('./find-port');
const testConfig = require('../test.config');

const PORT_FILE = path.join(__dirname, '..', '.dev-port');

async function startDevServer() {
  try {
    // Find an available port starting from the default
    const port = await findAvailablePort(testConfig.DEFAULT_PORT);
    
    // Write the port to a file for tests to read
    fs.writeFileSync(PORT_FILE, port.toString(), 'utf8');
    console.log(`Starting dev server on port ${port}...`);
    
    // Start Next.js dev server
    const devProcess = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    // Handle process exit
    devProcess.on('exit', (code) => {
      // Clean up port file
      if (fs.existsSync(PORT_FILE)) {
        fs.unlinkSync(PORT_FILE);
      }
      process.exit(code);
    });
    
    // Handle interrupts
    process.on('SIGINT', () => {
      devProcess.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      devProcess.kill('SIGTERM');
    });
    
  } catch (error) {
    console.error('Failed to start dev server:', error);
    process.exit(1);
  }
}

startDevServer();

