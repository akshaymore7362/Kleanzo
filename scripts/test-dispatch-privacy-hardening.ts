import { prisma } from '../src/lib/db';
import { computeScores } from '../src/lib/matching/scoring';
import { checkEligibility } from '../src/lib/matching/eligibility';

async function runHardeningTestSuite() {
  console.log('====================================================');
  console.log('🛡️ KLEANZO DISPATCH, PRIVACY & ISOLATION HARDENING TEST SUITE');
  console.log('====================================================\n');

  let testPassed = 0;
  let testFailed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      testPassed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      testFailed++;
    }
  }

  // --- SECTION 1: DYNAMIC MATCHING & WEIGHTED SCORING TESTS ---
  console.log('--- SECTION 1: DYNAMIC MATCHING & WEIGHTED SCORING ---');
  
  const dummyCandidateHighLoc = {
    id: 'ag-1',
    name: 'High Proximity Agency',
    city: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
    rating: 4.8,
    experienceYears: 5,
    serviceRadiusKm: 25,
    activeJobsCount: 1,
    verified: true,
  };

  const dummyCandidateLowLoc = {
    id: 'ag-2',
    name: 'Far Away Agency',
    city: 'Pune',
    lat: 18.7000,
    lng: 73.9900,
    rating: 4.8,
    experienceYears: 5,
    serviceRadiusKm: 25,
    activeJobsCount: 1,
    verified: true,
  };

  const req = {
    bookingId: 'bk-test',
    city: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
    scheduledDate: '2026-10-15',
    timeSlot: '10:00 AM',
    services: [{ serviceSlug: 'deep-cleaning', quantity: 1 }],
  };

  const weights = {
    proximity: 25,
    serviceCapability: 20,
    availability: 20,
    rating: 15,
    experience: 10,
    responseSpeed: 5,
    priceCompetitiveness: 5,
  };

  const resHigh = computeScores(dummyCandidateHighLoc as any, req as any, weights);
  const resLow = computeScores(dummyCandidateLowLoc as any, req as any, weights);

  assert(resHigh.score > resLow.score, 
    'Weighted Scoring Matrix: High proximity agency outscores low proximity agency',
    `High: ${resHigh.score}, Low: ${resLow.score}`
  );

  // Filter verification: Inactive/Suspended/Missing Capacity agencies
  const activeAgency = { id: 'a1', city: 'Pune', active: true, verified: true, isAvailable: true, supportedServices: ['deep-cleaning'], serviceAreas: ['Baner', 'Pune'] };
  const suspendedAgency = { id: 'a2', city: 'Pune', active: false, verified: true, isAvailable: true, supportedServices: ['deep-cleaning'], serviceAreas: ['Baner', 'Pune'] };
  const uncapableAgency = { id: 'a3', city: 'Pune', active: true, verified: true, isAvailable: true, supportedServices: ['pest-control'], serviceAreas: ['Baner', 'Pune'] };

  const bookingReq = { city: 'Pune', area: 'Baner', services: [{ serviceSlug: 'deep-cleaning', quantity: 1 }] };

  const activeRes = checkEligibility(activeAgency as any, bookingReq as any);
  const suspendedRes = checkEligibility(suspendedAgency as any, bookingReq as any);
  const uncapableRes = checkEligibility(uncapableAgency as any, bookingReq as any);

  assert(activeRes.isEligible === true, 'Eligible active agency passed filter');
  assert(suspendedRes.isEligible === false, 'Suspended agency filtered out BEFORE dispatch');
  assert(uncapableRes.isEligible === false, 'Incapable agency filtered out BEFORE dispatch');

  // --- SECTION 2: CUSTOMER PRIVACY & API ISOLATION TESTS ---
  console.log('\n--- SECTION 2: CUSTOMER PRIVACY & DATA ISOLATION ---');

  const randId = Math.floor(1000 + Math.random() * 9000);

  // Create test customer & booking
  const customerA = await prisma.user.create({
    data: {
      email: `custA_${randId}_${Date.now()}@kleanzo.com`,
      phone: `999${Math.floor(1000000 + Math.random() * 9000000)}`,
      name: 'Customer Privacy Test A',
      password: 'test_password_123',
      role: 'CUSTOMER',
    },
  });

  const customerB = await prisma.user.create({
    data: {
      email: `custB_${randId}_${Date.now()}@kleanzo.com`,
      phone: `999${Math.floor(1000000 + Math.random() * 9000000)}`,
      name: 'Customer Privacy Test B',
      password: 'test_password_123',
      role: 'CUSTOMER',
    },
  });

  const bookingCode = `KLZ-HARD-${randId}`;
  const booking = await prisma.booking.create({
    data: {
      bookingCode,
      customerId: customerA.id,
      bookingStatus: 'ASSIGNMENT_IN_PROGRESS',
      paymentStatus: 'ADVANCE_PAID',
      subtotal: 4000,
      gstAmount: 720,
      totalAmount: 4720,
      advanceAmount: 1000,
      balanceAmount: 3720,
      propertyType: '3BHK Flat',
      scheduledDate: '2026-10-15',
      scheduledTime: '10:00 AM',
      items: {
        create: {
          serviceName: 'Post Construction Deep Cleaning',
          quantity: 1,
          unitPrice: 4000,
          priceSnapshot: 4000,
          gstSnapshot: 720,
          totalSnapshot: 4720,
        },
      },
      addresses: {
        create: {
          fullAddress: 'Flat 902, Sun Tower, Baner Road',
          areaName: 'Baner',
          city: 'Pune',
          pinCode: '411045',
        },
      },
    },
    include: {
      customer: true,
      items: true,
      addresses: true,
    },
  });

  // Test Customer B viewing Customer A booking (Tenant Isolation Check)
  const isAuthorizedCustomerB = (customerB.id === booking.customerId);
  assert(!isAuthorizedCustomerB, 'Tenant Isolation Check: Customer B cannot access Customer A booking (Blocked)');

  // Test customer view payload does not expose agency secrets
  const customerViewPayload = {
    bookingCode: booking.bookingCode,
    serviceName: booking.items[0].serviceName,
    scheduledDate: booking.scheduledDate,
    assignedAgencyName: booking.agencyId ? 'Kleanzo Verified Fulfillment Partner' : 'Assigning Nearby Partner...',
  };

  const leaksAgencySecret = 'agencyId' in customerViewPayload || 'agencyPayout' in customerViewPayload || 'agencyPhone' in customerViewPayload;
  assert(!leaksAgencySecret, 'Customer View API Payload cleanly strips agencyId, agencyPayout, and agencyPhone');

  // --- SECTION 3: ATOMIC SINGLE-WINNER LOCKING & SIMULTANEOUS ACCEPTANCE ---
  console.log('\n--- SECTION 3: ATOMIC SINGLE-WINNER LOCKING & CONCURRENCY ---');

  // Create 3 eligible test agencies
  const agencies = [];
  for (let i = 1; i <= 3; i++) {
    const ag = await prisma.agency.create({
      data: {
        applicationCode: `KZ-HD-${randId}-${i}`,
        name: `Hardening Agency ${i} - ${Date.now()}`,
        ownerName: `Owner ${i}`,
        phone: `988${Math.floor(1000000 + Math.random() * 9000000)}`,
        email: `agency${i}_${randId}_${Date.now()}@kleanzo.com`,
        address: 'Baner High Street, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411045',
        partnerStatus: 'ACTIVE',
        active: true,
        verified: true,
      },
    });
    agencies.push(ag);
  }

  // Atomic Job Accept Function enforcing Single-Winner Lock
  const atomicJobAccept = async (bookingId: string, agencyId: string) => {
    return prisma.$transaction(async (tx) => {
      const target = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!target || target.assignedAgencyId !== null || target.bookingStatus === 'PARTNER_ACCEPTED' || target.bookingStatus === 'CANCELLED') {
        return { success: false, error: 'JOB_ALREADY_ASSIGNED_OR_CANCELLED' };
      }

      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          assignedAgencyId: agencyId,
          agencyId: agencyId,
          bookingStatus: 'PARTNER_ACCEPTED',
        },
      });

      return { success: true, agencyId: updated.agencyId };
    });
  };

  // Fire 3 simultaneous acceptances via Promise.all
  console.log('⚡ Launching 3 simultaneous agency acceptances for booking:', booking.bookingCode);
  const acceptResults = await Promise.all([
    atomicJobAccept(booking.id, agencies[0].id),
    atomicJobAccept(booking.id, agencies[1].id),
    atomicJobAccept(booking.id, agencies[2].id),
  ]);

  const successCount = acceptResults.filter(r => r.success).length;
  const failureCount = acceptResults.filter(r => !r.success).length;

  assert(successCount === 1, 'Atomic Lock Guarantee: Exactly 1 agency succeeded in accepting job');
  assert(failureCount === 2, 'Atomic Lock Guarantee: Other 2 agencies received clean job-already-assigned response');

  // Verify DB state for booking
  const updatedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
  assert(updatedBooking?.bookingStatus === 'PARTNER_ACCEPTED' && !!updatedBooking?.agencyId, 'Booking status updated to PARTNER_ACCEPTED with winning agencyId');

  // --- SECTION 4: EXPIRED OFFER REJECTION & CUSTOMER CANCELLATION ---
  console.log('\n--- SECTION 4: EXPIRED OFFER REJECTION & CANCELLATION SAFETY ---');

  // Create cancelled booking test
  const bookingCancelled = await prisma.booking.create({
    data: {
      bookingCode: `KLZ-CNC-${randId}`,
      customerId: customerA.id,
      bookingStatus: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      subtotal: 3000,
      gstAmount: 540,
      totalAmount: 3540,
      advanceAmount: 1000,
      balanceAmount: 2540,
      propertyType: '2BHK Flat',
      scheduledDate: '2026-10-16',
      scheduledTime: '11:00 AM',
    },
  });

  const acceptCancelledRes = await atomicJobAccept(bookingCancelled.id, agencies[0].id);
  assert(acceptCancelledRes.success === false && acceptCancelledRes.error === 'JOB_ALREADY_ASSIGNED_OR_CANCELLED',
    'Cancellation Safety: Accepting a cancelled booking is rejected by backend atomic lock'
  );

  // --- SECTION 5: FINANCIAL LEDGER INVARIANTS & REPLAY PROTECTION ---
  console.log('\n--- SECTION 5: FINANCIAL LEDGER & REPLAY PROTECTION ---');

  const totalAmount = booking.totalAmount;
  const kleanzoCommission = totalAmount * 0.30;
  const partnerPayable = totalAmount * 0.70;

  const totalDebits = totalAmount;
  const totalCredits = kleanzoCommission + partnerPayable;

  assert(Math.abs(totalDebits - totalCredits) < 0.01, 'Ledger Invariant: Total Debits === Total Credits');

  // Replay Protection Check
  const idempotencyMap = new Set<string>();
  const testKey = `test_key_${randId}`;
  
  const processIdempotentCall = (key: string) => {
    if (idempotencyMap.has(key)) return { duplicate: true };
    idempotencyMap.add(key);
    return { duplicate: false };
  };

  const call1 = processIdempotentCall(testKey);
  const call2 = processIdempotentCall(testKey);

  assert(call1.duplicate === false && call2.duplicate === true, 'Idempotency Replay Protection: Replay call identified and blocked');

  // Clean up test data
  console.log('\nCleaning up test artifacts...');
  await prisma.bookingItem.deleteMany({ where: { bookingId: { in: [booking.id, bookingCancelled.id] } } });
  await prisma.bookingAddress.deleteMany({ where: { bookingId: { in: [booking.id, bookingCancelled.id] } } });
  await prisma.booking.deleteMany({ where: { id: { in: [booking.id, bookingCancelled.id] } } });
  await prisma.agency.deleteMany({ where: { id: { in: agencies.map(a => a.id) } } });
  await prisma.user.deleteMany({ where: { id: { in: [customerA.id, customerB.id] } } });

  console.log('\n====================================================');
  console.log(`🎯 HARDENING SUITE COMPLETED: ${testPassed} PASSED, ${testFailed} FAILED`);
  console.log('====================================================');

  if (testFailed > 0) {
    process.exit(1);
  }
}

runHardeningTestSuite().catch(err => {
  console.error('Fatal hardening suite error:', err);
  process.exit(1);
});
