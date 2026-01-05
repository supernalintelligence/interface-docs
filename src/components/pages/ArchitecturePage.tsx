import React, { useState, useEffect } from 'react';
import {
  ArchitectureGraph,
  LiveArchitectureGraph,
  StateManager,
  StateManagers,
  GraphBuilder,
  GraphLayout,
  TreeValidator,
  StatePanel,
  type ApplicationGraph,
  type TreeNode,
} from "@supernal/interface-enterprise";
import { localStorageAdapter } from '../../lib/storage';
import { JsonCrackGraph } from '../JsonCrackGraph';

// Demo app containers (filter to only top-level containers, child containers will be included automatically)
const DEMO_CONTAINERS = [
  'Landing',
  'Demo',
  'Dashboard',
  'Docs',
  'Examples',
  'API',
  'Architecture',
  'Settings'
];

export const ArchitecturePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graph, setGraph] = useState<ApplicationGraph | null>(null);
  const [treeData, setTreeData] = useState<TreeNode[] | null>(null);
  const [activeTab, setActiveTab] = useState<'static' | 'live' | 'jsoncrack'>('jsoncrack');
  const [stateManager] = useState(() => StateManager.getInstance(StateManagers.SupernalCoreV1, localStorageAdapter));

  const exportTreeAsJSON = () => {
    if (!graph) return;
    
    const tree = GraphLayout.exportTreeStructure(graph.nodes);
    
    // Validate tree structure
    TreeValidator.validateAndReport(tree);
    TreeValidator.printTree(tree);
    
    const jsonString = JSON.stringify(tree, null, 2);
    
    // Copy to clipboard
    navigator.clipboard.writeText(jsonString).then(() => {
      alert('Tree structure copied to clipboard!\n\n✅ Validation passed - tree structure is correct\n\nYou can paste it into:\n• JSON Crack (jsoncrack.com)\n• JSON Hero (jsonhero.io)\n• Any JSON viewer');
    });
  };

  const downloadTreeAsJSON = () => {
    if (!graph) return;
    
    const tree = GraphLayout.exportTreeStructure(graph.nodes);
    const jsonString = JSON.stringify(tree, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'architecture-tree.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    async function loadGraph() {
      try {
        setLoading(true);
        setError(null);
        
        const builtGraph = await GraphBuilder.buildGraph({ 
          hierarchical: true,
          filterUnused: false, // Keep all containers, even if empty
          rootContainers: DEMO_CONTAINERS,
          includeWireframes: false 
        });
        
        setGraph(builtGraph);
        
        // Export tree structure for JSON Crack visualization
        const tree = GraphLayout.exportTreeStructure(builtGraph.nodes);
        setTreeData(tree as TreeNode[]);
        
        setLoading(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load graph';
        setError(errorMsg);
        setLoading(false);
      }
    }
    loadGraph();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Application Architecture</h1>
        <p>Loading graph data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px' }}>
        <h1>Application Architecture</h1>
        <div style={{ 
          padding: '20px', 
          background: '#ffebee', 
          borderRadius: '8px', 
          color: '#c62828',
          marginTop: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!graph) {
    return (
      <div style={{ padding: '40px' }}>
        <h1>Application Architecture</h1>
        <p>No graph data available</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>Application Architecture</h1>
        <p style={{ marginBottom: '15px' }}>
          <strong>Containers:</strong> {graph?.metadata.totalContainers || 0} |
          <strong> Components:</strong> {graph?.metadata.totalComponents || 0} |
          <strong> Tools:</strong> {graph?.metadata.totalTools || 0} |
          <strong> Edges:</strong> {graph?.metadata.totalEdges || 0}
        </p>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('jsoncrack')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'jsoncrack' ? '#1976d2' : '#f5f5f5',
              color: activeTab === 'jsoncrack' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'jsoncrack' ? 'bold' : 'normal',
              fontSize: '14px',
            }}
          >
            ✨ JSON Crack View
          </button>
          <button
            onClick={() => setActiveTab('static')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'static' ? '#1976d2' : '#f5f5f5',
              color: activeTab === 'static' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'static' ? 'bold' : 'normal',
              fontSize: '14px',
            }}
          >
            📐 Static View
          </button>
          <button
            onClick={() => setActiveTab('live')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'live' ? '#1976d2' : '#f5f5f5',
              color: activeTab === 'live' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'live' ? 'bold' : 'normal',
              fontSize: '14px',
            }}
          >
            ⚡ Live Tracking
          </button>
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <button
              onClick={exportTreeAsJSON}
              style={{
                padding: '8px 16px',
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
              }}
              title="Copy tree structure to clipboard"
            >
              📋 Copy Tree JSON
            </button>
            <button
              onClick={downloadTreeAsJSON}
              style={{
                padding: '8px 16px',
                background: '#ff9800',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
              }}
              title="Download tree structure as JSON file"
            >
              💾 Download JSON
            </button>
          </div>
        </div>
        
        {/* Legend */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          padding: '10px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          fontSize: '13px',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#e1f5ff', 
              border: '2px solid #1976d2',
              borderRadius: '4px' 
            }} />
            <span><strong>Container</strong> (Page/Modal)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#c8e6c9', 
              border: '2px solid #388e3c',
              borderRadius: '4px' 
            }} />
            <span><strong>Tool</strong> (AI-accessible action)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              backgroundColor: '#fff9c4', 
              border: '2px solid #f57c00',
              borderRadius: '4px' 
            }} />
            <span><strong>Component</strong> (UI element)</span>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginLeft: 'auto' }}>
            💡 {activeTab === 'static' 
              ? 'Containers visually nest their tools/components. Use mouse wheel to zoom, drag to pan.'
              : 'Live view shows real-time tool executions and state changes.'
            }
          </div>
        </div>
      </div>

      {activeTab === 'jsoncrack' && treeData && (
        <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <JsonCrackGraph 
            tree={treeData}
          />
        </div>
      )}

      {activeTab === 'static' && graph && (
        <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <ArchitectureGraph
            graph={graph}
            layoutAlgorithm="hierarchical"
            height="100%"
            showMinimap
            showControls
            onNodeClick={() => {}}
          />
        </div>
      )}

      {activeTab === 'live' && graph && (
        <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
          <div style={{ flex: 2, border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <LiveArchitectureGraph
              layoutAlgorithm="hierarchical"
              height="100%"
              showExecutionLog
              showStats
              onNodeClick={() => {}}
            />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <StatePanel
              stateManager={stateManager}
              refreshInterval={1000}
              maxHeight="calc(100vh - 300px)"
              highlightChanges
            />
          </div>
        </div>
      )}
    </div>
  );
};

