import * as crypto from 'crypto';

export function generateHashString(password: string, salt: string): string {
  return crypto.createHmac('sha512', salt).update(password).digest('hex');
}
