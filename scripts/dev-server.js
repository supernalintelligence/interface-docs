#!/usr/bin/env node
/**
 * Start the dev server on an available port
 * Writes the port to a file that can be used by tests
 * Optionally builds dependencies first
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const findAvailablePort = require('./find-port');
const testConfig = require('../test.config');

const PORT_FILE = path.join(__dirname, '..', '.dev-port');
const SKIP_BUILD = process.argv.includes('--skip-build');
const FORCE_BUILD = process.argv.includes('--force-build');

function buildDependencies() {
  const dependencies = [
    {
      name: '@supernal/interface-nextjs',
      path: path.join(__dirname, '../../open-source/interface-nextjs'),
      distPath: path.join(__dirname, '../../open-source/interface-nextjs/dist')
    },
    {
      name: '@supernalintelligence/interface-enterprise',
      path: path.join(__dirname, '../../enterprise'),
      distPath: path.join(__dirname, '../../enterprise/dist')
    }
  ];

  let needsBuild = false;

  // Check which packages need building
  for (const dep of dependencies) {
    if (!fs.existsSync(dep.distPath)) {
      needsBuild = true;
      break;
    }
  }

  if (!needsBuild && !FORCE_BUILD) {
    console.log('✅ Dependencies already built (use --force-build to rebuild)\n');
    return;
  }

  // Build each dependency
  for (const dep of dependencies) {
    const shouldBuild = !fs.existsSync(dep.distPath) || FORCE_BUILD;

    if (shouldBuild) {
      console.log(`Building ${dep.name}...`);
      try {
        execSync('npm run build', {
          cwd: dep.path,
          stdio: 'inherit',
          env: {
            ...process.env,
            NODE_OPTIONS: '--max-old-space-size=4096'
          }
        });
        console.log(`✅ ${dep.name} build complete\n`);
      } catch (error) {
        console.error(`❌ ${dep.name} build failed:`, error.message);
        process.exit(1);
      }
    }
  }
}

async function startDevServer() {
  try {
    // Build dependencies if needed
    if (!SKIP_BUILD) {
      buildDependencies();
    }

    // Find an available port starting from the default
    const port = await findAvailablePort(testConfig.DEFAULT_PORT);

    // Write the port to a file for tests to read
    fs.writeFileSync(PORT_FILE, port.toString(), 'utf8');
    console.log(`Starting dev server on port ${port}...`);

    // Start Next.js dev server with increased memory
    const devProcess = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=4096'
      }
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

