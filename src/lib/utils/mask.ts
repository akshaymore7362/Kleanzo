// PII masking helpers used across partner-facing agency screens.
// Full PII is only unlocked once a job is accepted (see agency dashboard).

export function maskName(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0];
  const rest = parts.slice(1).map((p) => `${p[0]?.toUpperCase() ?? ''}.`).join(' ');
  return rest ? `${first} ${rest}` : first;
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '••••••••';
  return `••••••${phone.slice(-4)}`;
}

export function maskAccountNumber(acc: string): string {
  if (!acc || acc.length < 4) return '••••••••';
  return `XXXXXXXX${acc.slice(-4)}`;
}

export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length < 4) return '•••• •••• ••••';
  return `XXXX XXXX ${aadhaar.slice(-4)}`;
}

export function maskPan(pan: string): string {
  if (!pan || pan.length < 4) return '••••••••••';
  return `${pan.slice(0, 2)}XXXXX${pan.slice(-3)}`;
}
