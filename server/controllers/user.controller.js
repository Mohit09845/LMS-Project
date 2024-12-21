import { User } from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js'
import { generateToken } from '../utils/generateToken.js';

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password || [name, email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (user) {
        throw new ApiError(400, "User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered successfully")
    )
})

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!password || !email || [email, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Email or password is incorrect")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Email or password is incorrect")
    }

    generateToken(res, user, `Welcome back ${user.name}`);

    return res
        .status(200)
        .json(
            new ApiResponse(200, user,"User logged in successfully")
        )
})