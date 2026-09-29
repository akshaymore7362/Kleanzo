'use server';

import { getAgencyJobsAction } from '@/actions/agency-actions';
import AgencyJobsClientView from './AgencyJobsClientView';

export default async function AgencyJobsPage() {
  const res = await getAgencyJobsAction();
  const bookings = (res.success && res.bookings) ? res.bookings : [];

  return <AgencyJobsClientView bookings={bookings} />;
}
