#!/usr/bin/env node
/**
 * Build-time Auth Configuration Validation
 * 
 * This script validates that all required authentication environment variables
 * are set before allowing a production build to proceed.
 * 
 * SECURITY: A production build with missing auth config is a security vulnerability.
 * This script ensures we fail fast at build time, not at runtime.
 * 
 * Usage:
 *   node scripts/validate-auth-config.js
 * 
 * Exit codes:
 *   0 - All required variables are set (or not in production)
 *   1 - Missing required variables in production
 */

const REQUIRED_VARS = [
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET', 
  'AUTH_SECRET',
];

function validateAuthConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1';
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  
  console.log('\n🔐 Validating Authentication Configuration');
  console.log('─'.repeat(50));
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Vercel: ${isVercel ? 'yes' : 'no'}`);
  console.log(`Build Phase: ${isBuildPhase ? 'yes' : 'no'}`);
  console.log('');
  
  const missing = [];
  const present = [];
  
  for (const varName of REQUIRED_VARS) {
    const value = process.env[varName];
    if (value) {
      present.push(varName);
      // Show partial value for debugging (first 4 chars only)
      const preview = value.length > 8 ? `${value.slice(0, 4)}...` : '****';
      console.log(`  ✅ ${varName}: ${preview}`);
    } else {
      missing.push(varName);
      console.log(`  ❌ ${varName}: NOT SET`);
    }
  }
  
  console.log('');
  
  // In production, missing vars = build failure
  if (isProduction && missing.length > 0) {
    console.error('🚨 SECURITY ERROR: Missing required authentication variables!');
    console.error('');
    console.error('The following environment variables must be set for production:');
    for (const varName of missing) {
      console.error(`  - ${varName}`);
    }
    console.error('');
    console.error('Without these variables, authentication cannot work properly.');
    console.error('This is a FAIL-CLOSED security measure to prevent unauthorized access.');
    console.error('');
    console.error('To fix this:');
    console.error('  1. Create a GitHub OAuth App at https://github.com/settings/developers');
    console.error('  2. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your environment');
    console.error('  3. Generate AUTH_SECRET with: openssl rand -base64 32');
    console.error('');
    
    // Exit with error to fail the build
    process.exit(1);
  }
  
  // In development, just warn
  if (!isProduction && missing.length > 0) {
    console.warn('⚠️  WARNING: Auth not fully configured (development mode)');
    console.warn('Protected routes will redirect to /auth/unavailable');
    console.warn('');
    console.warn('To enable local auth testing:');
    console.warn('  1. Create a GitHub OAuth App for localhost');
    console.warn('  2. Copy .env.example to .env.local and fill in the values');
    console.warn('');
  }
  
  if (missing.length === 0) {
    console.log('✅ All authentication variables configured!');
    console.log('');
  }
  
  return missing.length === 0;
}

// Run validation
const isConfigured = validateAuthConfig();

// Export for use in other scripts
module.exports = { validateAuthConfig, REQUIRED_VARS };
