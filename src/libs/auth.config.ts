import type { NextAuthConfig } from 'next-auth';
import { readAuthSessionMaxAgeSeconds } from '@libs/auth-session.env';
import type { UserRole } from '@typings/salon-common.type';

/** Edge-safe Auth.js config (no DB / Node-only imports). Providers live in auth.providers.ts. */
export const authConfig = {
    providers: [],
    session: {
        strategy: 'jwt',
        maxAge: readAuthSessionMaxAgeSeconds(),
    },
    pages: {},
    callbacks: {
        jwt({ token, user }) {
            if (user?.id) {
                token.id = String(user.id);
            }
            if (user && 'role' in user && user.role) {
                token.role = user.role as UserRole;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && typeof token.id === 'string') {
                session.user.id = token.id;
            }
            if (session.user && typeof token.role === 'string') {
                session.user.role = token.role as UserRole;
            }
            return session;
        },
    },
    secret:
        process.env.NEXTAUTH_SECRET ||
        process.env.AUTH_SECRET ||
        'averie-dev-secret-key-32-chars-long-quiet-luxury',
    trustHost: true,
} satisfies NextAuthConfig;
