import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(plainTextPassword: string): Promise<string> {
  return await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}