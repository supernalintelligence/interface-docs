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

  // Transpile packages that import CSS from node_modules (Next.js 15 requirement)
  transpilePackages: [
    'katex',
    'react-markdown',
    'remark-gfm',
    'remark-math',
    '@copilotkit/react-core',
    '@copilotkit/react-ui',
    '@copilotkit/react-textarea',
    '@copilotkitnext/react',
  ],

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
      };
      
      // Exclude Playwright from client bundle (it's in markdown code examples)
      config.externals = config.externals || [];
      config.externals.push({
        '@playwright/test': 'commonjs @playwright/test',
        'playwright-core': 'commonjs playwright-core',
        // Don't bundle CopilotKit if not installed (optional dependency)
        '@copilotkit/react-core': 'commonjs @copilotkit/react-core',
        '@copilotkit/react-ui': 'commonjs @copilotkit/react-ui',
      });
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
