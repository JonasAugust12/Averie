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
        icon: {
            type: String,
            trim: true,
            maxlength: 64,
            default: null,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 64,
        },
        subtitle: {
            type: String,
            trim: true,
            default: '',
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        note: {
            type: String,
            trim: true,
            default: '',
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: 'service_categories',
    },
);

ServiceCategorySchema.index({ sortOrder: 1 });
ServiceCategorySchema.index({ slug: 1 }, { unique: true });
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
