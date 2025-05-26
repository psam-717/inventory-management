import { Request, Response } from "express";
import Product from "../models/inventory.model";
import mongoose, { NumberExpression } from "mongoose";
import Admin from "../models/admin.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const signUp = async(req: Request, res: Response): Promise<void> => {
    const {firstName, lastName, email, password} = req.body;
    try {

        const existingAdmin = await Admin.findOne({email});

        if(existingAdmin){
            res.status(403).json({success: false, message: 'Admin account already exists'});
            return;
        }

        //hash the password;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin ({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        await newAdmin.save();

        const adminData = {...newAdmin.toObject(), password: undefined};

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            adminData
        });
        return

    } catch (error) {
        console.log("Error caused by :", error);
        res.status(500).json({message: 'Internal server error occurred while '});
        return;
    }
}

export const login = async(req: Request, res: Response): Promise<void> => {
    const {email, password} = req.body;
    try {
        const existingAdmin = await Admin.findOne({email});
        if(!existingAdmin){
            res.status(401).json({message: 'Admin account does not exist'});
            return;
        }

        const isMatch = await bcrypt.compare(password, existingAdmin.password);
        if(!isMatch){
            res.status(400).json({message: 'Password is incorrect'});
            return
        }

        if(!process.env.JWT_SECRET){
            res.status(404).json({message: 'Jwt not found'});
            return;
        }
        // token is in the form 'header.payload.signature'
        const token = jwt.sign(
            {id: existingAdmin._id, role: 'admin'}, // set the payload of the token
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );
        
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 *6 * 1000,
            sameSite: 'strict'
        });

        const adminData = {...existingAdmin.toObject(), password: undefined};
        res.status(200).json({message: 'Admin logged in successfully', adminData});
        return;
        
    } catch (error) {
        console.log("Error caused by: ", error);
        res.status(500).json({message: 'Internal server error while logging in'});
        return;
    }
}

export const addNewItem = async(req: Request, res: Response): Promise<void> => {
    const {name, category, price, stock} = req.body;
    try {
        if(!req.body){
            res.status(400).json({
                success: false, 
                message: 'Request body not provided'
            })
        }

        const existingItem = await Product.findOne({name});
        if(existingItem){
            res.status(400).json({
                success: false, 
                message: `${name} has already been included to the inventory`
            })
            return;
        }

        // adding the new item to the list
        const newItem = new Product({
            name, 
            category,
            price, 
            stock
        })
        await newItem.save(); // save in the database

        const newItemWithCurrency = {...newItem.toObject(), price: `$ ${price}`};

        res.status(201).json({
            success: true,
            message: 'Product successfully added to the inventory',
            data: newItemWithCurrency
        });
        return;

    } catch (error) {
        console.log("Error caused by: ", error);
        res.status(500).json({success: false, message: 'Internal server error caused while adding new item'});
        return;
    }
}

export const addToStock = async(req: Request, res: Response): Promise<void> => {
    interface AddToStockBody {
        name: string,
        quantity: number
    }
    // name of the product must be provided alongside the stock to update
    const {name, quantity} = req.body as AddToStockBody;
    try {
        //verify existence of product
        const existingProduct = await Product.findOne({name});

        if(!existingProduct){
            res.status(404).json({success: false, message: 'product not found'});
            return;
        }

        if(!name || typeof name !== 'string'){
            res.status(400).json({success: false, message: 'name of product must be a valid and not empty'})
        }
    
        // make sure quantity specified is an integer
        if(typeof quantity !== 'number' || quantity < 0){
            res.status(400).json({success: false, message: 'Quantity must be a number and must be at least one'});
            return;
        }

        // increasing stock
        const increasedStock = existingProduct.stock + quantity;

        const updatedStock = await Product.findOneAndUpdate({name},
            {$set: {stock: increasedStock}},
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStock){
            res.status(404).json({success: false, message: 'Failed to update stock'});
            return;
        }

        res.status(200).json({success: true, message: 'Stock updated', data: updatedStock});
        return;


    } catch (error) {
        console.log('Error is caused by: ', error);
        res.status(500).json({success: false, message: 'Internal server error while adding to stock'});
        return;
    }
}

export const displayAllProduct = async(req: Request, res: Response): Promise<void> => {
    try {
        const getAllProduct = await Product.find();

        if(!getAllProduct || getAllProduct.length === 0){
            res.status(404).json({
                success: false,
                message: 'No product found in the inventory'
            })
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: getAllProduct
        })
        return;

    } catch (error) {
        console.log('Error caused by: ', error);
        res.status(500).json({success: false, message: "Internal server error while displaying all products"})
        return;
    }
}

export const getSingleProduct = async(req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;

        if(!req.params){
            res.status(400).json({
                success: false, 
                message: 'Request parameter not specified'
            });
            return;
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(401).json({
                success: false,
                message: 'Invalid id specified'
            })
            return;
        }

        const product = await Product.findById(id);
        if(!product){
            res.status(404).json({
                success: false,
                message: 'Product cannot be found'
            })
            return;
        }
        // display product
        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: product
        })
        return;

    } catch (error) {
        console.log('Error caused by: ', error);
        res.status(500).json({success: false, message: 'Internal server error while retrieving product'});
        return;
    }
}

export const stockOfProducts = async(req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find().select('name stock');
        if(!products || products.length === 0){
            res.status(404).json({success: false, message: 'No products found'});
            return;
        }

        res.status(200).json({message: 'Products retrieved successfully', data: products});
        return;
    } catch (error) {
        console.log('Error caused by: ', error);
        res.status(500).json({success: false, message: 'Internal server error while retrieving stock of product'});
        return;
    }
}

export const deleteProduct = async(req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params
        if(!req.params){
            res.status(404).json({success: true,message: 'Request parameter not specified'})
            return;
        }
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json({
                success: false, 
                message: 'Invalid product id'
            })
            return;
        }

        const deleteProduct = await Product.findByIdAndDelete(id);
        if(!deleteProduct){
            res.status(400).json({
                success: false,
                message: 'product not found'
            })
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Product has been deleted successfully',
            data: deleteProduct
        });
        return;
    } catch (error) {
        console.log('Error caused by: ', error);
        res.status(500).json({success: false, message: 'Internal server error while deleting product'});
    }
}


interface ItemQuery {// define the structure and types of the query object 
    category?: string;
    stock?: {$gte : number} | number
    }


export const getItemByQuery = async(req: Request, res: Response): Promise<void> => {
    
    try {
        const {category, minStock, exactStock} = req.query;
        const query: ItemQuery = {};

        if(category){
            if(typeof category !== 'string'){
                res.status(400).json({success: false, message: 'category should be a string'});
                return;
            }
            query.category = category;
        }

        if(minStock){
            if(typeof minStock !== 'string'){
                res.status(400).json({success: false, message: 'minStock should be a string'});
                return;
            }
            //parse the minStock string value to Int
            const minStockAsInt = parseInt(minStock, 10); // parse(string, radix) radix for decimal is 10
            if(isNaN(minStockAsInt)){
                res.status(400).json({success: false, message: 'minStock should be parsed to a integer'});
                return;
            }
            query.stock = {$gte: minStockAsInt}
        }

        if(exactStock){
            if(typeof exactStock !== 'string'){
                res.status(400).json({success: false, message: 'exactStock should be a string'});
                return;
            }
            const exactStockAsInt = parseInt(exactStock, 10);
            if(isNaN(exactStockAsInt)){
                res.status(400).json({success: false, message: 'exactStock should be parsed to an integer'});
                return;
            }
            query.stock = exactStockAsInt;
        }

        // minStock and exactStock should not be specified at the same time
        if(minStock && exactStock){
            res.status(401).json({success: false, message: 'cannot include both minStock and exactStock in query'});
            return;
        }

        const products = await Product.find(query);
        if (!products|| products.length === 0){
            res.status(404).json({ success: false,message:'No products found'})
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: products
        })
        return;

    } catch (error) {
        console.log('Error caused by: ', error);
        res.status(500).json({success: false, message: 'Internal server error while retrieving products'});
        return
    }
}
