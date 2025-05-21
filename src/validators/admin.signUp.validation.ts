import { check } from "express-validator";

export const adminSignUpValidation = [
    check('firstName')
    .notEmpty()
    .withMessage('First name field must not be empty')
    .isString()
    .withMessage('First name must be a non-numeric value'),

    check('lastName')
    .notEmpty()
    .withMessage('Last name field must not be empty')
    .isString()
    .withMessage('Last name must be a non-numeric value'),

    check('email')
    .notEmpty()
    .withMessage('email field must not be empty')
    .isString()
    .isEmail()
    .withMessage('Provide a valid email'),

    check('password')
    .notEmpty()
    .withMessage('password field must not be empty')
    .isString(),

    

]