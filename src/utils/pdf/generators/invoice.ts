import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { PDFGeneratorOptions } from '../types';
import { formatCurrency } from '../../currency';
import { formatDate } from '../../date';

export function generateInvoicePDF({ document, items }: PDFGeneratorOptions) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let yPos = margin;

  // Company Header
  const headerHeight = 50;
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text('Kefan Building, Woodavenue Road', margin, yPos);
  pdf.text('(254) 728 309 380', margin, yPos + 5);

  pdf.text('info@ladinatravelsafaris.com', pageWidth - margin, yPos, { align: 'right' });
  pdf.text('ladinatravelsafaris.com', pageWidth - margin, yPos + 5, { align: 'right' });

  yPos += headerHeight;

  // Rest of the code remains the same...
  // (keeping existing code but removing the try-catch for logo)

  return pdf;
}