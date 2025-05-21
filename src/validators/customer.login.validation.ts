import {check} from "express-validator"

export const loginValidation = [
    check('email')
    .notEmpty()
    .withMessage('email field must not be empty')
    .isString()
    .isEmail()
    .withMessage('Provide a valid email'),

    check('password')
    .notEmpty()
    .withMessage('password field must not be empty')
    .isString()

]
