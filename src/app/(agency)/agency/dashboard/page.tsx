import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import AgencyDashboard from '@/components/agency/AgencyDashboard';

export default async function AgencyDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO'].includes(user.role)) redirect('/');
  if (!user.agencyId) redirect('/');

  const agencyId = user.agencyId;

  const agency = await prisma.agency.findUnique({
    where: { id: agencyId },
    include: { documents: true, serviceAreas: true },
  });
  if (!agency) redirect('/');

  if (agency.partnerStatus === 'DRAFT' || agency.partnerStatus === 'PENDING_ONBOARDING') {
    redirect('/partner/onboarding');
  }

  const [pendingJobs, activeJobs, jobHistory, payouts, crew, settlements] = await Promise.all([
    prisma.job.findMany({
      where: { status: 'PARTNER_PENDING_ACCEPTANCE', OR: [{ agencyId }, { agencyId: null }] },
      include: { booking: { include: { addresses: true, items: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.job.findMany({
      where: { agencyId, status: { in: ['PARTNER_ACCEPTED', 'INSPECTION_COMPLETED', 'CLEANING_IN_PROGRESS', 'CLEANING_COMPLETED', 'QC_PASSED', 'HANDOVER_APPROVED'] } },
      include: { booking: { include: { addresses: true, items: true, siteInspection: true, qualityCheck: true, crewAssignments: { include: { crewMember: true } } } } },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    prisma.job.findMany({
      where: { agencyId, status: 'COMPLETED' },
      include: { booking: true },
      orderBy: { updatedAt: 'desc' },
      take: 30,
    }),
    prisma.partnerPayout.findMany({
      where: { agencyId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.crewMember.findMany({ where: { agencyId }, orderBy: { createdAt: 'desc' } }),
    prisma.settlement.findMany({ where: { agencyId }, orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  return (
    <AgencyDashboard
      currentUser={{ id: user.id, name: user.name, email: user.email, role: user.role }}
      agency={JSON.parse(JSON.stringify(agency))}
      pendingJobs={JSON.parse(JSON.stringify(pendingJobs))}
      activeJobs={JSON.parse(JSON.stringify(activeJobs))}
      jobHistory={JSON.parse(JSON.stringify(jobHistory))}
      payouts={JSON.parse(JSON.stringify(payouts))}
      crew={JSON.parse(JSON.stringify(crew))}
      settlements={JSON.parse(JSON.stringify(settlements))}
    />
  );
}
