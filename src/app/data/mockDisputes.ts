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

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2024-001',
    customerName: 'Acme Corp',
    amount: 15000,
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    lineItems: [
      {
        description: 'Software License - Annual',
        quantity: 10,
        unitPrice: 1500,
        total: 15000
      }
    ],
    status: 'disputed'
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2024-002',
    customerName: 'TechStart Inc',
    amount: 8500,
    issueDate: '2024-01-20',
    dueDate: '2024-02-20',
    poNumber: 'PO-2024-456',
    lineItems: [
      {
        description: 'Consulting Services',
        quantity: 40,
        unitPrice: 200,
        total: 8000
      },
      {
        description: 'Travel Expenses',
        quantity: 1,
        unitPrice: 500,
        total: 500
      }
    ],
    status: 'disputed'
  },
  {
    id: 'INV-003',
    invoiceNumber: 'INV-2024-003',
    customerName: 'Global Logistics Ltd',
    amount: 24500,
    issueDate: '2024-01-18',
    dueDate: '2024-02-18',
    poNumber: 'PO-2024-789',
    lineItems: [
      {
        description: 'Enterprise Plan - Q1',
        quantity: 1,
        unitPrice: 25000,
        total: 25000
      }
    ],
    status: 'disputed'
  }
];

export const mockDisputes: Dispute[] = [
  {
    id: 'DISP-001',
    invoiceId: 'INV-001',
    customerEmail: 'ap@acmecorp.com',
    subject: 'Invoice INV-2024-001 - Missing PO Number',
    message: 'Hi, we cannot process this invoice without a PO number. Our system requires all invoices to have a valid PO reference. Can you please provide the PO number for this order?',
    timestamp: '2024-01-29T10:30:00Z',
    disputeType: 'missing_po',
    status: 'open'
  },
  {
    id: 'DISP-002',
    invoiceId: 'INV-002',
    customerEmail: 'finance@techstart.com',
    subject: 'Re: Invoice INV-2024-002 - Pricing Discrepancy',
    message: 'Hello, according to our contract signed on Dec 15, 2023, the consulting rate should be $175/hour, not $200/hour. The agreed rate was part of our annual agreement. Please review and correct.',
    timestamp: '2024-01-29T11:15:00Z',
    disputeType: 'pricing_error',
    status: 'open'
  },
  {
    id: 'DISP-003',
    invoiceId: 'INV-003',
    customerEmail: 'billing@globallogistics.com',
    subject: 'Invoice INV-2024-003 - Wrong Amount',
    message: 'We ordered the Standard Plan at $20,000, not the Enterprise Plan. Please check your records and send a corrected invoice with the right pricing tier.',
    timestamp: '2024-01-29T09:45:00Z',
    disputeType: 'pricing_error',
    status: 'open'
  }
];

// Mock resolution data that will be "generated" by the AI
export const mockResolutions: Record<string, any> = {
  'DISP-001': {
    action: 'Retrieved PO number from internal order management system',
    changes: [
      'Added PO Number: PO-2024-123',
      'Updated invoice metadata',
      'Regenerated PDF with PO reference'
    ],
    correctedInvoice: {
      ...mockInvoices[0],
      poNumber: 'PO-2024-123',
      status: 'resolved' as const
    },
    aiAnalysis: 'Customer requires PO number for AP processing. Located matching purchase order PO-2024-123 in system dated Jan 10, 2024 for 10 software licenses at $1,500 each. PO amount matches invoice total.'
  },
  'DISP-002': {
    action: 'Verified contract pricing and recalculated invoice',
    changes: [
      'Updated hourly rate: $200 → $175',
      'Recalculated total: 40 hours × $175 = $7,000',
      'New invoice total: $7,500 (including travel)',
      'Generated credit memo for $1,000 difference'
    ],
    correctedInvoice: {
      ...mockInvoices[1],
      amount: 7500,
      lineItems: [
        {
          description: 'Consulting Services',
          quantity: 40,
          unitPrice: 175,
          total: 7000
        },
        {
          description: 'Travel Expenses',
          quantity: 1,
          unitPrice: 500,
          total: 500
        }
      ],
      status: 'resolved' as const
    },
    aiAnalysis: 'Contract review confirms customer is correct. Annual Services Agreement dated Dec 15, 2023 specifies consulting rate of $175/hour. Current invoice incorrectly billed at $200/hour. Overage: $1,000.'
  },
  'DISP-003': {
    action: 'Verified purchase order and corrected pricing tier',
    changes: [
      'Corrected plan: Enterprise → Standard',
      'Updated pricing: $25,000 → $20,000',
      'Generated credit memo for $5,000',
      'Updated customer subscription tier in system'
    ],
    correctedInvoice: {
      ...mockInvoices[2],
      amount: 20000,
      lineItems: [
        {
          description: 'Standard Plan - Q1',
          quantity: 1,
          unitPrice: 20000,
          total: 20000
        }
      ],
      status: 'resolved' as const
    },
    aiAnalysis: 'Purchase order PO-2024-789 dated Jan 5, 2024 confirms order for Standard Plan at $20,000. Invoice incorrectly reflects Enterprise Plan pricing. Customer claim verified.'
  }
};