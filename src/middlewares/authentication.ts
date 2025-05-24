import { NextFunction, Response, Request } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

export const authorization = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const isAdminRoute = req.originalUrl.startsWith('/api/admin'); 
        const cookieName = isAdminRoute ? 'adminToken' : 'customerToken'; //name cookie based on the 

        const cookie = req.cookies?.[cookieName]; // cookie is set using the name of the token
        const authHeader = req.headers?.authorization;

        // assigning accessToken to authHeader or cookie, provided on what the application will be using
        const accessToken = (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null) || cookie ;
        
        if(!accessToken){
            res.status(400).json({success: false, message: 'Unauthorized: Access token not found'});
            return;
        }

        if(!process.env.JWT_SECRET){
            res.status(400).json({success: false,message: 'jwt secret not set'});
            return;
        }

        //validating the access token
        const userToken = jwt.verify(accessToken, process.env.JWT_SECRET) as {id: string,  role: string};

        if(!userToken || !userToken.id){
            res.status(400).json({
                success: false,
                message: 'Unauthorized: Invalid token payload'
            })
            return;
        }

        // assign the req.user object to id and role
        (req as any).user = {
            id: userToken.id, 
            role: userToken.role
        };
        // const payloadData = (req as any).user
        // console.log('Payload: ',payloadData)
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