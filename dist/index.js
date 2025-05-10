"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("./config/mongodb");
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const port = 3000;
const app = (0, express_1.default)();
app.get('/api', (req, res) => {
    res.status(200).send('Backend working');
});
app.use('/api', inventory_routes_1.default);
(0, mongodb_1.connectDB)();
app.listen(port, () => {
    console.log(`🟢 server is listening on port ${port}`);
});
