import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit/audit-logger';

export interface CalculateSettlementParams {
  bookingId: string;
  agencyId: string;
  customerTotalAmount: number;
  commissionRatePct?: number;
  deductions?: number;
  adjustments?: number;
}

export interface SettlementCalculationResult {
  bookingId: string;
  agencyId: string;
  grossAmount: number;
  kleanzoCommissionAmount: number;
  deductions: number;
  adjustments: number;
  netAgencyPayout: number;
}

export function calculateAgencyPayout(params: CalculateSettlementParams): SettlementCalculationResult {
  const grossAmount = params.customerTotalAmount;
  const commissionRate = params.commissionRatePct ?? 15.0;
  const kleanzoCommissionAmount = Math.round((grossAmount * commissionRate) / 100);
  const deductions = params.deductions ?? 0;
  const adjustments = params.adjustments ?? 0;

  const netAgencyPayout = Math.max(0, grossAmount - kleanzoCommissionAmount - deductions + adjustments);

  return {
    bookingId: params.bookingId,
    agencyId: params.agencyId,
    grossAmount,
    kleanzoCommissionAmount,
    deductions,
    adjustments,
    netAgencyPayout,
  };
}

export async function createSettlementRecord(
  params: CalculateSettlementParams,
  performedBy: string
) {
  const result = calculateAgencyPayout(params);
  const settlementNo = `STL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date();

  return await prisma.$transaction(async (tx) => {
    const settlement = await tx.settlement.create({
      data: {
        settlementNo,
        agencyId: result.agencyId,
        periodStart: now,
        periodEnd: now,
        grossAmount: result.grossAmount,
        kleanzoCommission: result.kleanzoCommissionAmount,
        adjustments: result.adjustments,
        netPayable: result.netAgencyPayout,
        status: 'PENDING',
        items: {
          create: [
            {
              bookingId: result.bookingId,
              bookingAmount: result.grossAmount,
              commission: result.kleanzoCommissionAmount,
              agencyPayout: result.netAgencyPayout,
            },
          ],
        },
      },
    });

    await logAudit({
      action: 'SETTLEMENT_CREATED',
      entityType: 'Settlement',
      entityId: settlement.id,
      performedBy,
      actorType: 'OPERATIONS',
      metadata: { ...result },
    });

    return settlement;
  });
}
