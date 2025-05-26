import {check} from 'express-validator';

export const addToStockValidation = [
    check('name')
    .notEmpty().withMessage('Name field should be provided')
    .isString().withMessage('Name must be a valid non-numeric value'),

    check('quantity')
    .notEmpty().withMessage('Quantity field must be specified')
    .isInt({min: 1}).withMessage('Quantity of product must be at least one(1) and a valid value')
    
]