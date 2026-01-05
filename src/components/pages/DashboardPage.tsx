import React from 'react';
import { useContainer } from "@supernal/interface/browser";
import { Components } from '../../architecture';

export const DashboardPage: React.FC = () => {
  useContainer('Dashboard');
  
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-4" data-testid={Components.Dashboard.title}>
        📊 Dashboard
      </h1>
      <p className="text-gray-600 mb-6">Dashboard page - Coming soon</p>
      <p className="text-sm text-gray-500 mt-4">
        Try AI commands like &quot;open menu&quot; - navigation will happen automatically!
      </p>
    </div>
  );
};

