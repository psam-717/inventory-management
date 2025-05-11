import { check } from "express-validator";

export const customerSignUpValidation = [
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

    check('cardType')
    .notEmpty()
    .withMessage('Card type field must not be empty')
    .isIn(["debit", "credit"])
    .withMessage("Specify whether the card is debit or credit")
    .isString()
    .withMessage('Last name must be a non-numeric value'),

    check('accountNumber')
    .notEmpty()
    .withMessage('Account field must not be empty')
    .isString()
    .withMessage('Last name must be a non-numeric value'),

    check('monthOfExpiration')
    .notEmpty()
    .withMessage('Month of expiration field must not be empty')
    .isString()
    .withMessage('Month of expiration must be a sting')
    .custom((value) => {
        const validMonths = ['01', '02', '03', '04','05','06','07','08','09','10','11','12',]
        if(!validMonths.includes(value)){
            throw new Error("Month of expiration must be a two digit number from 01 to 12");
        }
        return true;
    }),

    check('yearOfExpiration')
    .notEmpty()
    .withMessage('Year of expiration field must not be empty')
    .isString()
    .withMessage('Last name must be a non-numeric value'),
    


]