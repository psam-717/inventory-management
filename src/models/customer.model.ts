import mongoose, { Document, model, Schema } from "mongoose";

interface ICardDetails {
    cardType: string,
    accountNumber: string,
    monthOfExpiration: string,
    yearOfExpiration: string
}

export interface ICustomer extends Document {
    firstName: string;
    lastName: string
    email: string;
    password: string;
    cardDetails: ICardDetails;
    productsPurchased: mongoose.Types.ObjectId[];
    isMember: boolean;
}

const customerSchema = new Schema<ICustomer>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cardDetails: {
        cardType: {
            type: String,
            enum: ['debit', 'credit'],
            default: 'debit',
            required: true
        },
        accountNumber: {
            type: String,
            required: true
        },
        monthOfExpiration: {
            type: String,
            required: true
        },
        yearOfExpiration: {
            type: String,
            required: true
        }
    },
    productsPurchased: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    isMember: {
        type: Boolean,
        default: false,
        required: true
    }
    
},{
    timestamps: true
})

const Customer = model<ICustomer>("Customer", customerSchema);

export default Customer;