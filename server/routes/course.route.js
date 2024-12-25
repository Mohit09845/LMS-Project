import isAuthenticated from '../middlewares/isAuthenticated.js';
import express from 'express'
import { createCourse } from '../controllers/course.controller.js';

const router = express.Router();

router.use(isAuthenticated)

router.route('/').post(createCourse);

export default router;