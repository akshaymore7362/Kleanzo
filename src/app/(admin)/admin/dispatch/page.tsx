import React from 'react';
import AdminDispatchClientView from './AdminDispatchClientView';

export const metadata = {
  title: 'Admin Master Dispatch Center | Kleanzo',
  description: 'Operational dispatch workspace, job pipeline, 2-level assignment, SLA monitoring, and exception handling.',
};

export default function AdminDispatchPage() {
  return <AdminDispatchClientView />;
}
