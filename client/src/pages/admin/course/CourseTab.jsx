import RichTextEditor from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectItem, SelectLabel, SelectTrigger, SelectGroup, SelectValue, SelectContent } from '@/components/ui/select'
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation, useRemoveCourseMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const CourseTab = () => {

    const params = useParams();
    const courseId = params.courseId;

    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
    const [removeCourse,{data: removeCourseData,isSuccess: removeSuccess,isLoading: removeCourseLoading,isError: removeCourseError}] = useRemoveCourseMutation();
    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });
    const [publishCourse] = usePublishCourseMutation();

    const navigate = useNavigate();

    const [input, setInput] = useState({
        courseTitle: '',
        subTitle: '',
        description: '',
        category: '',
        courseLevel: '',
        coursePrice: '',
        courseThumbnail: ''
    })

    const course = courseByIdData?.data;

    useEffect(() => {
        if (course) {
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: ''
            })
        }
    }, [course])

    const [previewThumbnail, setPreviewThumbnail] = useState('');

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value })
    }

    const selectCategory = (value) => {
        setInput({ ...input, category: value })
    }

    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value })
    }

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast.error('Please upload a valid image file (JPEG, PNG, JPG)');
                return;
            }

            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    };

    const updateCourseHandler = async () => {
        try {
            const formData = new FormData();
            formData.append('courseTitle', input.courseTitle);
            formData.append('subTitle', input.subTitle);
            formData.append('category', input.category);
            formData.append('courseThumbnail', input.courseThumbnail);
            formData.append('courseLevel', input.courseLevel);
            formData.append('coursePrice', input.coursePrice);
            formData.append('description', input.description);
            await editCourse({ formData, courseId });
        } catch (err) {
            toast.error(err.message || 'Unexpected error occurred');
        }
    };

    const removeCourseHandler = async()=>{
        if(window.confirm('Are you sure you want to remove this course')){
            await removeCourse(courseId);
        }
    }

    const publishStatusHandler = async (action) => {
        try {
            const res = await publishCourse({ courseId, query: action });
            refetch();
            if (res.data) {
                toast.success(res?.data.data)
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to publish or unpublish')
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || 'Course updated')
        }
        if (error) {
            toast.error(error?.data.message || 'Failed to update')
        }
    }, [isSuccess, error])

    useEffect(()=>{
        if(removeSuccess){
            toast.success(removeCourseData?.data || 'Course removed successfully')
        }
        if(removeCourseError){
            toast.error('Error during deleteing course')
        }
    },[removeSuccess,removeCourseData,removeCourseError])

    if (courseByIdLoading) {
        return <Loader2 className='h-4 w-4 animate-spin' />
    }

    return (
        <Card>
            <CardHeader className='flex flex-row justify-between'>
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you are done.
                    </CardDescription>
                </div>
                <div className='space-x-2'>
                    <Button variant='outline' onClick={() => publishStatusHandler(course.isPublished ? 'false' : 'true')} disabled={course.lectures.length === 0}>
                        {
                            course.isPublished ? 'Unpublish' : 'Publish'
                        }
                    </Button>
                    <Button onClick={removeCourseHandler} disabled={removeCourseLoading}>
                        {
                            removeCourseLoading ? 
                            <>
                                <Loader2 className='h-4 w-4 animate-spin mr-2'/> Please wait
                            </> : 'Remove Course'
                        } 
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <Label>Title</Label>
                    <Input
                        type='text'
                        name='courseTitle'
                        value={input.courseTitle}
                        onChange={changeEventHandler}
                        placeholder='eg.Fullstack Developer'
                    />
                </div>
                <div className='space-y-4 mt-5'>
                    <Label>Subtitle</Label>
                    <Input
                        type='text'
                        name='subTitle'
                        value={input.subTitle}
                        onChange={changeEventHandler}
                        placeholder='eg.Become a Fullstack Developer from beginner to advance in 2 months'
                    />
                </div>
                <div className='space-y-4 mt-5'>
                    <Label>Description</Label>
                    <RichTextEditor input={input} setInput={setInput} />
                </div>
                <div className='flex items-center gap-20 mt-3'>
                    <div>
                        <Label>Category</Label>
                        <Select onValueChange={selectCategory} className='overflow-visible'>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className='max-h-60 overflow-auto'>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem value="Next JS">Next JS</SelectItem>
                                    <SelectItem value="Data Science">Data Science</SelectItem>
                                    <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                    <SelectItem value="Fullstack Development">Fullstack Development </SelectItem>
                                    <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                                    <SelectItem value="Javascript">Javascript</SelectItem>
                                    <SelectItem value="Python">Python</SelectItem>
                                    <SelectItem value="Docker">Docker</SelectItem>
                                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                                    <SelectItem value="HTML">HTML</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Course Level</Label>
                        <Select onValueChange={selectCourseLevel} className='overflow-visible'>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Course Level" />
                            </SelectTrigger>
                            <SelectContent className='max-h-60 overflow-auto'>
                                <SelectGroup>
                                    <SelectLabel>Course Level</SelectLabel>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Advance">Advance</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Price</Label>
                        <Input
                            type='number'
                            name='coursePrice'
                            value={input.coursePrice}
                            onChange={changeEventHandler}
                            placeholder='eg. ₹ 1999'
                            className='w-fit'
                        />
                    </div>
                </div>
                <div className='mt-3'>
                    <Label>Course Thumbnail</Label>
                    <Input
                        type='file'
                        accept='image/'
                        onChange={selectThumbnail}
                        className='w-fit mt-2'
                    /> {
                        previewThumbnail && (
                            <img src={previewThumbnail} className='w-64 my-2' alt='Course Thumbnail' />
                        )
                    }
                </div>
                <div className='flex items-center gap-3 mt-3'>
                    <Button variant='outline' onClick={() => navigate('/admin/course')}>Back</Button>
                    <Button disabled={isLoading} onClick={updateCourseHandler}>
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </>
                            ) : 'Save'
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab