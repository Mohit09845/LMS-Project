import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const MEDIA_API = 'http://localhost:8080/api/v1/media';

const LectureTab = () => {

    const [lectureTitle, setLectureTitle] = useState('');
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const params = useParams();
    const { courseId, lectureId } = params;

    const [EditLecture, { data: EditLectureData, isLoading, isSuccess, error }] = useEditLectureMutation();
    const [removeLecture, { data: removeLectureData, isLoading: removeIsLoading, isSuccess: removeIsSuccess }] = useRemoveLectureMutation();
    const { getLectureById, data: getData, isSuccess: getSuccess, isError: getError } = useGetLectureByIdQuery(lectureId);

    const editLectureHandler = async () => {
        await EditLecture({ courseId, lectureId, lectureTitle, videoInfo: uploadVideoInfo, isPreviewFree: isFree })
    }

    const removeLectureHandler = async () => {
        if (window.confirm('Are you sure you want to remove this lecture?'))
            await removeLecture(lectureId)
    }

    useEffect(() => {
        if (getData?.data) {
            const editedLecture = getData?.data;
            setLectureTitle(editedLecture.lectureTitle);
            setIsFree(editedLecture.isPreviewFree);
        }

    }, [getSuccess, getData, getError])

    useEffect(() => {
        if (isSuccess) {
            toast.success(EditLectureData?.message || 'Lecture updated successfully')
            if (EditLectureData?.data) {
                const updatedLecture = EditLectureData?.data;
                if (lectureTitle !== updatedLecture.lectureTitle) {
                    setLectureTitle(updatedLecture.lectureTitle);
                }
                if (isFree !== updatedLecture.isPreviewFree) {
                    setIsFree(updatedLecture.isPreviewFree);
                }
            }
        }
        if (error) {
            toast.error(EditLectureData?.error.message || 'Failed to edit lecture')
        }
    }, [isSuccess, error, EditLectureData, removeIsLoading])

    useEffect(() => {
        if (removeIsSuccess) {
            toast.success(removeLectureData?.data || 'Lecture removed successfully');
        }
    }, [removeIsSuccess, removeLectureData]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        e.target.value = '';

        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round(loaded * 100 / total));
                    }
                })
                if (res.data.success) {
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    setButtonDisabled(false);
                    toast.success(res.data.message)
                }
            } catch (error) {
                toast.error('Video upload failed')
            } finally {
                setMediaProgress(false);
            }
        }
    }

    return (
        <Card>
            <CardHeader className='flex justify-between'>
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make Changes and when you are done then click save button</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='destructive' onClick={removeLectureHandler} disabled={removeIsLoading}>
                        {
                            removeIsLoading ?
                                <>
                                    <Loader2 className='h-4 w-4 animate-spin mr-2' /> Please wait
                                </> : 'Remove Lecture'
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        type='text'
                        placeholder='Eg. Introduction to JavaScript'
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                    />
                </div>
                <div className='my-5'>
                    <Label>Video <span className='text-red-500'>*</span></Label>
                    <Input
                        className='w-fit'
                        type='file'
                        accept='video/*'
                        onChange={handleFileChange}
                    />
                </div>
                <div className='flex items-center my-5 space-x-2'>
                    <Switch id="isFree" onCheckedChange={(checked) => setIsFree(checked)} checked={isFree} />
                    <Label htmlFor="isFree">Is this video FREE</Label>
                </div>
                {
                    mediaProgress && (
                        <div className='my-4'>
                            <progress value={uploadProgress} max={100} />
                            <p>{uploadProgress}% uploaded</p>
                        </div>
                    )
                }
                <div className='mt-4'>
                    <Button onClick={editLectureHandler} disabled={buttonDisabled}>
                        {
                            isLoading ?
                                <>
                                    <Loader2 className='w-4 h-4 animate-spin mr-2' /> Please wait
                                </> : 'Update Lecture'
                        }
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LectureTab