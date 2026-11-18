import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'go2tek-kurumsal-guvenli-anahtar-2026-x992817'
);

export const AUTH_COOKIE_NAME = 'go2tek_admin_session';

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SALES_STAFF' | 'TECHNICAL_STAFF' | 'FINANCE_STAFF';
}

export function hashPassword(password: string): string {
  return crypto
    .createHmac('sha256', 'go2tek-salt-2026')
    .update(password)
    .digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  const computed = hashPassword(password);
  const a = Buffer.from(computed, 'utf8');
  const b = Buffer.from(hash || '', 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function signAdminToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(SECRET_KEY);
}

export async function verifyAdminToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (!payload.userId || !payload.role) return null;
    return {
      userId: String(payload.userId),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as SessionPayload['role'],
    };
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyAdminToken(token);
  } catch {
    return null;
  }
}
