module.exports = {
  extends: [
    "next/core-web-vitals"  // Includes react-hooks rules by default
  ],
  rules: {
    // Relax rules for demo/production builds
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-unused-vars": "warn",
    "no-console": "warn",
    "react/no-unescaped-entities": "warn",
    "@next/next/no-img-element": "warn",
    "no-inner-declarations": "off",  // Allow function declarations inside blocks (useEffect, etc.)
    
    // ⚠️ PREVENT COMMON REACT ISSUES ⚠️
    
    // 1. Catch duplicate keys in lists (prevents "standalonefunctions-anonymous" issue)
    "react/jsx-key": ["error", { 
      "checkFragmentShorthand": true,
      "checkKeyMustBeforeSpread": true,
      "warnOnDuplicates": true  // ← Would have caught duplicate key issue!
    }],
    
    // 2. Warn if using array index as key (can cause issues with dynamic lists)
    "react/no-array-index-key": "warn",
    
    // 3. Enforce proper useEffect dependencies (prevents infinite loops)
    // Note: This is already enabled by next/core-web-vitals via react-hooks/exhaustive-deps
    "react-hooks/exhaustive-deps": "error"
  },
  env: {
    browser: true,
    node: true,
    es6: true
  }
};

