type AsyncValue = unknown | Promise<unknown>;
type TestCase = { name: string; run: () => AsyncValue };

const tests: TestCase[] = [];

function fail(message: string): never {
  throw new Error(message);
}

function expectValue(value: AsyncValue) {
  return {
    toBe(expected: unknown) {
      if (value !== expected) fail(`Expected ${String(value)} to be ${String(expected)}`);
    },
    toBeUndefined() {
      if (value !== undefined) fail(`Expected value to be undefined, received ${String(value)}`);
    },
    toThrow(expected?: string | RegExp) {
      if (typeof value !== 'function') fail('Expected a function for toThrow');
      try {
        (value as () => unknown)();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (expected && !(expected instanceof RegExp ? expected.test(message) : message.includes(expected))) {
          fail(`Expected error ${message} to match ${String(expected)}`);
        }
        return;
      }
      fail('Expected function to throw');
    },
    rejects: {
      async toThrow(expected?: string | RegExp) {
        try {
          await value;
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (expected && !(expected instanceof RegExp ? expected.test(message) : message.includes(expected))) {
            fail(`Expected rejection ${message} to match ${String(expected)}`);
          }
          return;
        }
        fail('Expected promise to reject');
      },
    },
  };
}

(globalThis as Record<string, unknown>).describe = (_name: string, run: () => void) => run();
(globalThis as Record<string, unknown>).test = (name: string, run: () => AsyncValue) => tests.push({ name, run });
(globalThis as Record<string, unknown>).expect = expectValue;

async function run() {
  await import('./unit/golden-rules.test.ts');
  await import('./unit/agency-isolation.test.ts');
  await import('./unit/partner-isolation.test.ts');
  await import('./unit/pricing-engine.test.ts');

  let failures = 0;
  for (const test of tests) {
    try {
      await test.run();
      console.log(`PASS ${test.name}`);
    } catch (error) {
      failures += 1;
      console.error(`FAIL ${test.name}:`, error);
    }
  }

  if (failures > 0) process.exit(1);
  console.log(`${tests.length} tests passed.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});