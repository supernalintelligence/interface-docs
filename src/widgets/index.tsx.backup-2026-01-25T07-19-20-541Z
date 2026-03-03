/**
 * Simple demo widgets for code-toggle examples
 * These are working components that respond to tool events
 */

import React, { useState, useEffect } from 'react';
import { Counter, Chat, Settings, Data } from '../tools/ExampleTools';

const widgetStyles = {
  widget: {
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px',
    minHeight: '100px',
  },
  display: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#333',
  },
  button: {
    padding: '0.5rem 1rem',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  buttonSmall: {
    padding: '0.25rem 0.5rem',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    marginLeft: '0.5rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  select: {
    padding: '0.5rem',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '0.9rem',
    background: 'white',
    cursor: 'pointer',
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
  },
};

export const SimpleWidget: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const handleIncrement = () => setCount(c => c + 1);
    const handleDecrement = () => setCount(c => c - 1);
    const handleReset = () => setCount(0);
    
    window.addEventListener('example-tool-increment', handleIncrement);
    window.addEventListener('example-tool-decrement', handleDecrement);
    window.addEventListener('example-tool-reset', handleReset);
    
    return () => {
      window.removeEventListener('example-tool-increment', handleIncrement);
      window.removeEventListener('example-tool-decrement', handleDecrement);
      window.removeEventListener('example-tool-reset', handleReset);
    };
  }, []);
  
  return (
    <div style={widgetStyles.widget} data-testid={Counter.root}>
      <div style={widgetStyles.display}>Count: {count}</div>
      <div style={widgetStyles.buttonGroup}>
        <button 
          onClick={() => setCount(c => c + 1)} 
          style={widgetStyles.button}
          data-testid={Counter.incrementButton}
        >
          Increment
        </button>
        <button 
          onClick={() => setCount(c => c - 1)} 
          style={widgetStyles.button}
          data-testid={Counter.decrementButton}
        >
          Decrement
        </button>
        <button 
          onClick={() => setCount(0)} 
          style={widgetStyles.button}
          data-testid={Counter.resetButton}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  
  useEffect(() => {
    const handleSend = (e: Event) => {
      const customEvent = e as CustomEvent;
      const message = customEvent.detail?.message || input;
      if (message) {
        setMessages(prev => [...prev, message]);
        setInput('');
      }
    };
    
    const handleClear = () => setMessages([]);
    
    window.addEventListener('example-tool-send-message', handleSend);
    window.addEventListener('example-tool-clear-chat', handleClear);
    
    return () => {
      window.removeEventListener('example-tool-send-message', handleSend);
      window.removeEventListener('example-tool-clear-chat', handleClear);
    };
  }, [input]);
  
  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };
  
  return (
    <div style={{...widgetStyles.widget, display: 'flex', flexDirection: 'column', height: '200px'}}>
      <div style={{flex: 1, overflowY: 'auto', marginBottom: '0.5rem', padding: '0.5rem', background: 'white', borderRadius: '4px'}}>
        {messages.map((msg, i) => (
          <div key={i} style={{padding: '0.5rem', marginBottom: '0.5rem', background: '#e9ecef', borderRadius: '4px'}}>{msg}</div>
        ))}
      </div>
      <div style={widgetStyles.inputRow}>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={widgetStyles.input}
        />
        <button 
          onClick={sendMessage} 
          style={widgetStyles.button}
          data-testid={Chat.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export const SettingsWidget: React.FC = () => {
  const [setting, setSetting] = useState('default');
  
  useEffect(() => {
    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSetting(customEvent.detail?.setting || 'default');
    };
    const handleReset = () => setSetting('default');
    const handleDelete = () => {
      setSetting('default');
      alert('⚠️ All data deleted!');
    };
    
    window.addEventListener('example-tool-change-setting', handleChange);
    window.addEventListener('example-tool-reset-settings', handleReset);
    window.addEventListener('example-tool-delete-data', handleDelete);
    
    return () => {
      window.removeEventListener('example-tool-change-setting', handleChange);
      window.removeEventListener('example-tool-reset-settings', handleReset);
      window.removeEventListener('example-tool-delete-data', handleDelete);
    };
  }, []);
  
  return (
    <div style={widgetStyles.widget}>
      <div style={widgetStyles.display}>Current: {setting}</div>
      <select 
        value={setting} 
        onChange={(e) => setSetting(e.target.value)}
        style={widgetStyles.select}
        data-testid={Settings.changeButton}
      >
        <option value="default">Default</option>
        <option value="custom">Custom</option>
        <option value="advanced">Advanced</option>
      </select>
    </div>
  );
};

export const NavigationWidget: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  
  return (
    <div style={widgetStyles.widget}>
      <div style={widgetStyles.display}>Page: {currentPage}</div>
      <div style={widgetStyles.buttonGroup}>
        <button onClick={() => setCurrentPage('home')} style={widgetStyles.button}>Home</button>
        <button onClick={() => setCurrentPage('settings')} style={widgetStyles.button}>Settings</button>
        <button onClick={() => setCurrentPage('help')} style={widgetStyles.button}>Help</button>
      </div>
    </div>
  );
};

export const OnboardingWidget: React.FC = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  useEffect(() => {
    const handleNext = () => setStep(s => Math.min(totalSteps, s + 1));
    const handlePrev = () => setStep(s => Math.max(1, s - 1));
    
    window.addEventListener('example-tool-next-step', handleNext);
    window.addEventListener('example-tool-prev-step', handlePrev);
    
    return () => {
      window.removeEventListener('example-tool-next-step', handleNext);
      window.removeEventListener('example-tool-prev-step', handlePrev);
    };
  }, []);
  
  return (
    <div style={widgetStyles.widget}>
      <div style={widgetStyles.display}>
        Step {step} of {totalSteps}
      </div>
      <div style={widgetStyles.buttonGroup}>
        <button 
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          style={widgetStyles.button}
          data-testid="examples-onboarding-prev"
        >
          Previous
        </button>
        <button 
          onClick={() => setStep(Math.min(totalSteps, step + 1))}
          disabled={step === totalSteps}
          style={widgetStyles.button}
          data-testid="examples-onboarding-next"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const DataWidget: React.FC = () => {
  const [data, setData] = useState<string[]>(['Item 1', 'Item 2']);
  const [newItem, setNewItem] = useState('');
  
  useEffect(() => {
    const handleAdd = (e: Event) => {
      const customEvent = e as CustomEvent;
      const item = customEvent.detail?.item || newItem;
      if (item) {
        setData(prev => [...prev, item]);
        setNewItem('');
      }
    };
    
    const handleDelete = (e: Event) => {
      const customEvent = e as CustomEvent;
      const index = customEvent.detail?.index;
      if (typeof index === 'number') {
        setData(prev => prev.filter((_, i) => i !== index));
      }
    };
    
    window.addEventListener('example-tool-add-item', handleAdd);
    window.addEventListener('example-tool-delete-item', handleDelete);
    
    return () => {
      window.removeEventListener('example-tool-add-item', handleAdd);
      window.removeEventListener('example-tool-delete-item', handleDelete);
    };
  }, [newItem]);
  
  return (
    <div style={widgetStyles.widget}>
      <ul style={{listStyle: 'none', padding: 0, marginBottom: '0.5rem', maxHeight: '150px', overflowY: 'auto'}}>
        {data.map((item, i) => (
          <li key={i} style={{padding: '0.5rem', background: 'white', marginBottom: '0.25rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {item}
            <button
              onClick={() => setData(data.filter((_, idx) => idx !== i))}
              style={widgetStyles.buttonSmall}
              data-testid={`${Data.deleteButton}-${i}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div style={widgetStyles.inputRow}>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New item..."
          style={widgetStyles.input}
        />
        <button
          onClick={() => {
            if (newItem.trim()) {
              setData([...data, newItem]);
              setNewItem('');
            }
          }}
          style={widgetStyles.button}
          data-testid={Data.addButton}
        >
          Add
        </button>
      </div>
    </div>
  );
};

