#!/usr/bin/env node
/**
 * Get the current dev server port
 * Returns the port from .dev-port file or defaults to test config
 */

const fs = require('fs');
const path = require('path');
const testConfig = require('../test.config');

const PORT_FILE = path.join(__dirname, '..', '.dev-port');

function getDevPort() {
  if (fs.existsSync(PORT_FILE)) {
    const port = parseInt(fs.readFileSync(PORT_FILE, 'utf8'), 10);
    if (!isNaN(port)) {
      return port;
    }
  }
  return testConfig.DEFAULT_PORT;
}

if (require.main === module) {
  console.log(getDevPort());
}

module.exports = getDevPort;

