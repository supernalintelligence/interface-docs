/**
 * Dashboard Page Route - /dashboard
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { EarlyAccessModal } from '../components/EarlyAccessModal';
import { DashboardPage } from '../components/pages/DashboardPage';

export default function DashboardRoute() {
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  return (
    <>
      <Head>
        <title>Dashboard - Supernal Interface Demo</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header onEarlyAccessClick={() => setShowEarlyAccessModal(true)} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <DashboardPage />
        </div>

        <EarlyAccessModal
          isOpen={showEarlyAccessModal}
          onClose={() => setShowEarlyAccessModal(false)}
        />
      </div>
    </>
  );
}
