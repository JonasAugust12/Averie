import { Schema, models, model, type InferSchemaType, type Model } from 'mongoose';

const ServiceSchema = new Schema(
    {
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'ServiceCategory',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            default: '',
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        estimatedMinutes: {
            type: Number,
            required: true,
            min: 1,
        },
        visible: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: 'services',
    },
);

ServiceSchema.index({ categoryId: 1, visible: 1 });

export type ServiceDocument = InferSchemaType<typeof ServiceSchema> & {
    _id: Schema.Types.ObjectId;
};

export const Service: Model<ServiceDocument> =
    (models.Service as Model<ServiceDocument> | undefined) ??
    model<ServiceDocument>('Service', ServiceSchema);
