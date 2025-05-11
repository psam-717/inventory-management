import express from "express";
import { login, signUp } from "../controllers/customer.controller";
import { customerSignUpValidation } from "../validators/customer.signup.validator";
import { validate } from "../validators/validateFields";
import { customerLoginValidation } from "../validators/customer.login.validation";

const router = express.Router();

router.post('/signup',customerSignUpValidation , validate ,signUp);
router.post('/login', customerLoginValidation,validate,login);

export default router;