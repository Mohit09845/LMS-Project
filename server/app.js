import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit:"16kb"}));  
app.use(express.urlencoded({extended:true,limit: "16kb"})); 
app.use(express.static('public'));  
app.use(cookieParser());

import courseRoute from './routes/course.route.js'

import userRouter from './routes/user.route.js';

app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRoute);

app.use(errorHandler);

export {app}