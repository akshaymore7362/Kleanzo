import { loginAction } from '../src/actions/auth-actions';

async function testLogins() {
  console.log('Testing loginAction for seeded accounts...\n');

  const testAccounts = [
    { name: 'Admin', email: 'admin@kleanzo.com', pass: 'admin123' },
    { name: 'Agency Partner', email: 'pune.agency@kleanzo.com', pass: 'agency123' },
    { name: 'Customer', email: 'rahul.sharma@example.com', pass: 'customer123' },
  ];

  for (const acc of testAccounts) {
    const res = await loginAction({ emailOrPhone: acc.email, password: acc.pass });
    if (res.success) {
      console.log(`✅ [${acc.name}] LOGIN SUCCESS! Role: ${res.role} -> Redirect: ${res.redirectUrl}`);
    } else {
      console.error(`❌ [${acc.name}] LOGIN FAILED: ${res.error}`);
    }
  }
}

testLogins().catch(console.error);
