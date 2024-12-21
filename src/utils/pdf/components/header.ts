import { jsPDF } from 'jspdf';

export function addCompanyHeader(pdf: jsPDF) {
  // Left column
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text('Kefan Building, Woodavenue Road', 20, 20);
  pdf.text('(254) 728 309 380', 20, 25);

  // Right column
  pdf.text('info@ladinatravelsafaris.com', pdf.internal.pageSize.width - 20, 20, { align: 'right' });
  pdf.text('ladinatravelsafaris.com', pdf.internal.pageSize.width - 20, 25, { align: 'right' });

  // Skip logo to avoid external URL issues
  // Logo can be added later when a proper asset is available
}