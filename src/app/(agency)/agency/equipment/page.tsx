import React from 'react';
import AgencyEquipmentClientView from './AgencyEquipmentClientView';

export const metadata = {
  title: 'Agency Equipment Inventory & Tagging | Kleanzo',
  description: 'Track agency equipment inventory, status, maintenance, and job assignment tagging.',
};

export default function AgencyEquipmentPage() {
  return <AgencyEquipmentClientView />;
}
