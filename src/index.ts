import express, { Request, Response } from "express";
import { connectDB } from "./config/mongodb";
import inventoryRoutes from "./routes/inventory.routes"
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json())

app.use(morgan('dev'));

app.get('/api', (req: Request, res: Response) => {
    res.status(200).send('Backend working');
})

app.use('/api', inventoryRoutes);

connectDB();

app.listen(port, () => {
    console.log(`🟢 server is listening on port ${port}`);
})