'use client';

import { useState, useEffect } from 'react';
import { Dispute, Invoice, ResolutionStep, AIThought } from '../types';
import { mockResolutions } from '../data/mockDisputes';
import { sleep, simulateTyping } from '../utils/helpers';

interface ResolutionProcessProps {
  dispute: Dispute;
  invoice: Invoice;
  onComplete: (updatedDispute: Dispute) => void;
}

export default function ResolutionProcess({ dispute, invoice, onComplete }: ResolutionProcessProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [aiThinking, setAiThinking] = useState('');
  const [steps, setSteps] = useState<ResolutionStep[]>([
    { step: 'Analyzing customer message', status: 'pending' },
    { step: 'Identifying dispute type', status: 'pending' },
    { step: 'Accessing internal systems', status: 'pending' },
    { step: 'Verifying data', status: 'pending' },
    { step: 'Generating resolution', status: 'pending' },
    { step: 'Creating corrected invoice', status: 'pending' },
  ]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    executeResolution();
  }, []);

  const executeResolution = async () => {
    const resolution = mockResolutions[dispute.id];

    // Step 1: Analyzing
    setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'in-progress' } : s));
    await simulateTyping(
      'Reading customer email... Extracting key information... Identifying complaint details...',
      setAiThinking,
      20
    );
    await sleep(1500);
    setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: 'complete', detail: 'Customer complaint analyzed' } : s));

    // Step 2: Identifying dispute type
    setCurrentStep(1);
    setAiThinking('');
    setSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: 'in-progress' } : s));
    await simulateTyping(
      `Dispute classification: ${dispute.disputeType.replace('_', ' ').toUpperCase()}`,
      setAiThinking,
      20
    );
    await sleep(1000);
    setSteps(prev => prev.map((s, i) => i === 1 ? { ...s, status: 'complete', detail: 'Dispute type identified' } : s));

    // Step 3: Accessing systems
    setCurrentStep(2);
    setAiThinking('');
    setSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: 'in-progress' } : s));
    
    const systemMessages = [
      'Connecting to ERP system...',
      'Retrieving purchase order database...',
      'Accessing contract repository...',
      'Loading customer history...'
    ];
    
    for (const msg of systemMessages) {
      await simulateTyping(msg, setAiThinking, 15);
      await sleep(800);
      setAiThinking(prev => prev + '\n');
    }
    
    await sleep(500);
    setSteps(prev => prev.map((s, i) => i === 2 ? { ...s, status: 'complete', detail: 'Systems accessed' } : s));

    // Step 4: Verifying
    setCurrentStep(3);
    setAiThinking('');
    setSteps(prev => prev.map((s, i) => i === 3 ? { ...s, status: 'in-progress' } : s));
    await simulateTyping(
      resolution.aiAnalysis,
      setAiThinking,
      15
    );
    await sleep(1500);
    setSteps(prev => prev.map((s, i) => i === 3 ? { ...s, status: 'complete', detail: 'Data verified' } : s));

    // Step 5: Generating resolution
    setCurrentStep(4);
    setAiThinking('');
    setSteps(prev => prev.map((s, i) => i === 4 ? { ...s, status: 'in-progress' } : s));
    await simulateTyping(
      `Resolution: ${resolution.action}`,
      setAiThinking,
      20
    );
    await sleep(1200);
    setSteps(prev => prev.map((s, i) => i === 4 ? { ...s, status: 'complete', detail: 'Resolution generated' } : s));

    // Step 6: Creating invoice
    setCurrentStep(5);
    setAiThinking('');
    setSteps(prev => prev.map((s, i) => i === 5 ? { ...s, status: 'in-progress' } : s));
    
    const invoiceMessages = [
      'Updating invoice details...',
      'Recalculating totals...',
      'Generating PDF...',
      'Preparing email to customer...'
    ];
    
    for (const msg of invoiceMessages) {
      await simulateTyping(msg, setAiThinking, 15);
      await sleep(700);
      setAiThinking(prev => prev + '\n');
    }
    
    await sleep(500);
    setSteps(prev => prev.map((s, i) => i === 5 ? { ...s, status: 'complete', detail: 'Corrected invoice created' } : s));

    // Complete
    await sleep(500);
    setIsComplete(true);
    
    // Update dispute
    const updatedDispute: Dispute = {
      ...dispute,
      status: 'resolved',
      aiAnalysis: resolution.aiAnalysis,
      resolution: {
        action: resolution.action,
        changes: resolution.changes,
        correctedInvoice: resolution.correctedInvoice
      }
    };
    
    await sleep(1000);
    onComplete(updatedDispute);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-[#00FF94] bg-opacity-20 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-[#00FF94]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Resolution in Progress</h3>
          <p className="text-sm text-gray-500">Autonomous dispute resolution engine active</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {step.status === 'complete' && (
                <div className="w-6 h-6 bg-[#00FF94] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {step.status === 'in-progress' && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
              {step.status === 'pending' && (
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                step.status === 'complete' ? 'text-gray-900' : 
                step.status === 'in-progress' ? 'text-blue-600' : 
                'text-gray-400'
              }`}>
                {step.step}
              </p>
              {step.detail && (
                <p className="text-xs text-gray-500 mt-1">{step.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Thinking Panel */}
      {aiThinking && (
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 font-semibold">AI Agent</span>
          </div>
          {aiThinking}
          <span className="animate-pulse">▋</span>
        </div>
      )}

      {/* Success Message */}
      {isComplete && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-green-800">
              Dispute resolved successfully! Corrected invoice ready.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}