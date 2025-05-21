//model for making a purchase
//needs modification
import { Document, model, Schema, Types } from "mongoose"


export interface IOrder extends Document{
    customerId: Types.ObjectId,
    productId: Types.ObjectId,
    purchase: string, // product to purchase
    quantity: number,
    cost: number,
    discountId?: Types.ObjectId, // optional since discount may not be applicable
    amountPaid: number
}

const orderSchema = new Schema<IOrder>({
    customerId : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'

    },
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    purchase: { //name of product to purchase
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
     cost: {
        type: Number,
        required: true
    },
    discountId: {
        type: Schema.Types.ObjectId,
        ref: 'Discount',
        required: false
    },
    amountPaid: {
        type: Number,
        required: true,
        min: 0
    },

},{
    timestamps: true
})

const Order = model<IOrder>("Order", orderSchema);
export  default Order;