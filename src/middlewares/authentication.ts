import { NextFunction, Response, Request } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

export const authorization = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const cookie = req.cookies?.['customerToken'];
        const authHeader = req.headers?.authorization;

        const accessToken = cookie || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

        if(!accessToken){
            res.status(400).json({
                success: false,
                message: 'Unauthorized: Access token not found'
            });
            return;
        }

        if(!process.env.JWT_SECRET){
            res.status(400).json({
                success: false,
                message: 'jwt secret not set'
            });
            return;
        }

        const customerToken = jwt.verify(accessToken, process.env.JWT_SECRET) as {id: string, email: string};

        if(!customerToken || !customerToken.id){
            res.status(400).json({
                success: false,
                message: 'Unauthorized: Invalid token payload'
            })
            return;
        }

        (req as any).user = {id: customerToken.id};
        next();
        
    } catch (error) {
        console.log('Error cause by: ', error)
        if(error instanceof JsonWebTokenError){
            res.status(500).json({success: false, message: 'Json web token error'});
            return;
        }else if (error instanceof TokenExpiredError){
            res.status(500).json({success: false, message: 'Token has expired'});
            return;
        }else {
            res.status(500).json({success: false, message: 'Internal server during authentication'});
        }
    }
}