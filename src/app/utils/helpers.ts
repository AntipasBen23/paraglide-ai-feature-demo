export const formatCurrency = (amount: number): string => {
  return new Locale String('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(timestamp);
};

export const getDisputeTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    missing_po: 'Missing PO Number',
    pricing_error: 'Pricing Error',
    quantity_mismatch: 'Quantity Mismatch',
    missing_document: 'Missing Document',
  };
  return labels[type] || type;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    open: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    analyzing: 'bg-blue-100 text-blue-800 border-blue-200',
    resolving: 'bg-purple-100 text-purple-800 border-purple-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-gray-100 text-gray-800 border-gray-200',
    disputed: 'bg-red-100 text-red-800 border-red-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const simulateTyping = async (
  text: string,
  onUpdate: (partial: string) => void,
  speed: number = 30
): Promise<void> => {
  let current = '';
  for (let i = 0; i < text.length; i++) {
    current += text[i];
    onUpdate(current);
    await sleep(speed);
  }
};