/**
 * Architecture Page Route - /architecture
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { EarlyAccessModal } from '../components/EarlyAccessModal';
import { ArchitecturePage } from '../components/pages/ArchitecturePage';

export default function ArchitectureRoute() {
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  return (
    <>
      <Head>
        <title>Architecture - Supernal Interface Demo</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header onEarlyAccessClick={() => setShowEarlyAccessModal(true)} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <ArchitecturePage />
        </div>
        
        {/* Chat is now global in _app.tsx */}
        
        <EarlyAccessModal 
          isOpen={showEarlyAccessModal}
          onClose={() => setShowEarlyAccessModal(false)}
        />
      </div>
    </>
  );
}

