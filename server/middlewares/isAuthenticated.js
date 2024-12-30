import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../model/user.model.js';
import { ApiError } from '../utils/ApiError.js'

const isAuthenticated = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "User not authenticated")
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);

        if (!decode) {
            throw new ApiError(401, "Invalid Token")
        }

        const user = await User.findById(decode?.userId).select('-password');

        if (!user) {
            throw new ApiError(401, 'Invalid token')
        }

        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

export default isAuthenticated