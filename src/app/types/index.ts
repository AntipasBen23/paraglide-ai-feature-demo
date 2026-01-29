export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  poNumber?: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  status: 'pending' | 'disputed' | 'resolved' | 'paid';
}

export interface Dispute {
  id: string;
  invoiceId: string;
  customerEmail: string;
  subject: string;
  message: string;
  timestamp: string;
  disputeType: 'missing_po' | 'pricing_error' | 'quantity_mismatch' | 'missing_document';
  status: 'open' | 'analyzing' | 'resolving' | 'resolved';
  aiAnalysis?: string;
  resolution?: {
    action: string;
    changes: string[];
    correctedInvoice?: Invoice;
  };
}

export interface ResolutionStep {
  step: string;
  status: 'pending' | 'in-progress' | 'complete';
  detail?: string;
}

export interface AIThought {
  text: string;
  timestamp: number;
}