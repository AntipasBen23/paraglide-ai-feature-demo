import { Invoice } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';

interface InvoiceComparisonProps {
  originalInvoice: Invoice;
  correctedInvoice: Invoice;
  changes: string[];
}

export default function InvoiceComparison({ originalInvoice, correctedInvoice, changes }: InvoiceComparisonProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Resolution Summary</h3>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Resolved
        </span>
      </div>

      {/* Changes List */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-medium text-blue-900 mb-3">Changes Applied:</p>
        <ul className="space-y-2">
          {changes.map((change, idx) => (
            <li key={idx} className="flex items-start text-sm text-blue-800">
              <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {change}
            </li>
          ))}
        </ul>
      </div>

      {/* Side by Side Comparison */}
      <div className="grid grid-cols-2 gap-6">
        {/* Original Invoice */}
        <div className="border border-red-200 rounded-lg overflow-hidden">
          <div className="bg-red-50 px-4 py-3 border-b border-red-200">
            <h4 className="text-sm font-semibold text-red-900">Original Invoice</h4>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500">Invoice Number</p>
              <p className="text-sm font-medium text-gray-900">{originalInvoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-sm font-medium text-red-600 line-through">
                {formatCurrency(originalInvoice.amount)}
              </p>
            </div>
            {originalInvoice.poNumber && (
              <div>
                <p className="text-xs text-gray-500">PO Number</p>
                <p className="text-sm font-medium text-gray-900">{originalInvoice.poNumber}</p>
              </div>
            )}
            {!originalInvoice.poNumber && (
              <div>
                <p className="text-xs text-gray-500">PO Number</p>
                <p className="text-sm font-medium text-red-600">Missing</p>
              </div>
            )}
            
            {/* Line Items */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Line Items</p>
              {originalInvoice.lineItems.map((item, idx) => (
                <div key={idx} className="text-xs space-y-1 mb-2 pb-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-900">{item.description}</p>
                  <div className="flex justify-between text-gray-600">
                    <span>{item.quantity} × {formatCurrency(item.unitPrice)}</span>
                    <span className="font-medium">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Corrected Invoice */}
        <div className="border border-green-200 rounded-lg overflow-hidden">
          <div className="bg-green-50 px-4 py-3 border-b border-green-200">
            <h4 className="text-sm font-semibold text-green-900">Corrected Invoice</h4>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500">Invoice Number</p>
              <p className="text-sm font-medium text-gray-900">{correctedInvoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-sm font-medium text-green-600">
                {formatCurrency(correctedInvoice.amount)}
              </p>
            </div>
            {correctedInvoice.poNumber && (
              <div>
                <p className="text-xs text-gray-500">PO Number</p>
                <p className="text-sm font-medium text-green-600">{correctedInvoice.poNumber}</p>
              </div>
            )}
            
            {/* Line Items */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Line Items</p>
              {correctedInvoice.lineItems.map((item, idx) => (
                <div key={idx} className="text-xs space-y-1 mb-2 pb-2 border-b border-gray-100 last:border-0">
                  <p className="text-gray-900">{item.description}</p>
                  <div className="flex justify-between text-gray-600">
                    <span>{item.quantity} × {formatCurrency(item.unitPrice)}</span>
                    <span className="font-medium">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Amount Difference */}
      {originalInvoice.amount !== correctedInvoice.amount && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-900">
              Amount Adjustment:
            </span>
            <span className={`text-lg font-bold ${
              correctedInvoice.amount < originalInvoice.amount 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {correctedInvoice.amount < originalInvoice.amount ? '-' : '+'}
              {formatCurrency(Math.abs(originalInvoice.amount - correctedInvoice.amount))}
            </span>
          </div>
          {correctedInvoice.amount < originalInvoice.amount && (
            <p className="text-xs text-purple-700 mt-2">
              Credit memo will be issued for the difference
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-end space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Download PDF
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-[#00FF94] rounded-lg hover:bg-[#00e085] transition-colors shadow-sm">
          Send to Customer
        </button>
      </div>
    </div>
  );
}