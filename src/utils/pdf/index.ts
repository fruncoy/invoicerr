import type { Document, VehicleItem } from '../types';
import { generateInvoicePDF } from './generators/invoice';
import { generateQuotationPDF } from './generators/quotation';
import { generateReceiptPDF } from './generators/receipt';

export function generatePDF({ document, items }: { document: Document; items: VehicleItem[] }) {
  switch (document.type) {
    case 'invoice':
      return generateInvoicePDF({ document, items });
    case 'quotation':
      return generateQuotationPDF({ document, items });
    case 'receipt':
      return generateReceiptPDF({ document, items });
    default:
      throw new Error(`Unsupported document type: ${document.type}`);
  }
}