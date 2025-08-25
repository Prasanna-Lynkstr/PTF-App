import crypto from 'crypto';

export function generateApiKey(): string {
  return crypto.randomBytes(24).toString('hex'); // 48-char API key
}