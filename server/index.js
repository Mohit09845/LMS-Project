import dotenv from 'dotenv';
import connectDB from './database/db.js';
import { app } from './app.js';


dotenv.config({});

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`); 
});

