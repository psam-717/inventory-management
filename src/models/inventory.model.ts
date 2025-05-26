import { Document, model, Schema } from "mongoose";

enum Categories {
    Electronics = "electronics",
    Groceries = "groceries",
    Clothing = "clothing",
    Books = "books"
}

enum DiscountType {
    Seasonal = "seasonal",
    BulkPurchase = "bulk_purchase",
    Clearance = "clearance",
    Membership = "membership"
}

interface IDiscount {
    type: DiscountType;
    value: number;
    minQuantity?: number;
    isPercentage: boolean;
    validUntil: Date

}
export interface IProduct extends Document {
    name: string,
    category: Categories,
    price: number,
    stock: number;
    discounts: IDiscount[]
}

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: Object.values(Categories),
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    discounts: [
        {
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
            minQuantity: {
                type: Number,
                min: 1
            },
            isPercentage: {
                type: Boolean,
                required: true
            },
            validUntil: {
                type: Date,

            }
        }
    ]
},{
    timestamps: true
})

const Product = model<IProduct>("Product", ProductSchema);

export default Product;