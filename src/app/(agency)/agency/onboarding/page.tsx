import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import OnboardingWizard from '@/components/agency/OnboardingWizard';

export default async function AgencyOnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO'].includes(user.role)) redirect('/');
  if (!user.agencyId) redirect('/');

  const agency = await prisma.agency.findUnique({
    where: { id: user.agencyId },
    include: { documents: true, serviceAreas: true, services: { include: { service: true } } },
  });

  if (!agency) redirect('/');

  // Already active partner — no need to onboard again.
  if (agency.partnerStatus === 'ACTIVE') {
    redirect('/agency/dashboard');
  }

  const services = await prisma.service.findMany({ where: { active: true }, select: { slug: true, name: true } });

  return (
    <OnboardingWizard
      initialAgency={JSON.parse(JSON.stringify(agency))}
      services={services}
    />
  );
}
