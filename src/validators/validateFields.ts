import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
 
//npm install --save-dev @types/express-validator@latest
// the command above ensure that the validationResult module is installed to work within the project

export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()});
        return;
    }
    next()
}