'use client';

import { useState } from 'react';
import { Dispute, Invoice } from '../types';
import { formatCurrency, formatDate, getDisputeTypeLabel } from '../utils/helpers';
import ResolutionProcess from './ResolutionProcess';
import InvoiceComparison from './InvoiceComparison';

interface DisputeDetailProps {
  dispute: Dispute;
  invoice: Invoice;
  onDisputeUpdate: (dispute: Dispute) => void;
}

export default function DisputeDetail({ dispute, invoice, onDisputeUpdate }: DisputeDetailProps) {
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = () => {
    setIsResolving(true);
  };

  return (
    <div className="space-y-6">
      {/* Dispute Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {dispute.subject}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {dispute.customerEmail}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(dispute.timestamp)}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {getDisputeTypeLabel(dispute.disputeType)}
              </span>
            </div>
          </div>
          
          {dispute.status === 'open' && !isResolving && (
            <button
              onClick={handleResolve}
              className="px-6 py-3 bg-[#00FF94] text-gray-900 font-semibold rounded-lg hover:bg-[#00e085] transition-colors shadow-sm"
            >
              Resolve with AI
            </button>
          )}
        </div>

        {/* Customer Message */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Customer Message:</p>
          <p className="text-gray-900">{dispute.message}</p>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Invoice Number</p>
            <p className="text-base font-medium text-gray-900">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount</p>
            <p className="text-base font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Issue Date</p>
            <p className="text-base font-medium text-gray-900">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Due Date</p>
            <p className="text-base font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
          </div>
          {invoice.poNumber && (
            <div>
              <p className="text-sm text-gray-600">PO Number</p>
              <p className="text-base font-medium text-gray-900">{invoice.poNumber}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="text-base font-medium text-gray-900">{invoice.customerName}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Line Items</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.lineItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Resolution Process */}
      {isResolving && (
        <ResolutionProcess
          dispute={dispute}
          invoice={invoice}
          onComplete={onDisputeUpdate}
        />
      )}

      {/* Show comparison if resolved */}
      {dispute.status === 'resolved' && dispute.resolution && (
        <InvoiceComparison
          originalInvoice={invoice}
          correctedInvoice={dispute.resolution.correctedInvoice!}
          changes={dispute.resolution.changes}
        />
      )}
    </div>
  );
}