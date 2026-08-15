import { Schema, models, model, type InferSchemaType, type Model } from 'mongoose';

const StaffProfileSchema = new Schema(
    {
        color: { type: String, trim: true },
        initials: { type: String, trim: true, maxlength: 4 },
    },
    { _id: false },
);

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'staff'],
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        note: {
            type: String,
            trim: true,
        },
        specialties: {
            type: [String],
            default: [],
        },
        visible: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        staffProfile: {
            type: StaffProfileSchema,
        },
    },
    {
        timestamps: true,
        collection: 'users',
    },
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, visible: 1 });

export type UserDocument = InferSchemaType<typeof UserSchema> & {
    _id: Schema.Types.ObjectId;
};

export const User: Model<UserDocument> =
    (models.User as Model<UserDocument> | undefined) ?? model<UserDocument>('User', UserSchema);
