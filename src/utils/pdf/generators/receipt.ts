import { jsPDF } from 'jspdf';
import type { PDFGeneratorOptions } from '../types';
import { formatCurrency } from '../../currency';
import { formatDate } from '../../date';

export function generateReceiptPDF({ document, items }: PDFGeneratorOptions) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  let yPos = margin;

  // Header
  pdf.setFontSize(24);
  pdf.text('RECEIPT', pageWidth/2, yPos + 10, { align: 'center' });
  yPos += 30;

  const colWidth = (pageWidth - (margin * 2)) / 2;
  const leftX = margin;
  const rightX = margin + colWidth + 10;

  // Left Column
  pdf.setFontSize(12);
  
  // Date
  pdf.text('Date', leftX, yPos);
  pdf.setLineWidth(0.1);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(leftX, yPos + 5, leftX + colWidth, yPos + 5);
  pdf.setFontSize(10);
  pdf.text(formatDate(document.created_at), leftX, yPos + 15);
  yPos += 30;

  // Received From
  pdf.setFontSize(12);
  pdf.text('Received From', leftX, yPos);
  pdf.line(leftX, yPos + 5, leftX + colWidth, yPos + 5);
  pdf.setFontSize(10);
  pdf.text(document.client_name, leftX, yPos + 15);
  yPos += 30;

  // Amount
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  pdf.setFontSize(12);
  pdf.text('Amount', leftX, yPos);
  pdf.line(leftX, yPos + 5, leftX + colWidth, yPos + 5);
  pdf.setFontSize(10);
  pdf.text(formatCurrency(totalAmount, document.currency), leftX, yPos + 15);
  yPos += 30;

  // For
  pdf.setFontSize(12);
  pdf.text('For', leftX, yPos);
  pdf.line(leftX, yPos + 5, leftX + colWidth, yPos + 5);
  pdf.setFontSize(10);
  let serviceYPos = yPos + 15;
  items.forEach(item => {
    pdf.text(
      `${item.vehicle_type} (${formatDate(item.from_date)} - ${formatDate(item.to_date)})`,
      leftX,
      serviceYPos
    );
    serviceYPos += 10;
  });
  yPos = Math.max(yPos + 30, serviceYPos);

  // Received By
  pdf.setFontSize(12);
  pdf.text('Received By', leftX, yPos);
  pdf.line(leftX, yPos + 5, leftX + colWidth, yPos + 5);
  pdf.setFontSize(10);
  if (document.received_by) {
    pdf.text(document.received_by, leftX, yPos + 15);
  }

  // Right Column
  yPos = margin + 30;

  // Receipt Number
  pdf.setFontSize(12);
  pdf.text('Receipt No.', rightX, yPos);
  pdf.line(rightX, yPos + 5, rightX + colWidth, yPos + 5);
  pdf.setFontSize(10);
  pdf.text(document.id, rightX, yPos + 15);
  yPos += 40;

  // Payment Method
  pdf.setFontSize(12);
  pdf.text('Paid By', rightX, yPos);
  yPos += 20;

  ['Cash', 'Cheque', 'M-PESA', 'Bank'].forEach((method, index) => {
    // Checkbox
    pdf.rect(rightX, yPos + (index * 15) - 4, 4, 4);
    if (document.payment_mode?.toLowerCase() === method.toLowerCase()) {
      pdf.text('✓', rightX + 1, yPos + (index * 15));
    }
    
    // Method label
    pdf.text(method, rightX + 10, yPos + (index * 15));
    
    // Reference number if applicable
    if (document.payment_mode?.toLowerCase() === method.toLowerCase() && document.payment_reference) {
      pdf.text(`(${document.payment_reference})`, rightX + 50, yPos + (index * 15));
    }
  });
  yPos += 80;

  // Balance Section
  pdf.line(rightX, yPos, rightX + colWidth, yPos);
  pdf.text('Current Balance:', rightX, yPos + 15);
  pdf.text(
    formatCurrency(document.balance || 0, document.currency),
    rightX + colWidth - 20,
    yPos + 15,
    { align: 'right' }
  );
  
  pdf.text('Payment Amount:', rightX, yPos + 30);
  pdf.text(
    formatCurrency(totalAmount, document.currency),
    rightX + colWidth - 20,
    yPos + 30,
    { align: 'right' }
  );
  
  pdf.text('Balance Due:', rightX, yPos + 45);
  pdf.text(
    formatCurrency(document.balance || 0, document.currency),
    rightX + colWidth - 20,
    yPos + 45,
    { align: 'right' }
  );

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(
    'This is a computer-generated receipt.',
    pageWidth/2,
    pdf.internal.pageSize.height - 20,
    { align: 'center' }
  );

  return pdf;
}