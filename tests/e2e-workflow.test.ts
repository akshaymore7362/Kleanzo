import { prisma } from '../src/lib/db';
import { setMockTestUser } from '../src/lib/auth/session';
import { 
  createCustomerDirectBookingAction, 
  confirmAdvancePaymentAction 
} from '../src/actions/booking-actions';
import { 
  runAutomaticAssignmentAction, 
  respondToAssignmentOfferAction, 
  adminManualAssignAgencyAction,
  getAssignmentHistoryAction 
} from '../src/actions/assignment-actions';
import { 
  assignAgencyTeamAction, 
  updateJobDayStatusAction, 
  submitAgencyCompletionAction, 
  requestAdditionalWorkAction 
} from '../src/actions/agency-actions';
import { 
  verifyBookingCompletionAdminAction, 
  reviewAdditionalWorkRequestAdminAction 
} from '../src/actions/admin-actions';

async function runE2EWorkflowTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING KLEANZO E2E WORKFLOW & SECTION VERIFICATION');
  console.log('====================================================\n');

  let passedCount = 0;
  let totalCount = 0;

  async function assertTest(name: string, fn: () => Promise<void>) {
    totalCount++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
    }
  }

  // Fetch test agencies and users created by seed
  const agencyA = await prisma.agency.findFirst({ where: { name: { contains: 'ShinePro' } }, include: { crewMembers: true } });
  const agencyB = await prisma.agency.findFirst({ where: { name: { contains: 'CleanMax' } }, include: { crewMembers: true } });

  if (!agencyA || !agencyB) {
    throw new Error('Seed agencies missing! Please ensure seed script has been run.');
  }

  const adminUser = {
    id: 'admin_sys_user',
    email: 'admin@kleanzo.com',
    name: 'Kleanzo Admin',
    role: 'ADMIN' as const,
  };

  const agencyAUser = {
    id: 'shinepro_user',
    email: agencyA.email,
    name: agencyA.name,
    role: 'AGENCY_ADMIN' as const,
    agencyId: agencyA.id,
  };

  let createdBookingId = '';
  let createdBookingCode = '';

  // SCENARIO 1: Customer Booking Creation -> Advance Payment -> Automatic Assignment -> Agency Accepts
  await assertTest('TEST 1: Customer booking -> Advance Payment -> Auto Matching -> Agency Accepts', async () => {
    setMockTestUser(null);

    const bookingRes = await createCustomerDirectBookingAction({
      customerName: 'E2E Test Customer',
      customerPhone: '9988776655',
      customerEmail: 'e2e.test@kleanzo.com',
      propertyType: '3 BHK Apartment',
      city: 'Pune',
      area: 'Baner',
      address: 'Flat 101, Green Meadows, Baner, Pune',
      serviceName: 'Deep Cleaning Service',
      packagePrice: 4499,
      subtotal: 4499,
      gstAmount: 810,
      totalAmount: 5309,
      advanceAmount: 2000,
      balanceAmount: 3309,
      scheduledDate: '2026-10-10',
      scheduledTime: '10:00 AM',
    });

    if (!bookingRes.success || !bookingRes.bookingId) throw new Error('Failed to create customer booking');
    createdBookingId = bookingRes.bookingId;
    createdBookingCode = bookingRes.bookingCode!;

    // Confirm payment which triggers automatic agency matching engine
    const payRes = await confirmAdvancePaymentAction(createdBookingId, 'TXN_TEST_1001');
    if (!payRes.success) throw new Error('Failed to confirm advance payment');
    if (payRes.matching.status !== 'PARTNER_PENDING_ACCEPTANCE') throw new Error(`Expected PARTNER_PENDING_ACCEPTANCE, got ${payRes.matching.status}`);

    // Verify booking updated to PARTNER_PENDING_ACCEPTANCE
    const updated = await prisma.booking.findUnique({ where: { id: createdBookingId }, include: { offers: true } });
    if (!updated || updated.bookingStatus !== 'PARTNER_PENDING_ACCEPTANCE') throw new Error('Booking status mismatch after payment');

    // Agency accepts offer
    const offer = updated.offers[0];
    if (!offer) throw new Error('No offer created for agency');

    const targetAgency = await prisma.agency.findUnique({ where: { id: offer.agencyId } });
    setMockTestUser({
      id: `${targetAgency!.id}_user`,
      email: targetAgency!.email,
      name: targetAgency!.name,
      role: 'AGENCY_ADMIN',
      agencyId: targetAgency!.id,
    });
    const acceptRes = await respondToAssignmentOfferAction(offer.id, offer.agencyId, 'ACCEPTED');
    if (!acceptRes.success || acceptRes.status !== 'PARTNER_ACCEPTED') throw new Error(`Agency failed to accept job: ${acceptRes.error}`);
  });

  // SCENARIO 2: Rejection Fallback -> Automatic reassignment to next eligible agency
  await assertTest('TEST 2: Agency rejects -> Next eligible agency automatically selected', async () => {
    setMockTestUser(null);
    const bookingRes = await createCustomerDirectBookingAction({
      customerName: 'Rejection Test Customer',
      customerPhone: '9988776654',
      city: 'Pune',
      area: 'Baner',
      address: 'Flat 202, Sunshine Apts, Baner',
      serviceName: 'Deep Cleaning Service',
      packagePrice: 4499,
      subtotal: 4499,
      gstAmount: 810,
      totalAmount: 5309,
      advanceAmount: 2000,
      balanceAmount: 3309,
      scheduledDate: '2026-10-11',
      scheduledTime: '02:00 PM',
    });

    if (!bookingRes.success || !bookingRes.bookingId) throw new Error(`Rejection test booking creation failed: ${bookingRes.error}`);
    const bId = bookingRes.bookingId;
    await confirmAdvancePaymentAction(bId, 'TXN_REJECT_TEST');

    const bookingBefore = await prisma.booking.findUnique({ where: { id: bId }, include: { offers: true } });
    const firstOffer = bookingBefore!.offers[0];

    // First agency declines job
    setMockTestUser({
      id: 'agency_decliner',
      email: 'agency.decliner@kleanzo.com',
      name: 'Agency Decliner',
      role: 'AGENCY_ADMIN',
      agencyId: firstOffer.agencyId,
    });

    const rejectRes = await respondToAssignmentOfferAction(firstOffer.id, firstOffer.agencyId, 'REJECTED', 'No Team Available');
    if (!rejectRes.success) throw new Error(`Rejection action failed: ${rejectRes.error}`);

    // Verify next assignment triggered automatically
    const bookingAfter = await prisma.booking.findUnique({ where: { id: bId }, include: { rejections: true, offers: true } });
    if (bookingAfter!.rejections.length !== 1) throw new Error('Rejection history not recorded');
    if (bookingAfter!.agencyId === firstOffer.agencyId) throw new Error('Booking still assigned to rejecting agency');
  });

  // SCENARIO 3: Admin Manual Assignment Override & Assignment History
  await assertTest('TEST 4 & 16: Admin manual assignment override and assignment history tracking', async () => {
    setMockTestUser(null);
    const bookingRes = await createCustomerDirectBookingAction({
      customerName: 'Admin Manual Test',
      customerPhone: '9988776653',
      city: 'Pune',
      area: 'Aundh',
      serviceName: 'Deep Cleaning Service',
      packagePrice: 4499,
      subtotal: 4499,
      gstAmount: 810,
      totalAmount: 5309,
      advanceAmount: 2000,
      balanceAmount: 3309,
      scheduledDate: '2026-10-12',
      scheduledTime: '10:00 AM',
    });

    if (!bookingRes.success || !bookingRes.bookingId) throw new Error(`Booking creation failed: ${bookingRes.error}`);
    const bId = bookingRes.bookingId;

    setMockTestUser(adminUser);
    const adminAssignRes = await adminManualAssignAgencyAction(bId, agencyB.id, 'Admin manual dispatch to CleanMax');
    if (!adminAssignRes.success) throw new Error(`Admin manual assignment failed: ${adminAssignRes.error}`);

    const historyRes = await getAssignmentHistoryAction(bId);
    if (!historyRes.success || historyRes.assignments.length === 0) throw new Error('Failed to retrieve assignment history');
    if (historyRes.assignments[0].agencyId !== agencyB.id) throw new Error('History agency ID mismatch');
  });

  // SCENARIO 4: Team Worker Conflict Validation
  await assertTest('TEST 9: Worker schedule conflict validation', async () => {
    const booked = await prisma.booking.findUnique({ where: { id: createdBookingId } });
    const assignedAgencyId = booked!.agencyId!;
    const assignedAgency = await prisma.agency.findUnique({ where: { id: assignedAgencyId }, include: { crewMembers: true } });

    const leader = await prisma.crewMember.create({
      data: { agencyId: assignedAgencyId, name: `Lead Worker ${Date.now()}`, phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`, role: 'LEAD', active: true }
    });
    const worker = await prisma.crewMember.create({
      data: { agencyId: assignedAgencyId, name: `Crew Worker ${Date.now()}`, phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`, role: 'CLEANER', active: true }
    });
    const workers = [worker.id];

    const assignedUser = {
      id: `${assignedAgencyId}_user`,
      email: assignedAgency!.email,
      name: assignedAgency!.name,
      role: 'AGENCY_ADMIN' as const,
      agencyId: assignedAgencyId,
    };

    setMockTestUser(assignedUser);

    // Assign team to first booking
    const assignRes1 = await assignAgencyTeamAction(createdBookingId, leader.id, workers);
    if (!assignRes1.success) throw new Error(`First team assignment failed: ${assignRes1.error}`);

    // Create second conflicting booking at same date and time
    setMockTestUser(null);
    const b2 = await createCustomerDirectBookingAction({
      customerName: 'Conflicting Booking',
      customerPhone: '9988776652',
      city: 'Pune',
      area: 'Baner',
      serviceName: 'Deep Cleaning Service',
      packagePrice: 4499,
      subtotal: 4499,
      gstAmount: 810,
      totalAmount: 5309,
      advanceAmount: 2000,
      balanceAmount: 3309,
      scheduledDate: '2026-10-10',
      scheduledTime: '10:00 AM',
    });

    await prisma.booking.update({ where: { id: b2.bookingId! }, data: { agencyId: assignedAgencyId, bookingStatus: 'PARTNER_ACCEPTED' } });

    // Attempting to assign same workers to conflicting job must throw error!
    setMockTestUser(assignedUser);
    const assignRes2 = await assignAgencyTeamAction(b2.bookingId!, leader.id, workers);
    if (assignRes2.success) throw new Error('Expected schedule conflict error, but assignment succeeded!');
  });

  // SCENARIO 5: Job Day Progress -> Completion Upload -> Admin Verification -> Payout Eligible
  await assertTest('TEST 10: Completion submission -> Admin verification -> Payout ELIGIBLE', async () => {
    const booked = await prisma.booking.findUnique({ where: { id: createdBookingId } });
    const assignedAgencyId = booked!.agencyId!;
    const assignedAgency = await prisma.agency.findUnique({ where: { id: assignedAgencyId } });

    const assignedUser = {
      id: `${assignedAgencyId}_user`,
      email: assignedAgency!.email,
      name: assignedAgency!.name,
      role: 'AGENCY_ADMIN' as const,
      agencyId: assignedAgencyId,
    };

    setMockTestUser(assignedUser);

    // 1. Update status to ON_THE_WAY & WORK_STARTED
    await updateJobDayStatusAction(createdBookingId, 'ON_THE_WAY');
    await updateJobDayStatusAction(createdBookingId, 'WORK_STARTED');

    // 2. Submit completion proof
    const compRes = await submitAgencyCompletionAction(
      createdBookingId,
      'Full 3 BHK deep cleaning finished with floor buffing and mirror detailing.',
      ['https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80']
    );
    if (!compRes.success) throw new Error(`Completion submission failed: ${compRes.error}`);

    // 3. Admin verifies completion proof
    setMockTestUser(adminUser);
    const verifyRes = await verifyBookingCompletionAdminAction(createdBookingId, 'APPROVE');
    if (!verifyRes.success) throw new Error(`Admin verification failed: ${verifyRes.error}`);

    // 4. Check Payout Record marked ELIGIBLE
    const payout = await prisma.partnerPayout.findFirst({ where: { bookingId: createdBookingId } });
    if (!payout || payout.status !== 'ELIGIBLE') throw new Error('Partner payout record not marked ELIGIBLE');
  });

  // SCENARIO 6: Additional Work Request -> Admin Review -> Total Price Incremented
  await assertTest('TEST 12: Additional work request -> Admin review -> Total price incremented', async () => {
    const booked = await prisma.booking.findUnique({ where: { id: createdBookingId } });
    const assignedAgencyId = booked!.agencyId!;
    const assignedAgency = await prisma.agency.findUnique({ where: { id: assignedAgencyId } });

    const assignedUser = {
      id: `${assignedAgencyId}_user`,
      email: assignedAgency!.email,
      name: assignedAgency!.name,
      role: 'AGENCY_ADMIN' as const,
      agencyId: assignedAgencyId,
    };

    setMockTestUser(assignedUser);
    const addWorkRes = await requestAdditionalWorkAction(
      createdBookingId,
      'Balcony Hard Water Treatment',
      'Heavy limescale buildup requiring specialized descaling gel',
      1200
    );
    if (!addWorkRes.success || !addWorkRes.request) throw new Error(`Additional work request failed: ${addWorkRes.error}`);

    setMockTestUser(adminUser);
    const adminReviewRes = await reviewAdditionalWorkRequestAdminAction(addWorkRes.request.id, 'APPROVE');
    if (!adminReviewRes.success) throw new Error(`Admin review of additional work failed: ${adminReviewRes.error}`);

    const updatedBooking = await prisma.booking.findUnique({ where: { id: createdBookingId } });
    if (updatedBooking!.totalAmount <= 5309) throw new Error('Booking total amount was not updated with additional work charge');
  });

  setMockTestUser(null);
  console.log('\n====================================================');
  console.log(`🎉 ALL E2E TESTS COMPLETED: ${passedCount} / ${totalCount} PASSED`);
  console.log('====================================================');
}

runE2EWorkflowTests().catch(err => {
  console.error('Fatal E2E test execution error:', err);
  process.exit(1);
});
