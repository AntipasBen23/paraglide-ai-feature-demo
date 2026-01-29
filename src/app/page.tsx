'use client';

import { useState } from 'react';
import { mockDisputes, mockInvoices } from './data/mockDisputes';
import { Dispute, Invoice } from './types';
import DisputeList from './components/DisputeList';
import DisputeDetail from './components/DisputeDetail';
import Header from './components/Header';
import Stats from './components/Stats';

export default function Home() {
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  const handleDisputeSelect = (dispute: Dispute) => {
    setSelectedDispute(dispute);
  };

  const handleDisputeUpdate = (updatedDispute: Dispute) => {
    setDisputes(prev => 
      prev.map(d => d.id === updatedDispute.id ? updatedDispute : d)
    );
    setSelectedDispute(updatedDispute);

    // Update invoice if resolved
    if (updatedDispute.resolution?.correctedInvoice) {
      setInvoices(prev =>
        prev.map(inv => 
          inv.id === updatedDispute.invoiceId 
            ? updatedDispute.resolution!.correctedInvoice! 
            : inv
        )
      );
    }
  };

  const openDisputes = disputes.filter(d => d.status === 'open');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resolution Engine
          </h1>
          <p className="text-gray-600">
            Autonomous dispute resolution powered by AI
          </p>
        </div>

        <Stats 
          totalDisputes={disputes.length}
          openDisputes={openDisputes.length}
          resolvedDisputes={resolvedDisputes.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Dispute List */}
          <div className="lg:col-span-1">
            <DisputeList
              disputes={disputes}
              selectedDispute={selectedDispute}
              onSelectDispute={handleDisputeSelect}
            />
          </div>

          {/* Dispute Detail */}
          <div className="lg:col-span-2">
            {selectedDispute ? (
              <DisputeDetail
                dispute={selectedDispute}
                invoice={invoices.find(inv => inv.id === selectedDispute.invoiceId)!}
                onDisputeUpdate={handleDisputeUpdate}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a dispute
                </h3>
                <p className="text-gray-500">
                  Choose a dispute from the list to view details and resolve it
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}