import { Schema, models, model, type InferSchemaType, type Model } from 'mongoose';

const TodoSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export type TodoDocument = InferSchemaType<typeof TodoSchema> & {
    _id: Schema.Types.ObjectId;
};

export const Todo: Model<TodoDocument> =
    (models.Todo as Model<TodoDocument> | undefined) ?? model<TodoDocument>('Todo', TodoSchema);
