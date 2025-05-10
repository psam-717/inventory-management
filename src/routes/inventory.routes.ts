import express from "express"
import { addNewItem, deleteProduct, displayAllProduct, getItemByQuery, getSingleProduct, welcomeMessage } from "../controllers/inventory.controller";
import { validate } from "../validators/validateFields";
import { addItemValidation } from "../validators/addItem.validation";

const router = express.Router();

router.get('/welcome',welcomeMessage );
router.post('/add-item',  addItemValidation, validate, addNewItem);
router.get('/get-all-items', displayAllProduct)
router.get('/get-single-item/:id', getSingleProduct)
router.delete('/delete-item/:id', deleteProduct);
router.get('/items', getItemByQuery);


export default router;