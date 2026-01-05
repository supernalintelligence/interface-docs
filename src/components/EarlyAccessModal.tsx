/**
 * Early Access Modal with HubSpot Form
 * Allows users to sign up for early access
 */

import React, { useEffect, useRef } from 'react';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EarlyAccessModal({ isOpen, onClose }: EarlyAccessModalProps) {
  const formRef = useRef<HTMLDivElement>(null);

  const createHubSpotForm = React.useCallback(() => {
    if (!formRef.current || !window.hbspt) return;

    // Clear any existing form
    formRef.current.innerHTML = '';

    // Create HubSpot form using the same Portal ID and Form ID as supernal-coding
    window.hbspt.forms.create({
      region: 'na1',
      portalId: '46224345',
      formId: '8f9b35de-f230-430c-ab8e-062afd49fed3',
      target: '#hubspot-form-container',
      onFormSubmitted: () => {
        // Auto-close after showing success state
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    });
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Load HubSpot script if not already loaded
    if (typeof window !== 'undefined' && !window.hbspt) {
      const script = document.createElement('script');
      script.src = '//js.hsforms.net/forms/embed/v2.js';
      script.async = true;
      script.onload = () => {
        createHubSpotForm();
      };
      document.body.appendChild(script);
    } else if (window.hbspt) {
      createHubSpotForm();
    }
  }, [isOpen, createHubSpotForm]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Program with Supernal</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-center text-gray-600 mb-6">
              We&apos;d love to hear from you! Please fill out the form and we&apos;ll get back to you as soon as possible.
            </p>

            {/* HubSpot Form Container */}
            <div 
              id="hubspot-form-container" 
              ref={formRef}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Extend window type for TypeScript
declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          region: string;
          portalId: string;
          formId: string;
          target: string;
          onFormSubmitted?: () => void;
        }) => void;
      };
    };
  }
}

