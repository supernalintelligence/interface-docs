/**
 * Route and Name Uniqueness Tests
 * 
 * Verifies:
 * 1. Routes are accessible
 * 2. Component names are unique across demos
 * 3. No tool ID conflicts
 */

import { SimpleDemoNames } from '../src/names/SimpleDemoNames';
import { StatefulDemoNames } from '../src/names/StatefulDemoNames';

describe('Demo Routes and Names', () => {
  describe('Component Name Uniqueness', () => {
    it('simple and stateful demos have unique component IDs', () => {
      const simpleIds = Object.values(SimpleDemoNames);
      const advancedIds = Object.values(StatefulDemoNames);
      
      // Check no overlaps
      simpleIds.forEach(simpleId => {
        expect(advancedIds).not.toContain(simpleId);
      });
      
      advancedIds.forEach(advancedId => {
        expect(simpleIds).not.toContain(advancedId);
      });
    });
    
    it('simple demo IDs have correct prefix', () => {
      const simpleIds = Object.values(SimpleDemoNames);
      simpleIds.forEach(id => {
        expect(id).toMatch(/^simple-/);
      });
    });
    
    it('stateful demo IDs have correct prefix', () => {
      const advancedIds = Object.values(StatefulDemoNames);
      advancedIds.forEach(id => {
        expect(id).toMatch(/^stateful-/);
      });
    });
    
    it('has all required widget IDs', () => {
      const required = [
        'openMenu',
        'closeMenu',
        'featureToggle',
        'notificationsToggle',
        'priorityHigh',
        'priorityMedium',
        'priorityLow',
        'statusDropdown',
        'themeSelect',
        'formName',
        'formSubmit',
      ];
      
      required.forEach(key => {
        expect(SimpleDemoNames).toHaveProperty(key);
        expect(StatefulDemoNames).toHaveProperty(key);
      });
    });
  });
  
  describe('Route Structure', () => {
    it('has correct route files', () => {
      const fs = require('fs');
      const path = require('path');
      
      const pagesDir = path.join(__dirname, '../src/pages/demo');
      expect(fs.existsSync(pagesDir)).toBe(true);
      
      const simpleRoute = path.join(pagesDir, 'simple.tsx');
      const advancedRoute = path.join(pagesDir, 'stateful.tsx');
      
      expect(fs.existsSync(simpleRoute)).toBe(true);
      expect(fs.existsSync(advancedRoute)).toBe(true);
    });
  });
});

