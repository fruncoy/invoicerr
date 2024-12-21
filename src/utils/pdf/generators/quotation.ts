import { jsPDF } from 'jspdf';
import type { PDFGeneratorOptions } from '../types';
import { formatCurrency } from '../../currency';
import { formatDate } from '../../date';
import { getLayoutConfig, getYPosition } from '../components/layout';
import { addCompanyHeader } from '../components/header';

export function generateQuotationPDF({ document, items }: PDFGeneratorOptions) {
  const pdf = new jsPDF();
  const { margin, pageWidth } = getLayoutConfig(pdf);
  let yPos = margin;

  // Add header
  addCompanyHeader(pdf);
  yPos = getYPosition(yPos, 50);

  // Document Box
  pdf.setDrawColor(254, 223, 202);
  pdf.setFillColor(255, 244, 238);
  pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 40, 3, 3, 'FD');

  pdf.setTextColor(255, 119, 31);
  pdf.setFontSize(20);
  pdf.text('QUOTATION', margin + 10, yPos + 15);

  pdf.setTextColor(0);
  pdf.setFontSize(12);
  pdf.text(document.client_name, margin + 10, yPos + 25);
  pdf.setFontSize(10);
  pdf.text(`Quotation Date: ${formatDate(document.created_at)}`, margin + 10, yPos + 32);
  if (document.due_date) {
    pdf.text(`Valid Until: ${formatDate(document.due_date)}`, margin + 10, yPos + 38);
  }

  yPos = getYPosition(yPos, 50);

  // Items Table
  const tableData = items.map((item, index) => [
    index + 1,
    {
      content: [
        { text: item.vehicle_type, styles: { textColor: [0, 166, 81], fontStyle: 'bold' } },
        { text: `${formatDate(item.from_date)} - ${formatDate(item.to_date)}`, fontSize: 8 },
        item.additional_info ? { text: item.additional_info, fontSize: 9, textColor: [100, 100, 100] } : ''
      ]
    },
    item.quantity,
    formatCurrency(item.price, document.currency),
    formatCurrency(item.quantity * item.price, document.currency)
  ]);

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  (pdf as any).autoTable({
    startY: yPos,
    head: [['#', 'Service Details', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    foot: [[
      '',
      { content: 'Total:', styles: { halign: 'right', fontStyle: 'bold' } },
      '',
      '',
      { content: formatCurrency(totalAmount, document.currency), styles: { fontStyle: 'bold' } }
    ]],
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
    footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 40, halign: 'right' },
      4: { cellWidth: 40, halign: 'right' }
    }
  });

  yPos = (pdf as any).lastAutoTable.finalY + 20;

  // Footer
  pdf.setDrawColor(229, 231, 235);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 40, 3, 3, 'FD');

  pdf.setTextColor(0);
  pdf.setFontSize(14);
  pdf.text('Thank You for Considering Our Services!', pageWidth/2, yPos + 15, { align: 'center' });
  
  pdf.setTextColor(100);
  pdf.setFontSize(10);
  pdf.text(
    'If you have any questions, please contact us at info@ladinatravelsafaris.com',
    pageWidth/2,
    yPos + 25,
    { align: 'center' }
  );

  return pdf;
}