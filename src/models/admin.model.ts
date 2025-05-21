import { Document, model, Schema } from "mongoose";

export interface IAdmin extends Document{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

const adminSchema = new Schema<IAdmin>({
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
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Admin = model<IAdmin>("Admin", adminSchema);

export default Admin;