"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const mongURI = process.env.MONGO_URI;
        if (!mongURI) {
            throw new Error("mongo URI not specified");
        }
        await mongoose_1.default.connect(mongURI);
        console.log('✅ connected to db');
    }
    catch (error) {
        console.log('❗Error caused by: ', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
