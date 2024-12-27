import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'



export const CreateLecture = () => {
    const params = useParams();
    const courseId = params.courseId;
    const [lectureTitle, setLectureTitle] = useState('');
    const navigate = useNavigate();

    const [createLecture, { data: lectureData, isLoading, isSuccess, error }] = useCreateLectureMutation();

    const { getCourseLecture, data: courseLectureData, isLoading: lectureLoading, isError: lectureError,refetch } = useGetCourseLectureQuery(courseId);

    const createLectureHandler = async () => {
        await createLecture({ courseId, lectureTitle })
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(lectureData?.message || 'Lecture created')
            refetch()
        }
        if (error) {
            toast.error(error?.data.message || 'Error during creating lecture')
        }
    }, [error, isSuccess])

    return (
        <div className='flex-1 mx-10 my-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>Add your Lecture here,add some basic details for new lecture.</h1>
                <p className='text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo aspernatur in doloremque ad numquam, nulla quaerat distinctio cum aperiam deleniti ipsa error necessitatibus laboriosam, harum cumque ullam beatae, provident placeat.</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input
                        type='text'
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder='Your lecture name'
                    />
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' onClick={() => navigate(`/admin/course/${courseId}`)}>Back to Course</Button>
                    <Button disabled={isLoading} onClick={createLectureHandler}>
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </>
                            ) : 'Create Lecture'
                        }
                    </Button>
                </div>
                <div className='mt-10'>
                    {
                        lectureLoading ? <p>loading lectures...</p> :
                            lectureError ? <p>Failed to load lectures.</p> :
                                courseLectureData.lectures.length === 0 ? <p>No lectures are available at this moment.</p> :
                                    courseLectureData.lectures.map((lecture, index) => (
                                        <Lecture key={lecture._id} lecture={lecture} index={index} courseId = {courseId}/>
                                    ))
                    }
                </div>
            </div>
        </div>
    )
}
