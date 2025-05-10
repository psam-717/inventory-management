import { Document, model, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string,
    category: string,
    price: Number,
    stock: Number
}

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
},{
    timestamps: true
})

const Product = model<IProduct>("Product", ProductSchema);

export default Product;