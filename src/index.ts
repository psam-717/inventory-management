import express, { Request, Response } from "express";
import { connectDB } from "./config/mongodb";
import adminRoutes from "./routes/admin.routes"
import customerRoutes from "./routes/customer.routes"
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json())
app.use(cookieParser())

app.use(morgan('dev'));

app.get('/api', (req: Request, res: Response) => {
    res.status(200).send('Backend working');
})

app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

connectDB();

app.listen(port, () => {
    console.log(`🟢 server is listening on port ${port}`);
})