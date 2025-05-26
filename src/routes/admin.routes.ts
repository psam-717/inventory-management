import express from "express"
import {
        addNewItem, 
        addToStock, 
        deleteProduct, 
        displayAllProduct, 
        getItemByQuery, 
        getSingleProduct, 
        login, 
        signUp,
        stockOfProducts, 
    } from "../controllers/admin.controller";
import { validate } from "../validators/validateFields";
import { addItemValidation } from "../validators/addItem.validation";
import { adminSignUpValidation } from "../validators/admin.signUp.validation";
import { loginValidation } from "../validators/customer.login.validation";
import { authorization } from "../middlewares/authentication";
import { isAdmin } from "../middlewares/admin.auth";
import { addToStockValidation } from "../validators/addToStock.validation";

const router = express.Router();

router.post('/signup', adminSignUpValidation, validate,signUp);
router.post('/login', loginValidation, validate, login)
router.post('/add-item',  addItemValidation, validate, addNewItem);
router.put('/add-to-Stock', addToStockValidation, validate , authorization, isAdmin, addToStock)
router.get('/get-all-items', authorization, isAdmin ,displayAllProduct);
router.get('/product-stock', authorization, isAdmin, stockOfProducts)
router.get('/get-single-item/:id', authorization, isAdmin,getSingleProduct)
router.delete('/delete-item/:id', authorization, isAdmin,deleteProduct);
router.get('/items', getItemByQuery);


export default router;