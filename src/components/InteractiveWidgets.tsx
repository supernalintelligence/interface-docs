/**
 * REQ-001: Interactive UI Widgets - Clean Tool Decorator Pattern
 * 
 * Components ARE tools using ClickTool, ChangeTool HOC helpers.
 * No manual handlers, no separate tool methods - just use the components!
 */

import React, { useState, useEffect } from 'react';
import { 
  OpenMenuButton,
  CloseMenuButton,
  FeatureToggle,
  NotificationsToggle,
  PriorityHighRadio,
  PriorityMediumRadio,
  PriorityLowRadio,
  StatusSelect,
  ThemeSelect,
  FormNameInput,
  FormSubmitButton,
  getDemoState,
  setStateChangeCallback,
} from '../lib/UIWidgetComponents';
import { DemoWidgetState } from '../types/DemoState';
import { stateToDataAttrs, type DemoWidgetState as DemoWidgetStateContract } from '../contracts/DemoWidgetContract';

import { testId } from '@supernal/interface/testing';
import { InteractiveWidgets as InteractiveWidgetsNames } from '@/architecture/ComponentNames';
interface DemoState extends DemoWidgetState {
  highlightedWidget: string | null;
}

interface InteractiveWidgetsProps {
  onWidgetInteraction?: (widgetType: string, action: string, result: { name: string }) => void;
}

export const InteractiveWidgets: React.FC<InteractiveWidgetsProps> = ({ 
  onWidgetInteraction 
}) => {
  const [demoState, setDemoState] = useState<DemoState>(getDemoState() as DemoState);
  const [formName, setFormName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setStateChangeCallback((newState) => {
      setDemoState(newState as DemoState);
    });
    setDemoState(getDemoState() as DemoState);
  }, []);

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 2000);
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
      className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-6 mb-6"
      data-theme={demoState.theme}
      data-status={demoState.status}
      {...stateToDataAttrs({
        menuOpen: demoState.menuOpen,
        featureEnabled: demoState.featureEnabled,
        notificationsEnabled: demoState.notificationsEnabled,
        priority: demoState.priority,
        status: demoState.status as DemoWidgetStateContract['status'],
        theme: demoState.theme as DemoWidgetStateContract['theme'],
      })}
    >
      {/* Feedback */}
      {feedback && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-800 text-sm">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Button Widgets */}
        <div className="space-y-3 p-3 rounded">
          <label className="block text-sm font-medium text-gray-700">Button Widgets</label>
          <div className="space-y-2">
            <OpenMenuButton
              className={`w-full px-3 py-2 text-sm rounded transition-all duration-300 ${
                demoState.menuOpen
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {demoState.menuOpen ? 'Menu Open' : 'Open Menu'}
            </OpenMenuButton>
            
            <CloseMenuButton 
              disabled={!demoState.menuOpen}
              className="w-full px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300"
            >
              Close Menu
            </CloseMenuButton>
          </div>
        </div>

        {/* Checkbox Widgets */}
        <div className="space-y-3 p-3 rounded">
          <label className="block text-sm font-medium text-gray-700">Checkbox Widgets</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-2 rounded">
              <FeatureToggle label={`Enable Feature ${demoState.featureEnabled ? '' : ''}`} />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded">
              <NotificationsToggle label={`Enable Notifications ${demoState.notificationsEnabled ? '' : ''}`} />
            </div>
          </div>
        </div>

        {/* Radio Widgets */}
        <div className="space-y-3 p-3 rounded">
          <label className="block text-sm font-medium text-gray-700">Radio Widgets</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 rounded">
              <PriorityHighRadio 
                label={`High ${demoState.priority === 'high' ? '' : ''}`}
              />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded">
              <PriorityMediumRadio 
                label={`Medium ${demoState.priority === 'medium' ? '' : ''}`}
              />
            </div>
            <div className="flex items-center space-x-2 p-2 rounded">
              <PriorityLowRadio 
                label={`Low ${demoState.priority === 'low' ? '' : ''}`}
              />
              </div>
          </div>
        </div>

        {/* Select Widgets */}
        <div className="space-y-3 p-3 rounded">
          <label className="block text-sm font-medium text-gray-700">Select Widgets</label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Status</label>
              <StatusSelect className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Theme</label>
              <ThemeSelect className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Form Widget */}
      <div className="mt-6 p-4 bg-white rounded border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Form Widget</h4>
        <form onSubmit={handleFormSubmit} className="flex gap-2" data-testid={testId(InteractiveWidgetsNames.form)}>
          <FormNameInput
            value={formName}
            onChange={setFormName}
            placeholder="Enter your name..."
            className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FormSubmitButton
            disabled={!formName.trim()}
            formName={formName}
            onFormSubmit={(name: string) => {
              showFeedback(`Form submitted with name: ${name}`);
              setFormName('');
            }}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Submit
          </FormSubmitButton>
        </form>
      </div>

      {/* State Manager Display */}
      <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <h4 className="text-sm font-bold text-gray-800">StateManager (Live)</h4>
          </div>
          <span className="text-xs text-gray-600 italic">
            Single source of truth - all components above subscribe to this state
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          <div>Menu: <span className={demoState.menuOpen ? 'text-green-600 font-bold' : 'text-red-600'}>{demoState.menuOpen ? 'OPEN' : 'CLOSED'}</span></div>
          <div>Feature: <span className={demoState.featureEnabled ? 'text-green-600 font-bold' : 'text-gray-400'}>{demoState.featureEnabled ? 'ON' : 'OFF'}</span></div>
          <div>Notifications: <span className={demoState.notificationsEnabled ? 'text-green-600 font-bold' : 'text-gray-400'}>{demoState.notificationsEnabled ? 'ON' : 'OFF'}</span></div>
          <div>Priority: <span className="text-blue-600 font-bold uppercase">{demoState.priority}</span></div>
          <div>Status: <span className="text-purple-600 font-bold">{demoState.status}</span></div>
          <div>Theme: <span className="text-indigo-600 font-bold">{demoState.theme}</span></div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-300">
          <p className="text-xs text-gray-600">
            Try interacting with any widget above and watch this state update in real-time
          </p>
        </div>
      </div>
    </div>
  );
};
