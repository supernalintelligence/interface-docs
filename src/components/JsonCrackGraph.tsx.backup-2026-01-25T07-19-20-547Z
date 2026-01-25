/**
 * JsonCrackGraph - Interactive graph visualization using techniques from JSON Crack
 * 
 * Inspired by: https://github.com/AykutSarac/jsoncrack.com (Apache 2.0)
 * Adapted for our hierarchical container/tool architecture
 */

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { TreeNode } from "@supernalintelligence/interface-enterprise";

interface JsonCrackGraphProps {
  tree: TreeNode[];
  onNodeClick?: (node: TreeNode) => void;
}

// Convert TreeNode to ReactFlow Node format with proper spacing
function convertTreeToFlow(
  tree: TreeNode[],
  parentX = 0,
  parentY = 0,
  level = 0
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Calculate spacing based on node type and children
  const getNodeWidth = (node: TreeNode): number => {
    if (node.type === 'container' && node.children && node.children.length > 0) {
      // Container with children needs width based on children
      const childWidths = node.children.map(c => getNodeWidth(c));
      const totalChildWidth = childWidths.reduce((sum, w) => sum + w, 0);
      const childSpacing = (node.children.length - 1) * 100; // 100px between children
      return Math.max(250, totalChildWidth + childSpacing);
    }
    return node.type === 'container' ? 250 : 180;
  };
  
  const verticalSpacing = 180;
  
  // Calculate positions for each node with proper spacing
  let currentX = parentX;
  
  tree.forEach((node) => {
    const nodeWidth = getNodeWidth(node);
    const x = currentX + nodeWidth / 2; // Center of the node
    const y = parentY + level * verticalSpacing;
    
    // Determine node style based on type
    const isContainer = node.type === 'container';
    const isTool = node.type === 'tool';
    
    const nodeColor = isContainer 
      ? '#4A90E2' 
      : isTool 
      ? '#50C878' 
      : '#9B59B6';
    
    const nodeSize = isContainer
      ? { width: 200, height: 100 }
      : { width: 150, height: 80 };
    
    // Create ReactFlow node
    const flowNode: Node = {
      id: node.id,
      type: 'default',
      position: { x: x - nodeSize.width / 2, y }, // Offset to center
      data: {
        label: (
          <div style={{ 
            padding: '12px',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: isContainer ? '14px' : '12px',
              marginBottom: '4px',
              color: '#fff',
            }}>
              {isContainer ? '📦' : isTool ? '🔧' : '🔷'} {node.name}
            </div>
            {(node.childCount ?? 0) > 0 && (
              <div style={{ 
                fontSize: '10px',
                opacity: 0.8,
                color: '#fff',
              }}>
                {node.childCount} {node.childCount === 1 ? 'item' : 'items'}
              </div>
            )}
          </div>
        ),
      },
      style: {
        background: nodeColor,
        color: '#fff',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: '8px',
        fontSize: '12px',
        width: nodeSize.width,
        height: nodeSize.height,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
    
    nodes.push(flowNode);
    
    // Process children recursively
    if (node.children && node.children.length > 0) {
      // Calculate the starting X position for children (centered under parent)
      const childrenTotalWidth = node.children.reduce((sum, child) => sum + getNodeWidth(child), 0);
      const childSpacing = (node.children.length - 1) * 100;
      const childrenStartX = x - (childrenTotalWidth + childSpacing) / 2;
      
      const childResult = convertTreeToFlow(
        node.children,
        childrenStartX,
        y + verticalSpacing,
        level + 1
      );
      
      nodes.push(...childResult.nodes);
      edges.push(...childResult.edges);
      
      // Create edges from parent to children
      node.children.forEach(child => {
        edges.push({
          id: `${node.id}-${child.id}`,
          source: node.id,
          target: child.id,
          type: 'smoothstep',
          animated: false,
          style: { 
            stroke: '#94A3B8',
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#94A3B8',
          },
        });
      });
    }
    
    // Move currentX for next sibling
    currentX += nodeWidth + 100; // 100px spacing between siblings
  });
  
  return { nodes, edges };
}

export const JsonCrackGraph: React.FC<JsonCrackGraphProps> = ({ 
  tree,
  onNodeClick,
}) => {
  const flowData = useMemo(() => convertTreeToFlow(tree), [tree]);
  
  const [nodes, , onNodesChange] = useNodesState(flowData.nodes);
  const [edges, , onEdgesChange] = useEdgesState(flowData.edges);
  
  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Find the original TreeNode
      const findNode = (nodes: TreeNode[], id: string): TreeNode | null => {
        for (const n of nodes) {
          if (n.id === id) return n;
          if (n.children) {
            const found = findNode(n.children, id);
            if (found) return found;
          }
        }
        return null;
      };
      
      const treeNode = findNode(tree, node.id);
      if (treeNode && onNodeClick) {
        onNodeClick(treeNode);
      }
    },
    [tree, onNodeClick]
  );
  
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
        }}
      >
        <Background color="#94A3B8" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const style = node.style as React.CSSProperties | undefined;
            return (style?.background as string) || '#4A90E2';
          }}
          maskColor="rgba(0, 0, 0, 0.2)"
        />
      </ReactFlow>
    </div>
  );
};

