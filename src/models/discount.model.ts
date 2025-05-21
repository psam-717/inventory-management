import mongoose, { Document, Schema, model } from "mongoose";

enum DiscountType {
    Seasonal = 'seasonal',
    BulkPurchase = 'bulk_purchase',
    Clearance = 'clearance',
    Membership = 'membership'
}


export interface IDiscount extends Document{
    orderId: mongoose.Types.ObjectId,
    type: DiscountType,
    value: number,
    isPercentage: boolean,
    discountAmount: number

}

const discountSchema = new Schema<IDiscount>({
    orderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    type: {
        type: String,
        enum: Object.values(DiscountType),
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 0
    },
    isPercentage: {
        type: Boolean,
        required: true,
    },
    discountAmount: {
        type: Number,
        required: true,
        min: 0
    }
},{
    timestamps: true
})

const Discount = model<IDiscount>("Discount", discountSchema);
export default Discount;