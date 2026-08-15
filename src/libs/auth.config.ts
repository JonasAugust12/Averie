import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@libs/mongodb';
import { User } from '@models/user.model';
import type { UserRole } from '@typings/salon/common.type';
import { loginSchema } from '@validations/auth.schema';

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

                try {
                    await connectToDatabase();
                    const user = await User.findOne({ email: email.toLowerCase() })
                        .select('+passwordHash')
                        .lean();

                    if (!user?.passwordHash || !user.isActive) {
                        return null;
                    }

                    const valid = await bcrypt.compare(password, user.passwordHash);
                    if (!valid) {
                        return null;
                    }

                    return {
                        id: String(user._id),
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`.trim(),
                        role: user.role,
                    };
                } catch (error) {
                    console.error('[authorize]', error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
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
