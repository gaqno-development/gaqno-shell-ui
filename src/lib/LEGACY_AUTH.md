# Legacy Auth File

`src/lib/auth.ts` contains Next.js-specific code using `NextRequest` from `next/server`.

## Status

This file is **NOT USED** in the Vite SPA migration. It was only used by Next.js API routes which are no longer available in Vite.

## Functions

- `verifyJWT()` - Can be kept if needed for client-side JWT verification
- `getAccessToken(request: NextRequest)` - Next.js specific, not needed
- `getRefreshToken(request: NextRequest)` - Next.js specific, not needed  
- `getUserFromRequest(request: NextRequest)` - Next.js specific, not needed

## Recommendation

This file can be safely removed or kept for reference. If JWT verification is needed client-side, use the `verifyJWT` function without Next.js dependencies.

