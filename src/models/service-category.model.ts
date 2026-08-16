import { Schema, models, model, type InferSchemaType, type Model } from 'mongoose';

const ServiceCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        sortOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        collection: 'service_categories',
    },
);

ServiceCategorySchema.index({ sortOrder: 1 });
ServiceCategorySchema.index(
    { name: 1 },
    { unique: true, collation: { locale: 'en', strength: 2 } },
);

export type ServiceCategoryDocument = InferSchemaType<typeof ServiceCategorySchema> & {
    _id: Schema.Types.ObjectId;
};

export const ServiceCategory: Model<ServiceCategoryDocument> =
    (models.ServiceCategory as Model<ServiceCategoryDocument> | undefined) ??
    model<ServiceCategoryDocument>('ServiceCategory', ServiceCategorySchema);
