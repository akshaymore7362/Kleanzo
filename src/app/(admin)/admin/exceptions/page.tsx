import React from 'react';
import AdminExceptionsClientView from './AdminExceptionsClientView';

export const metadata = {
  title: 'Admin Exceptions & SLA Breach Management | Kleanzo',
  description: 'Manage unassigned dispatches, SLA breaches, crew no-shows, and dispute resolution.',
};

export default function AdminExceptionsPage() {
  return <AdminExceptionsClientView />;
}
