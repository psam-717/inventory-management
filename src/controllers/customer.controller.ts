import { Request, Response } from "express";
import Customer from "../models/customer.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const {firstName, lastName, email, password, cardType, accountNumber, monthOfExpiration, yearOfExpiration } = req.body;

        //make sure user does not already exist
        const existingUser = await Customer.findOne({email});
        if(existingUser){
            res.status(400).json({
                success: false, 
                message: 'User already exists',
            });
            return;
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Customer({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            cardDetails : {
                cardType,
                accountNumber,
                monthOfExpiration,
                yearOfExpiration
            }
        });
        await newUser.save();

        const userWithoutPassword = {...newUser.toObject(), password: undefined};
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: userWithoutPassword
        })
        return
        
    } catch (error) {
        console.log('Error cause by: ', error);
        res.status(500).json({success: false, message: 'Internal server error while signing up'});
        return;
    }
}

export const login = async (req: Request, res: Response) :Promise<void> => {
    try {
        const {email, password} = req.body;

        const customer = await Customer.findOne({email});

        if(!customer){
            res.status(404).json({
                success: false,
                message: 'User does not have account'
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if(!isMatch){
            res.status(401).json({
                success: false,
                message: 'Incorrect password'
            });
            return;
        };

        if(!process.env.JWT_SECRET){
            res.status(400).json({
                success: false,
                message: 'JWT secret key not set'
            });
            return;
        }

        //generate token
        const token = jwt.sign(
            {id: customer._id, role: 'customer'},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        // set token in the cookie response header
        res.cookie('customerToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60,
            sameSite: 'strict'
        })   
        
        const customerWithoutPassword = {...customer.toObject(), password: undefined};
        res.status(200).json({
            success: true,
            message: 'Successfully logged in',
            data: customerWithoutPassword
        })
        return;

        
    } catch (error) {
        console.log("Error caused by: ", error);
        res.status(500).json({success: false, message: 'Internal server error while logging in'});
        return;
    }
}

export const getMyData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;

        if(!userId){
            res.status(404).json({success: false, message: 'user Id not found'});
            return;
        }
        const user = await Customer.findById(userId);
        if(!user){
            res.status(404).json({success: false, message: 'User not found'});
            return;
        }

        res.status(200).json({success: true, message: 'User data retrieved successfully', user});
        return;

    } catch (error) {
        console.log("Error caused by: ", error);
        res.status(500).json({success: false, message: 'Internal server while retrieving user data'});
        return;
    }
}