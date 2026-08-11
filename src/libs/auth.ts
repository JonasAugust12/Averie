import NextAuth from 'next-auth';
import { authConfig } from '@libs/auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
