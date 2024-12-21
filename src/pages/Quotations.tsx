import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CurrencySelector } from '../components/forms/CurrencySelector';
import { InlineVehicleTable } from '../components/forms/vehicle/InlineVehicleTable';
import { PreviewModal } from '../components/previews/PreviewModal';
import { Input } from '../components/ui/Input';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Document, VehicleItem } from '../types';

export function Quotations() {
  const { id } = useParams();
  const { documents, items: allItems, saveDocument, saveItems } = useLocalStorage();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Get existing quotation if editing
  const existingDocument = id ? documents.find(doc => doc.id === id) : null;
  const existingItems = id ? allItems[id] || [] : [];

  const [currency, setCurrency] = useState<'KSH' | 'USD'>(existingDocument?.currency || 'KSH');
  const [clientName, setClientName] = useState(existingDocument?.client_name || '');
  const [quotationDate, setQuotationDate] = useState(
    existingDocument?.created_at 
      ? new Date(existingDocument.created_at).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [validUntil, setValidUntil] = useState(existingDocument?.due_date || '');
  const [items, setItems] = useState<VehicleItem[]>(existingItems);

  const handleAddItem = (item: Omit<VehicleItem, 'id'>) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setItems(prev => [...prev, newItem]);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handlePreview = () => {
    const documentData: Document = {
      id: id || crypto.randomUUID(),
      type: 'quotation',
      client_name: clientName,
      created_at: quotationDate,
      currency,
      due_date: validUntil,
      total_amount: items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    };

    // Save document and items
    saveDocument(documentData);
    saveItems(documentData.id, items);

    // Open preview modal
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#2B372A] pb-20">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">
          {id ? 'Edit Quotation' : 'Create Quotation'}
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Client Details</h2>
            <div className="space-y-4">
              <Input 
                label="Client Name" 
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="input-groove" 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  type="date" 
                  label="Quotation Date"
                  value={quotationDate}
                  onChange={e => setQuotationDate(e.target.value)}
                  className="input-groove"
                />
                <Input 
                  type="date" 
                  label="Valid Until (Optional)"
                  value={validUntil}
                  onChange={e => setValidUntil(e.target.value)}
                  className="input-groove"
                />
              </div>
            </div>
          </div>

          <InlineVehicleTable
            items={items}
            currency={currency}
            onAddItem={handleAddItem}
            onDeleteItem={handleDeleteItem}
            onPreview={handlePreview}
          />
        </div>
      </div>

      {isPreviewOpen && (
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          document={{
            id: id || crypto.randomUUID(),
            type: 'quotation',
            client_name: clientName,
            created_at: quotationDate,
            currency,
            due_date: validUntil,
            total_amount: items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
          }}
          items={items}
          allowEdit={false}
        />
      )}
    </div>
  );
}