import { NextFunction, Request, Response } from "express"

export const isAdmin= async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // store the payload data to user
        const user = (req as any).user;

        // verify the user's data and the presence of the id
        if(!user || !user.id){
            res.status(401).json({message: 'User not authenticated'});
            return
        }

        //ensures the user is an admin
        if(user.role !== 'admin'){
            res.status(403).json({message: 'Unauthorized. Admin privileges required'});
            return;
        }

        next();

    } catch (error) {
        console.log('Error caused by: ', error);
        res.status(500).json({message: 'Internal server error occurred while verifying admin'});
    }
}