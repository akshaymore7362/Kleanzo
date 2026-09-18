import {
  validateScopeBeforeBooking,
  validateInspectionBeforeCleaning,
  validateQcBeforeHandover,
  validateApprovalBeforeClosure,
} from '../../src/lib/booking/workflow-engine';

describe('Kleanzo 4 Golden Rules Workflow Engine Tests', () => {
  test('GOLDEN RULE 1: NO SCOPE = NO BOOKING (Rejects booking without defined scope)', async () => {
    // Calling validation on un-scoped booking must throw Golden Rule 1 exception
    await expect(validateScopeBeforeBooking('invalid_unscoped_id')).rejects.toThrow();
  });

  test('GOLDEN RULE 2: NO INSPECTION = NO CLEANING (Rejects cleaning transition without site inspection)', async () => {
    await expect(validateInspectionBeforeCleaning('invalid_uninspected_id')).rejects.toThrow();
  });

  test('GOLDEN RULE 3: NO QC = NO HANDOVER (Rejects handover without supervisor QC pass)', async () => {
    await expect(validateQcBeforeHandover('invalid_unqced_id')).rejects.toThrow();
  });

  test('GOLDEN RULE 4: NO APPROVAL = NO CLOSURE (Rejects closure without customer approval)', async () => {
    await expect(validateApprovalBeforeClosure('invalid_unapproved_id')).rejects.toThrow();
  });
});
