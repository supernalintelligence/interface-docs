/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  
  // Disable ESLint during build (fix config later)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Allow importing from parent core/src directory
  experimental: {
    externalDir: true,
  },

  // Optimize output for smaller serverless functions
  output: 'standalone',
  
  // Exclude unnecessary files from serverless functions
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
      '.next/cache',
    ],
  },
  
  webpack: (config, { isServer }) => {
    // Resolve React from demo's node_modules for symlinked packages
    const reactPath = path.dirname(require.resolve('react/package.json'));
    const reactDomPath = path.dirname(require.resolve('react-dom/package.json'));
    
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': reactPath,
      'react-dom': reactDomPath,
      'react/jsx-runtime': path.join(reactPath, 'jsx-runtime'),
      'react/jsx-dev-runtime': path.join(reactPath, 'jsx-dev-runtime'),
    };
    
    // Add fallbacks for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        'fs/promises': false,
        path: false,
        events: false,
        'node:events': false,
        stream: false,
        'node:stream': false,
        util: false,
        'node:util': false,
        'node:path': false,
        'node:fs': false,
        'node:fs/promises': false,
      };
      
      // Handle node: protocol imports - replace with regular module names
      const webpack = require('webpack');
      config.plugins = config.plugins || [];
      // Replace node: protocol imports with regular module names, then fallback will handle them
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            // Remove node: prefix so webpack can resolve it normally
            resource.request = resource.request.replace(/^node:/, '');
          }
        )
      );
      
      // Exclude Playwright, CopilotKit, and server-only modules from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        '@playwright/test': 'commonjs @playwright/test',
        'playwright-core': 'commonjs playwright-core',
        '@copilotkit/react-core': 'commonjs @copilotkit/react-core',
        '@copilotkit/react-ui': 'commonjs @copilotkit/react-ui',
        // Exclude Node.js-only modules that break in browser
        'glob': 'commonjs glob',
        'path-scurry': 'commonjs path-scurry',
      });
      
      // Completely ignore ComponentScanner in browser builds (it uses Node.js modules)
      // This prevents bundling fs, glob, path-scurry which break in browser
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /ComponentScanner/,
          contextRegExp: /@supernal\/interface/,
        })
      );
      
      // Also ignore the Node.js modules that ComponentScanner depends on
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(glob|path-scurry)$/,
        })
      );
    }
    
    // Ensure symlinked packages can resolve peer dependencies from demo
    config.resolve.symlinks = true;
    
    // Optimize bundle size
    if (isServer) {
      // Exclude test files and development dependencies from server bundle
      config.externals = config.externals || [];
      config.externals.push({
        '@playwright/test': 'commonjs @playwright/test',
        'jest': 'commonjs jest',
      });
    }
    
    return config;
  },
};

module.exports = nextConfig;

