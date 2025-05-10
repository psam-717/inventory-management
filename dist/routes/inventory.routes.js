"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventory_controller_1 = require("../controllers/inventory.controller");
const validateFields_1 = require("../validators/validateFields");
const addItem_validation_1 = require("../validators/addItem.validation");
const router = express_1.default.Router();
router.get('/welcome', inventory_controller_1.welcomeMessage);
router.post('/add-item', addItem_validation_1.addItemValidation, validateFields_1.validate, inventory_controller_1.addNewItem);
exports.default = router;
