import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface JWTPayload {
  sub: string;
  email: string;
  tenantId?: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface User {
  id: string;
  email: string;
  tenantId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('[AUTH] JWT_SECRET not configured - authentication will fail');
}

export function verifyJWT(token: string): JWTPayload | null {
  if (!JWT_SECRET) {
    console.error('[AUTH] JWT_SECRET not configured');
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    if (decoded.type !== 'access') {
      console.error('[AUTH] Invalid token type:', decoded.type);
      return null;
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('[AUTH] Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('[AUTH] Invalid token:', error.message);
    } else {
      console.error('[AUTH] Token verification failed:', error);
    }
    return null;
  }
}

export function getAccessToken(request: NextRequest): string | null {
  const accessToken = request.cookies.get('access_token')?.value;
  return accessToken || null;
}

export function getRefreshToken(request: NextRequest): string | null {
  const refreshToken = request.cookies.get('refresh_token')?.value;
  return refreshToken || null;
}

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  const accessToken = getAccessToken(request);
  
  if (!accessToken) {
    return null;
  }

  const payload = verifyJWT(accessToken);
  
  if (!payload) {
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
    tenantId: payload.tenantId,
  };
}

