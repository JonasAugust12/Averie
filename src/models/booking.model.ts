import { Schema, models, model, type InferSchemaType, type Model } from 'mongoose';

const BookingCustomerSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, trim: true, lowercase: true },
        note: { type: String, trim: true },
    },
    { _id: false },
);

const BookingSchema = new Schema(
    {
        reference: {
            type: String,
            required: true,
            trim: true,
        },
        serviceIds: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
            required: true,
            validate: {
                validator: (v: unknown[]) => Array.isArray(v) && v.length > 0,
                message: 'At least one service is required',
            },
        },
        staffPreference: {
            type: String,
            required: true,
            enum: ['any', 'specific'],
        },
        staffId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        date: {
            type: String,
            required: true,
            trim: true,
        },
        time: {
            type: String,
            required: true,
            trim: true,
        },
        totalEstimatedMinutes: {
            type: Number,
            required: true,
            min: 1,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        customer: {
            type: BookingCustomerSchema,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['upcoming', 'cancelled'],
            default: 'upcoming',
        },
        cancelledAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        collection: 'bookings',
    },
);

BookingSchema.index({ reference: 1 }, { unique: true });
BookingSchema.index({ date: 1, time: 1, status: 1 });
BookingSchema.index({ 'customer.phone': 1 });
BookingSchema.index({ createdAt: -1 });
// Unique per exact (date, time, staffId) for specific-staff bookings only.
// 'any' preference allows multiple bookings at the same slot (salon assigns staff).
BookingSchema.index(
    { date: 1, time: 1, staffId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: 'upcoming',
            staffPreference: 'specific',
            staffId: { $exists: true },
        },
    },
);

export type BookingDocument = InferSchemaType<typeof BookingSchema> & {
    _id: Schema.Types.ObjectId;
};

export const Booking: Model<BookingDocument> =
    (models.Booking as Model<BookingDocument> | undefined) ??
    model<BookingDocument>('Booking', BookingSchema);
