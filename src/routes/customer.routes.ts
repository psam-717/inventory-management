import express from "express";
import { getMyData, login, signUp } from "../controllers/customer.controller";
import { customerSignUpValidation } from "../validators/customer.signup.validator";
import { validate } from "../validators/validateFields";
import { loginValidation } from "../validators/customer.login.validation";
import { authorization } from "../middlewares/authentication";
import { purchaseItem } from "../controllers/order.controller";

const router = express.Router();

router.post('/signup',customerSignUpValidation , validate ,signUp);
router.post('/login', loginValidation,validate,login);
router.post('/purchase', authorization, purchaseItem);
router.get('/me', authorization, getMyData);

export default router;