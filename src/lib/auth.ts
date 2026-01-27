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

