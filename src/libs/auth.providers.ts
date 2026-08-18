import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@libs/mongodb';
import { User } from '@models/user.model';
import { loginSchema } from '@validations/auth.schema';

export const credentialsProvider = Credentials({
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
});
