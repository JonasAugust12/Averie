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

const SalonSettingsSchema = new Schema(
    {
        allowStaffSelection: {
            type: Boolean,
            default: true,
        },
        workingWeekdays: {
            type: [Number],
            default: [1, 2, 3, 4, 5, 6],
        },
        periodSlots: {
            type: PeriodSlotsSchema,
            default: () => ({
                morning: [],
                afternoon: [],
                evening: [],
            }),
        },
        dayOffs: {
            type: [DayOffSchema],
            default: [],
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
