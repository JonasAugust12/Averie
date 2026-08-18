import NextAuth from 'next-auth';
import { authConfig } from '@libs/auth.config';
import { credentialsProvider } from '@libs/auth.providers';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [credentialsProvider],
});
