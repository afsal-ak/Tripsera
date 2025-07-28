import mongoose, { Schema, model, Document } from "mongoose";
import { IReview } from "@domain/entities/IReview";

type ReviewDocument = IReview & Document;

const ReviewSchema = new Schema<ReviewDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Users", required: true
        },
        packageId: {
            type: Schema.Types.ObjectId,
            ref: "Package",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: { type: String, required: true },
        isBlocked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const ReviewModel = model<ReviewDocument>("Review", ReviewSchema);
