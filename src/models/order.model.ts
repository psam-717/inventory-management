import { Document, model, Schema } from "mongoose"

export interface IOrder extends Document{
    purchase: string,
    quantity: number,
    cost: number,
    discountGiven: number,
    amountPaid: number
}

const orderSchema = new Schema<IOrder>({
    purchase: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        default: 1
    },
     cost: {
        type: Number,
        required: true
    },
    discountGiven: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },

},{
    timestamps: true
})

const Order = model<IOrder>("Order", orderSchema);
export  default Order;