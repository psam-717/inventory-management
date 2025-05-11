import { Request, Response } from "express";
import Product from "../models/inventory.model";
import mongoose from "mongoose";


export const purchaseItem = async(req: Request, res: Response): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const {name, quantity,amountPaid} = req.body;

        if(!req.body){
            await session.abortTransaction();
            res.status(400).json({
                success: false, 
                message:'Request body not specified'
            })
            return;
        }


        // logic for quantity to be paid to customer
        if (typeof quantity !== 'number' || quantity <= 1){
            await session.abortTransaction();
            res.status(400).json({
                success: false, 
                message: 'Quantity of product should be a number'
            })
            return;
        }

        //logic for amountPaid
        if(typeof amountPaid !== 'number' || amountPaid <= 0){
            await session.abortTransaction();
            res.status(400).json({
                success: false,
                message: 'Amount paid must be a positive number'
            })
            return;
        }

        //get product
        const product = await Product.findOne({name}).session(session);
        if(!product){
            await session.abortTransaction();
            res.status(404).json({
                success: false, 
                message: 'Product not found'
            });
            return;
        }

        //quantity should not be more than the stock available
        if(product.stock < quantity){
            await session.abortTransaction();
            res.status(400).json({
                success: false,
                message: 'Insufficient funds available'
            });
            return;
        }

        // calculate the total cost of the purchase
        const totalCost = product.price * quantity;

        //amount paid should not be less than the amount paid
        if(amountPaid < totalCost){
            await session.abortTransaction();
            res.status(400).json({
                success: false,
                message: 'Insufficient funds to make purchase'
            })
            return;
        }

        //specify discount
        
        
    } catch (error) {
        console.log('Error caused by: ', error);
        res.status(500).json({success: false, message: 'Internal server error while purchasing Item'});
        return;
    }
}