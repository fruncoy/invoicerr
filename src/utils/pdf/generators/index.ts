import { generateInvoicePDF } from './invoice';
import { generateQuotationPDF } from './quotation';
import { generateReceiptPDF } from './receipt';
import type { PDFGeneratorOptions } from '../types';

export function generatePDF({ document, items }: PDFGeneratorOptions) {
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