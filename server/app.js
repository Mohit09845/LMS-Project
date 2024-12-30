import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Configure CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Exclude the Stripe webhook route from global middleware
app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/purchase/webhook') {
        next(); // Skip global body parsers for this route
    } else {
        express.json({ limit: "16kb" })(req, res, next);
    }
});

// Other middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static('public'));
app.use(cookieParser());

// Import routes
import courseRoute from './routes/course.route.js';
import userRouter from './routes/user.route.js';
import mediaRoute from './routes/media.route.js';
import purchaseRoute from './routes/purchaseCourse.route.js';

// Use routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRoute);
app.use('/api/v1/purchase', purchaseRoute);

// Error handling middleware
app.use(errorHandler);

export { app };
