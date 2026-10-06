import React from 'react';
import AgencyEarningsClientView from './AgencyEarningsClientView';

export const metadata = {
  title: 'Agency Earnings & Payout Ledger | Kleanzo',
  description: 'View agency gross earnings, commission deductions, penalty adjustments, and payout bank records.',
};

export default function AgencyEarningsPage() {
  return <AgencyEarningsClientView />;
}
