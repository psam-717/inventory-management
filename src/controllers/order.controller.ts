//handles order and payment of items
import { Request, Response } from "express";
import Product, { IProduct } from "../models/inventory.model";
import mongoose from "mongoose";
import Customer from "../models/customer.model";
import Order from "../models/order.model";
import Discount from "../models/discount.model";



interface PurchaseRequestBody {
    name: string;
    quantity: number;
    amountPaid: number;
}

export const purchaseItem = async(req: Request, res: Response): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const {name, quantity,amountPaid} = req.body as PurchaseRequestBody;
        const customerId = (req as any).user?.id;

        if(!customerId){
            await session.abortTransaction();
            res.status(403).json({success: false, message: 'Customer id not available'});
            return;
        }


        // validate quantity
        if (typeof quantity !== 'number' || quantity < 1){
            await session.abortTransaction();
            res.status(400).json({
                success: false, 
                message: 'Quantity of product should be a number greater than 0'
            })
            return;
        }

        //validate amountPaid
        if(typeof amountPaid !== 'number' || amountPaid <= 0){
            await session.abortTransaction();
            res.status(400).json({
                success: false,
                message: 'Enter a valid amount. Amount paid must be a positive number'
            })
            return;
        }
        //get customer
        const customer = await Customer.findById(customerId).session(session);
        if(!customer){
            await session.abortTransaction();
            res.status(404).json({success: false, message: 'Customer not found'});
            return;
        }

        //get product
        const product: IProduct | null = await Product.findOne({name}).session(session);
        if(!product){
            await session.abortTransaction();
            res.status(404).json({ success: false, message: 'Product not found'});
            return;
        }

        //quantity should not be more than the stock available
        if(product.stock < quantity){
            await session.abortTransaction();
            res.status(400).json({
                success: false,
                message: 'Insufficient stock available'
            });
            return;
        }

        // calculate the total cost of the purchase
        const totalCost = product.price * quantity;

        //filter discount and select the highest
        let totalDiscount = 0;
        let appliedDiscount : {
            type: string;
            value: number;
            isPercentage: boolean;
            discountAmount: number
        } | undefined;

        const eligibleDiscounts = product.discounts.filter((discount) => {
            const now = new Date();
            if (discount.validUntil && discount.validUntil < now) return false;
            if (discount.type === 'bulk_purchase' && (!discount.minQuantity || quantity < discount.minQuantity)) return false;
            if (discount.type === 'membership' && !customer.isMember) return false;
            return true;
        });
        
        //determining eligible discount from the highest discount present in the array of discount
        eligibleDiscounts.forEach((discount) => {
            const discountAmount = discount.isPercentage ? (discount.value / 100) * totalCost : discount.value * totalCost;

            // select the highest discount
            if (discountAmount > totalDiscount){
                totalDiscount = discountAmount;
                // store the details of the highest count
                appliedDiscount = {
                    type: discount.type,
                    value: discount.value,
                    isPercentage: discount.isPercentage,
                    discountAmount
                }
            }
        })

        // calculate the final cost after the discount
        const finalCost = Math.max(0, totalCost -totalDiscount);

        //validate amount paid
        if (amountPaid < finalCost){
            await session.abortTransaction();
            res.status(400).json({success: false, message: 'Insufficient funds to make purchase'})
            return
        }

        // update the stock quantity
        product.stock -= quantity;
        await product.save({session});

        //update product purchased field in the customer model
        customer.productsPurchased.push(product._id as mongoose.Types.ObjectId);
        await customer.save({session});

        //save the order
        const order = new Order({
            customerId,
            productId: product._id,
            purchase: product.name,
            quantity,
            cost: totalCost,
            amountPaid: finalCost
        })
        await order.save({session});

        //saving the discount
        //let discountId: mongoose.Types.ObjectId | undefined
        if(appliedDiscount){
            const discount = new Discount({
                orderId: order._id,
                type: appliedDiscount.type,
                value: appliedDiscount.value,
                isPercentage: appliedDiscount.isPercentage,
                discountAmount: appliedDiscount.discountAmount
            }) as mongoose.Document & {_id: mongoose.Types.ObjectId};
            await discount.save({session});
            let discountId = discount._id;

            order.discountId = discountId;
            await order.save({session});
        }

        // commit the transaction
        await session.commitTransaction();
        res.status(201).json({
            success:true,
            order: {
                product: product.name,
                quantity,
                totalCost,
                discountApplied: totalDiscount,
                amountPaid: finalCost
            }
        })
        return
        
    } catch (error) {
        await session.abortTransaction();
        console.log('Error caused by: ', error);
        res.status(500).json({success: false, message: 'Internal server error while purchasing Item'});
        return;
        
    }finally {
            session.endSession()
    }
}