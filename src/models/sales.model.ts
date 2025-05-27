// this model will contain the customer purchases ,item purchased, quantity , amount purchases

import mongoose, { Document, model, Schema } from "mongoose";

export interface ISales extends Document {
    customer: mongoose.Types.ObjectId,
    itemPurchased: mongoose.Types.ObjectId,
    quantityPurchased: number,
    totalAmount: number
}

const salesSchema = new Schema<ISales>({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    itemPurchased: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantityPurchased: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
})
const Sales = model<ISales>("Sales", salesSchema);

export default Sales;