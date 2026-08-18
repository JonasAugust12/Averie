import NextAuth from 'next-auth';
import { authConfig } from '@libs/auth.config';

/** Middleware-only Auth.js client — edge-safe config, no DB providers. */
export const { auth } = NextAuth(authConfig);
