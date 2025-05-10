import {check} from "express-validator";

export const addItemValidation = [
    check('name')
    .notEmpty()
    .withMessage('Name of the product should be provided')
    .isString(),

    check('category')
    .notEmpty()
    .withMessage('Category of product should be provided')
    .isIn(['electronics', 'clothing', 'groceries', 'books'])
    .withMessage('Category should be one of the following: electronics, clothing, groceries, book')
    .isString(),

    check('price')
    .notEmpty()
    .withMessage('Price of item should be provided')
    .isFloat({min: 0.01})
    .withMessage('Price should be numeric value'),

    check('stock')
    .notEmpty()
    .withMessage('Stock of item should be provided')
    .isInt({min: 0})
    .withMessage('Stock should be a numeric value')

]