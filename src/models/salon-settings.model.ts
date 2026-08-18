import { Schema, models, model, type InferSchemaType, type Model } from 'mongoose';

const DayOffSchema = new Schema(
    {
        date: { type: String, required: true, trim: true },
        scope: {
            type: String,
            required: true,
            enum: ['full', 'morning', 'afternoon', 'evening'],
        },
    },
    { _id: true },
);

const PeriodSlotsSchema = new Schema(
    {
        morning: { type: [String], default: [] },
        afternoon: { type: [String], default: [] },
        evening: { type: [String], default: [] },
    },
    { _id: false },
);

const WeekdayScheduleSchema = new Schema(
    {
        weekday: { type: Number, required: true, min: 0, max: 6 },
        isOpen: { type: Boolean, default: true },
        periodSlots: { type: PeriodSlotsSchema, default: () => ({}) },
    },
    { _id: false },
);

const PromotionSettingsSchema = new Schema(
    {
        enabled: { type: Boolean, default: false },
        title: { type: String, default: '', trim: true },
        description: { type: String, default: '', trim: true },
        startDate: { type: String, default: null, trim: true },
        endDate: { type: String, default: null, trim: true },
        hideAfterExpiry: { type: Boolean, default: true },
        imageUrl: { type: String, default: null },
        imagePublicId: { type: String, default: null },
        imageWidth: { type: Number, default: null },
        imageHeight: { type: Number, default: null },
    },
    { _id: false },
);

const SalonSettingsSchema = new Schema(
    {
        allowStaffSelection: {
            type: Boolean,
            default: true,
        },
        allowGuestLanguageSwitch: {
            type: Boolean,
            default: true,
        },
        weekdaySchedules: {
            type: [WeekdayScheduleSchema],
            default: [],
        },
        dayOffs: {
            type: [DayOffSchema],
            default: [],
        },
        promotion: {
            type: PromotionSettingsSchema,
            default: () => ({}),
        },
    },
    {
        timestamps: { createdAt: false, updatedAt: true },
        collection: 'salon_settings',
    },
);

export type SalonSettingsDocument = InferSchemaType<typeof SalonSettingsSchema> & {
    _id: Schema.Types.ObjectId;
};

export const SalonSettings: Model<SalonSettingsDocument> =
    (models.SalonSettings as Model<SalonSettingsDocument> | undefined) ??
    model<SalonSettingsDocument>('SalonSettings', SalonSettingsSchema);
