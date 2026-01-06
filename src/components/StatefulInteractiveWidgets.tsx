/**
 * Stateful Interactive Widgets
 * 
 * Uses StateManager for persistence - SAME key as DemoWidgetProvider
 * so AI commands and UI changes update the same state.
 */

import React, { useState, useEffect } from 'react';
import { StateManager, StateManagers } from "@supernalintelligence/interface-enterprise";
import { localStorageAdapter } from '../lib/storage';
import { StatefulDemoNames } from '../names/StatefulDemoNames';
import { 
  StatefulOpenMenu,
  StatefulCloseMenu,
  StatefulFeatureToggle,
  StatefulNotificationsToggle,
  StatefulPriorityHighRadio,
  StatefulPriorityMediumRadio,
  StatefulPriorityLowRadio,
  StatefulStatusSelect,
  FormNameInput,
  StatefulFormSubmitButton,
} from '../lib/UIWidgetComponents';
import type { DemoWidgetState } from '../types/DemoState';

interface DemoState extends DemoWidgetState {
  highlightedWidget: string | null;
}

interface StatefulInteractiveWidgetsProps {
  onWidgetInteraction?: (widgetType: string, action: string, result: { name: string }) => void;
}

const DEFAULT_STATE: DemoState = {
  kind: 'application',
  stateId: 'demo-stateful-widgets',  // MUST match DemoWidgetProvider key
  menuOpen: false,
  featureEnabled: false,
  notificationsEnabled: false,
  priority: 'medium',
  status: 'inactive',
  theme: 'light',
  highlightedWidget: null
};

export const StatefulInteractiveWidgets: React.FC<StatefulInteractiveWidgetsProps> = ({ 
  onWidgetInteraction 
}) => {
  // Use StateManager - SAME system as DemoWidgetProvider AI tools
  const [demoState, setDemoState] = useState<DemoState>(DEFAULT_STATE);
  const [stateManager, setStateManager] = useState<StateManager | null>(null);
  const [formName, setFormName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const manager = StateManager.getInstance(StateManagers.SupernalCoreV1, localStorageAdapter);
    setStateManager(manager);
    
    // Initialize state if not present
    const initState = async () => {
      const existing = await manager.get<DemoState>('demo-stateful-widgets');
      if (!existing) {
        await manager.set('demo-stateful-widgets', DEFAULT_STATE);
      }
      
      // Subscribe to state changes from BOTH UI and AI
      const handle = manager.subscribe<DemoState>('demo-stateful-widgets', (newState) => {
        if (newState) {
          setDemoState(newState);
        }
      });
      
      // Load initial state
      const state = await manager.get<DemoState>('demo-stateful-widgets');
      if (state) {
        setDemoState(state);
      }
      
      return handle;
    };
    
    let cleanup: { unsubscribe: () => void } | undefined;
    initState().then((handle) => {
      cleanup = handle;
    });
    
    return () => cleanup?.unsubscribe();
  }, []);

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 2000);
  };

  const updateState = async (updates: Partial<DemoState>) => {
    if (!stateManager) return;
    await stateManager.merge('demo-stateful-widgets', updates);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    showFeedback(`Form submitted with name: ${formName}`);
    setFormName('');
    onWidgetInteraction?.('Form', 'submit', { name: formName });
  };

  return (
    <div 
      className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6"
      data-testid="stateful-demo-container"
      data-theme={demoState.theme}
      data-status={demoState.status}
    >
      <h3 className="text-lg font-semibold mb-3 text-purple-800">🚀 Advanced Widget Component Zoo</h3>
      <p className="text-sm text-purple-600 mb-4">
        Advanced demo with StateManager persistence - same UI, different tool registration!
      </p>

      {/* Feedback */}
      {feedback && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-800 text-sm">
          ✅ {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Button Widgets */}
        <div className="space-y-3 p-3 rounded">
          <label className="block text-sm font-medium text-purple-700">Button Widgets</label>
          <div className="space-y-2">
            <StatefulOpenMenu 
              className={`w-full px-3 py-2 text-sm rounded transition-all duration-300 ${
                demoState.menuOpen 
                  ? 'bg-green-600 text-white' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {demoState.menuOpen ? '✅ Menu Open' : 'Open Menu'}
            </StatefulOpenMenu>
            
            <StatefulCloseMenu 
              disabled={!demoState.menuOpen}
              className="w-full px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300"
            >
              Close Menu
            </StatefulCloseMenu>
          </div>
        </div>

        {/* Checkbox Widgets */}
        <div className="space-y-3 p-3 rounded">
          <label className="block text-sm font-medium text-purple-700">Checkbox Widgets</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-2 rounded">
              <StatefulFeatureToggle label={`Enable Feature ${demoState.featureEnabled ? '✅' : ''}`} />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded">
              <StatefulNotificationsToggle label={`Enable Notifications ${demoState.notificationsEnabled ? '✅' : ''}`} />
            </div>
          </div>
        </div>

        {/* Radio Widgets */}
        <div className="space-y-3 p-3 rounded">
          <label className="block text-sm font-medium text-purple-700">Radio Widgets</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 rounded">
              <StatefulPriorityHighRadio 
                label={`High ${demoState.priority === 'high' ? '✅' : ''}`}
              />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded">
              <StatefulPriorityMediumRadio 
                label={`Medium ${demoState.priority === 'medium' ? '✅' : ''}`}
              />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded">
              <StatefulPriorityLowRadio 
                label={`Low ${demoState.priority === 'low' ? '✅' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Select Widgets */}
        <div className="space-y-3 p-3 rounded">
          <label className="block text-sm font-medium text-purple-700">Select Widgets</label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-purple-600 mb-1">Status</label>
              <StatefulStatusSelect className="w-full px-2 py-1 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
            </div>
          <div>
            <label className="block text-xs text-purple-600 mb-1">Theme</label>
            <select
              data-testid={StatefulDemoNames.themeSelect}
              value={demoState.theme}
              onChange={(e) => updateState({ theme: e.target.value as 'light' | 'dark' | 'auto' })}
              className="w-full px-2 py-1 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          </div>
        </div>
      </div>

      {/* Form Widget */}
      <div className="mt-6 p-4 bg-white rounded border border-purple-200">
        <h4 className="text-sm font-medium text-purple-700 mb-3">Form Widget</h4>
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <FormNameInput
            value={formName}
            onChange={setFormName}
            placeholder="Enter your name..."
            className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <StatefulFormSubmitButton
            disabled={!formName.trim()}
            formName={formName}
            onFormSubmit={(name: string) => {
              showFeedback(`Form submitted with name: ${name}`);
              setFormName('');
            }}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Submit
          </StatefulFormSubmitButton>
        </form>
      </div>

      {/* State Display */}
      <div className="mt-6 p-4 bg-purple-50 rounded border border-purple-200">
        <h4 className="text-sm font-medium text-purple-700 mb-2">Current State (from StateManager)</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          <div>Menu: <span className={demoState.menuOpen ? 'text-green-600 font-bold' : 'text-red-600'}>{demoState.menuOpen ? 'OPEN' : 'CLOSED'}</span></div>
          <div>Feature: <span className={demoState.featureEnabled ? 'text-green-600 font-bold' : 'text-gray-400'}>{demoState.featureEnabled ? 'ON' : 'OFF'}</span></div>
          <div>Notifications: <span className={demoState.notificationsEnabled ? 'text-green-600 font-bold' : 'text-gray-400'}>{demoState.notificationsEnabled ? 'ON' : 'OFF'}</span></div>
          <div>Priority: <span className="text-purple-600 font-bold uppercase">{demoState.priority}</span></div>
          <div>Status: <span className="text-purple-600 font-bold">{demoState.status}</span></div>
          <div>Theme: <span className="text-indigo-600 font-bold">{demoState.theme}</span></div>
        </div>
      </div>
    </div>
  );
};

