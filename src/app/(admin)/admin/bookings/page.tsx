'use server';

import { getAdminRealDataAction } from '@/actions/admin-actions';
import AdminBookingsListClientView from './AdminBookingsListClientView';

export default async function AdminBookingsPage() {
  const res = await getAdminRealDataAction();
  const bookings = res.success && res.realData ? res.realData.bookings : [];
  const stats = res.success && res.realData ? res.realData.stats : {};

  return <AdminBookingsListClientView bookings={bookings} stats={stats} />;
}
