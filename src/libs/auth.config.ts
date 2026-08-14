import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '@validations/auth.schema';

/**
 * Auth.js (next-auth v5) — local Credentials scaffold.
 *
 * TODO later:
 * - Verify password against MongoDB User model (bcrypt)
 * - Add OAuth providers if needed
 * - Wire protected routes via middleware
 */
export const authConfig = {
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsed = loginSchema.safeParse(credentials);
                if (!parsed.success) {
                    return null;
                }

                const { email, password } = parsed.data;

                // Stub local user — replace with DB lookup later.
                if (email === 'demo@averie.local' && password === 'password') {
                    return {
                        id: 'demo-user',
                        email,
                        name: 'Demo User',
                    };
                }

                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        // Add custom pages later, e.g. signIn: '/login'
    },
    callbacks: {
        jwt({ token, user }) {
            if (user?.id) {
                token.id = String(user.id);
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && typeof token.id === 'string') {
                session.user.id = token.id;
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
