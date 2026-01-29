import { Dispute } from '../types';
import { formatTimestamp, getDisputeTypeLabel, getStatusColor } from '../utils/helpers';

interface DisputeListProps {
  disputes: Dispute[];
  selectedDispute: Dispute | null;
  onSelectDispute: (dispute: Dispute) => void;
}

export default function DisputeList({ disputes, selectedDispute, onSelectDispute }: DisputeListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Disputes</h2>
        <p className="text-sm text-gray-500 mt-1">{disputes.length} total</p>
      </div>

      <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
        {disputes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No disputes found</p>
          </div>
        ) : (
          disputes.map((dispute) => (
            <button
              key={dispute.id}
              onClick={() => onSelectDispute(dispute)}
              className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${
                selectedDispute?.id === dispute.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {dispute.subject}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dispute.customerEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(dispute.status)}`}>
                  {dispute.status === 'open' && 'Open'}
                  {dispute.status === 'analyzing' && 'Analyzing'}
                  {dispute.status === 'resolving' && 'Resolving'}
                  {dispute.status === 'resolved' && 'Resolved'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(dispute.timestamp)}
                </span>
              </div>

              <div className="mt-2">
                <span className="inline-flex items-center text-xs text-gray-600">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {getDisputeTypeLabel(dispute.disputeType)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}