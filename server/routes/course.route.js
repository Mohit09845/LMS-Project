import isAuthenticated from '../middlewares/isAuthenticated.js';
import express from 'express'
import { createCourse, createLecture, editCourse, getCourseById, getCourseLecture, getCreatorCourses } from '../controllers/course.controller.js';
import upload from '../utils/multer.js'

const router = express.Router();

router.use(isAuthenticated)

router.route('/').post(createCourse);
router.route('/').get(getCreatorCourses);
router.route('/:courseId').put(upload.single('courseThumbnail'), editCourse);
router.route('/:courseId').get(getCourseById);
router.route('/:courseId/lecture').post(createLecture);
router.route('/:courseId/lecture').get(getCourseLecture);

export default router;