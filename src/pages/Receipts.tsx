import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { PreviewModal } from '../components/previews/PreviewModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Document } from '../types';

export function Receipts() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');
  
  const { documents, items: allItems, saveDocument } = useLocalStorage();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Get existing receipt if editing, or invoice if creating from invoice
  const existingDocument = id 
    ? documents.find(doc => doc.id === id)
    : invoiceId 
      ? documents.find(doc => doc.id === invoiceId)
      : null;

  const invoiceItems = invoiceId ? allItems[invoiceId] || [] : [];

  const [clientName, setClientName] = useState(existingDocument?.client_name || '');
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [amount, setAmount] = useState(
    existingDocument?.total_amount?.toString() || ''
  );
  const [receivedBy, setReceivedBy] = useState(existingDocument?.received_by || '');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'cheque' | 'mpesa' | 'bank'>(
    existingDocument?.payment_mode || 'cash'
  );
  const [paymentReference, setPaymentReference] = useState(
    existingDocument?.payment_reference || ''
  );
  const [balance, setBalance] = useState(existingDocument?.balance?.toString() || '0');

  const handlePreview = () => {
    const documentData: Document = {
      id: id || crypto.randomUUID(),
      type: 'receipt',
      client_name: clientName,
      created_at: receiptDate,
      currency: existingDocument?.currency || 'KSH',
      total_amount: parseFloat(amount) || 0,
      received_by: receivedBy,
      payment_mode: paymentMode,
      payment_reference: paymentReference,
      balance: parseFloat(balance) || 0,
    };

    // Save document
    saveDocument(documentData);

    // Open preview modal
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#2B372A] pb-20">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          {id ? 'Edit Receipt' : 'Create Receipt'}
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="space-y-4">
            <Input
              label="Client Name"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              required
              className="input-groove"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Receipt Date"
                value={receiptDate}
                onChange={e => setReceiptDate(e.target.value)}
                required
                className="input-groove"
              />

              <Input
                type="number"
                label="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
                className="input-groove"
              />
            </div>

            <Input
              label="Received By"
              value={receivedBy}
              onChange={e => setReceivedBy(e.target.value)}
              required
              className="input-groove"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Payment Mode"
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value as typeof paymentMode)}
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'cheque', label: 'Cheque' },
                  { value: 'mpesa', label: 'M-PESA' },
                  { value: 'bank', label: 'Bank Transfer' }
                ]}
                className="input-groove"
              />

              <Input
                label="Payment Reference"
                value={paymentReference}
                onChange={e => setPaymentReference(e.target.value)}
                placeholder="e.g., Cheque number, M-PESA code"
                className="input-groove"
              />
            </div>

            <Input
              type="number"
              label="Balance"
              value={balance}
              onChange={e => setBalance(e.target.value)}
              min="0"
              step="0.01"
              className="input-groove"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handlePreview}>
              Preview Receipt
            </Button>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          document={{
            id: id || crypto.randomUUID(),
            type: 'receipt',
            client_name: clientName,
            created_at: receiptDate,
            currency: existingDocument?.currency || 'KSH',
            total_amount: parseFloat(amount) || 0,
            received_by: receivedBy,
            payment_mode: paymentMode,
            payment_reference: paymentReference,
            balance: parseFloat(balance) || 0,
          }}
          items={invoiceItems}
          allowEdit={false}
        />
      )}
    </div>
  );
}