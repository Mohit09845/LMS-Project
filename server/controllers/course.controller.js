import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../model/course.model.js";
import { Lecture } from "../model/lecture.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteMediafromCloudinary, deleteVideofromCloudinary, uploadMedia } from '../utils/Cloudinary.js';
import mongoose, { isValidObjectId } from 'mongoose';

export const createCourse = asyncHandler(async (req, res) => {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
        throw new ApiError(400, 'Course title and category are required');
    }

    const course = await Course.create({
        courseTitle,
        category,
        creator: req.user?._id
    });

    return res.
        status(201).
        json(
            new ApiResponse(201, course, 'Course created successfully')
        );
});

export const getPublishedCourse = asyncHandler(async (_, res) => {
    const courses = await Course.find({ isPublished: true }).populate({
        path: 'creator',
        select: 'name photoUrl',
    });

    if (!courses || courses.length === 0) {
        throw new ApiError(404, "No courses are available at this moment")
    }

    return res.status(200).json(
        new ApiResponse(200, courses,"Courses fetched successfully")
    )
})

export const getCreatorCourses = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
        throw new ApiError(404, 'Courses not found');
    }

    return res.
        status(200).
        json(
            new ApiResponse(200, courses)
        );
});

export const editCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.courseId;

    if (!isValidObjectId(courseId)) {
        throw new ApiError(400, 'Invalid Course ID');
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

    if (!isValidObjectId(courseId)) {
        throw new ApiError(400, 'Invalid Course ID');
    }

    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return res.
        status(200).
        json(
            new ApiResponse(200, course)
        );
});

export const createLecture = asyncHandler(async (req, res) => {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !isValidObjectId(courseId)) {
        throw new ApiError(400, "Lecture Title and valid Course ID are required");
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
        );
});

export const getCourseLecture = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    if (!isValidObjectId(courseId)) {
        throw new ApiError(400, 'Invalid Course ID');
    }

    const course = await Course.findById(courseId).populate('lectures');

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    return res.
        status(200).
        json(
            new ApiResponse(200, { lectures: course.lectures })
        );
});

export const EditLecture = asyncHandler(async (req, res) => {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    if (!isValidObjectId(courseId) || !isValidObjectId(lectureId)) {
        throw new ApiError(400, 'Invalid Course ID or Lecture ID');
    }

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
        throw new ApiError(404, 'Lecture not found');
    }

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo.publicId) lecture.publicId = videoInfo.publicId;
    if (isPreviewFree) lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    const course = await Course.findById(courseId);

    if (course && !course.lectures.includes(lecture._id)) {
        course.lectures.push(lecture._id);
        await course.save();
    }

    return res.status(200).json(
        new ApiResponse(200, lecture, "Lecture updated successfully")
    );
});

export const removeLecture = asyncHandler(async (req, res) => {
    const { lectureId } = req.params;

    if (!isValidObjectId(lectureId)) {
        throw new ApiError(400, 'Invalid Lecture ID');
    }

    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (lecture.publicId) {
        await deleteVideofromCloudinary(lecture.publicId);
    }

    await Course.updateOne(
        { lectures: lectureId },
        { $pull: { lectures: lectureId } }
    );

    return res.status(200).json(
        new ApiResponse(200, "Lecture removed successfully")
    );
});

export const getLectureById = asyncHandler(async (req, res) => {
    const { lectureId } = req.params;

    if (!isValidObjectId(lectureId)) {
        throw new ApiError(400, 'Invalid Lecture ID');
    }

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
        throw new ApiError(404, "Lecture not found");
    }

    return res.status(200).json(
        new ApiResponse(200, lecture, "Lecture fetched successfully")
    );
});

export const togglePublishCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { publish } = req.query;
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found")
    }
    course.isPublished = publish === 'true';
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished"
    return res.status(200).json(
        new ApiResponse(200, `course is ${statusMessage}`)
    )
})