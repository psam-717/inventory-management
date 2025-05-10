import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async(): Promise<void> => {
    try {
        const mongURI = process.env.MONGO_URI
        if(!mongURI){
            throw new Error("mongo URI not specified");
        }
        await mongoose.connect(mongURI);
        console.log('✅ connected to db')
    } catch (error) {
        console.log('❗Error caused by: ', error);
        process.exit(1);
    }
}