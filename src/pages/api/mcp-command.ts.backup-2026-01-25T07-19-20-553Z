/**
 * MCP Command API
 * Receives commands from MCP server and broadcasts to connected clients
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory store for pending commands
const pendingCommands: Array<{ id: string; command: any; timestamp: number }> = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Allow cross-origin for MCP server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
  
  if (req.method === 'POST') {
    // MCP server posting a command
    const command = req.body;
    const id = Date.now().toString();
    
    pendingCommands.push({
      id,
      command,
      timestamp: Date.now()
    });
    
    // Clean up old commands (>30 seconds)
    const now = Date.now();
    for (let i = pendingCommands.length - 1; i >= 0; i--) {
      if (now - pendingCommands[i].timestamp > 30000) {
        pendingCommands.splice(i, 1);
      }
    }
    
    return res.status(200).json({ success: true, id });
  } else if (req.method === 'GET') {
    // Frontend polling for commands
    const commands = [...pendingCommands];
    pendingCommands.length = 0; // Clear after retrieving
    
    return res.status(200).json({ commands });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
