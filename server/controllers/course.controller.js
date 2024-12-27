import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../model/course.model.js";
import { Lecture } from "../model/lecture.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteMediafromCloudinary, uploadMedia } from '../utils/Cloudinary.js'

export const createCourse = asyncHandler(async (req, res) => {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
        throw new ApiError(400, 'Course title and category are required');
    }

    const course = await Course.create({
        courseTitle,
        category,
        creator: req.user?._id
    })

    return res.
        status(201).
        json(
            new ApiResponse(201, course, 'Course created successfully')
        )
})

export const getCreatorCourses = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
        throw new ApiError(404, 'Courses not found')
    }

    return res.
        status(200).
        json(
            new ApiResponse(200, courses)
        )
})

export const editCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.courseId;

    if (!courseId) {
        throw new ApiError(400, 'Course ID not received');
    }

    const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;

    const newThumbnailPath = req.file?.path;

    let course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(400, 'Course not found');
    }

    let thumbUrl;

    if (newThumbnailPath) {
        if (course.courseThumbnail) {
            const publicId = course.courseThumbnail.split('/').pop().split('.')[0];
            await deleteMediafromCloudinary(publicId);
        }
        const cloudResponse = await uploadMedia(newThumbnailPath);
        thumbUrl = cloudResponse.secure_url;
    }

    const updatedData = {
        courseTitle,
        subTitle,
        description,
        category,
        courseLevel,
        coursePrice,
        ...(thumbUrl && { courseThumbnail: thumbUrl }),
    };

    course = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });

    return res.
        status(200).
        json(
            new ApiResponse(200, course, 'Course updated Successfully')
        );
});

export const getCourseById = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, "course not found")
    }

    return res.
        status(200).
        json(
            new ApiResponse(200, course)
        )
})

export const createLecture = asyncHandler(async (req, res) => {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
        throw new ApiError(400, "Lecture Title is required")
    }

    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);

    if (course) {
        course.lectures.push(lecture._id);
        await course.save();
    }

    return res.
        status(201).
        json(
            new ApiResponse(201, lecture, 'Lecture created successfully')
        )
})

export const getCourseLecture = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate('lectures');

    if (!course || !courseId) {
        throw new ApiError(404, 'Course not found')
    }

    return res.
    status(200).
    json(
        new ApiResponse(200,{lectures: course.lectures})
    )
})