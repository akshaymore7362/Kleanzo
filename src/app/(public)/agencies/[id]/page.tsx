import { redirect } from 'next/navigation';

export default function AgencyDetailPage() {
  // Customers are never exposed to agency internal profiles.
  redirect('/bookings/new');
}
