import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AddCourse = () => {
    const [courseTitle,setCourseTitle] = useState('');
    const [category,setCategory] = useState('');

    const navigate = useNavigate();

    const [createCourse, {data,error,isSuccess,isLoading,}] = useCreateCourseMutation();

    const getSelectedCategory = (value) => {
        setCategory(value);
    }

    const createCourseHandler = async (req,res)=>{
        if (!courseTitle || !category) {
            return toast.error('Please fill in all required fields');
        }
        await createCourse({courseTitle,category});
    }

    useEffect(()=>{
        if(isSuccess){
            toast.success(data?.message || 'Course created')
            navigate('/admin/course')
        }
    },[isSuccess,error])

    return (
        <div className='flex-1 mx-10 my-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>Let's add course,add some basic details for new course.</h1>
                <p className='text-sm'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo aspernatur in doloremque ad numquam, nulla quaerat distinctio cum aperiam deleniti ipsa error necessitatibus laboriosam, harum cumque ullam beatae, provident placeat.</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input
                        type='text'
                        value={courseTitle}
                        onChange={(e)=>setCourseTitle(e.target.value)}
                        placeholder='Your course name'
                    />
                </div>
                <div>
                    <Label>Category</Label>
                    <Select onValueChange={getSelectedCategory} className='overflow-visible'>
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
                <div className='flex items-center gap-2'>
                    <Button variant='outline' onClick={() => navigate('/admin/course')}>Back</Button>
                    <Button disabled = {isLoading} onClick={createCourseHandler}>
                        {
                            isLoading ? (
                                <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                                Please wait
                                </>
                            ) : 'Create'
                        } 
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddCourse