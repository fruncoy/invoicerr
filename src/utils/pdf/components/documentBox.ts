import { jsPDF } from 'jspdf';
import { formatDate } from '../../date';
import type { Document } from '../../../types';

export function addDocumentBox(pdf: jsPDF, document: Document) {
  // Box background
  pdf.setDrawColor(254, 223, 202); // #FEDFCA
  pdf.setFillColor(255, 244, 238); // #FFF4EE
  pdf.rect(20, 70, pdf.internal.pageSize.width - 40, 40, 'FD');
  
  // Title
  pdf.setTextColor(255, 119, 31); // #FF771F
  pdf.setFontSize(20);
  pdf.text(document.type.toUpperCase(), 30, 85);
  
  // Details
  pdf.setTextColor(0);
  pdf.setFontSize(12);
  pdf.text(document.client_name, 30, 95);
  pdf.setFontSize(10);
  pdf.text(`${document.type === 'invoice' ? 'Invoice' : 'Quotation'} Date: ${formatDate(document.created_at)}`, 30, 102);
  if (document.due_date) {
    pdf.text(
      `${document.type === 'invoice' ? 'Due Date' : 'Valid Until'}: ${formatDate(document.due_date)}`,
      30,
      108
    );
  }
}