import express from "express";
import { login, signUp } from "../controllers/customer.controller";
import { customerSignUpValidation } from "../validators/customer.signup.validator";
import { validate } from "../validators/validateFields";

const router = express.Router();

router.post('/signup',customerSignUpValidation , validate ,signUp);
router.post('/login', login);

export default router;