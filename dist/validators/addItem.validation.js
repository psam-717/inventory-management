"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItemValidation = void 0;
const express_validator_1 = require("express-validator");
exports.addItemValidation = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .withMessage('Name of the product should be provided')
        .isString(),
    (0, express_validator_1.check)('category')
        .notEmpty()
        .withMessage('Category of product should be provided')
        .isIn(['electronics', 'clothing', 'groceries', 'books'])
        .withMessage('Category should be one of the following: electronics, clothing, groceries, book')
        .isString(),
    (0, express_validator_1.check)('price')
        .notEmpty()
        .withMessage('Price of item should be provided')
        .isFloat({ min: 0.01 })
        .withMessage('Price should be numeric value'),
    (0, express_validator_1.check)('stock')
        .notEmpty()
        .withMessage('Stock of item should be provided')
        .isInt({ min: 0 })
        .withMessage('Stock should be a numeric value')
];
