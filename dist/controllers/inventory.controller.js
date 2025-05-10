"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeMessage = exports.addNewItem = void 0;
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
const addNewItem = async (req, res) => {
    const { name, category, price, stock } = req.body;
    try {
        const existingItem = await inventory_model_1.default.findOne({ name });
        if (existingItem) {
            res.status(400).json({
                success: false,
                message: `${name} has already been included in to inventory`
            });
            return;
        }
        // adding the new item to the list
        const newItem = new inventory_model_1.default({
            name,
            category,
            price,
            stock
        });
        await newItem.save(); // save in the database
        const newItemWithCurrency = { ...newItem.toObject(), price: `$ ${price}` };
        res.status(200).json({
            success: true,
            message: 'Product successfully added to the inventory',
            data: newItemWithCurrency
        });
        return;
    }
    catch (error) {
        console.log("Error caused by: ", error);
        res.status(500).json({ success: false, message: 'Internal server error caused while adding new item' });
        return;
    }
};
exports.addNewItem = addNewItem;
const welcomeMessage = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Welcome to the inventory management system'
        });
        return;
    }
    catch (error) {
        console.error('Error caused by :', error);
        res.status(500).json({ success: false, message: 'Internal server error while displaying welcome message' });
        return;
    }
};
exports.welcomeMessage = welcomeMessage;
