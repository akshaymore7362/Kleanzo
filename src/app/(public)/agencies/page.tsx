import { redirect } from 'next/navigation';

export default function AgenciesPage() {
  // Customers are never exposed to agency directories or listings.
  // Agencies are internal fulfillment partners assigned by Kleanzo Operations after booking.
  redirect('/bookings/new');
}
