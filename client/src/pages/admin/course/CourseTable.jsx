import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableBody, TableFooter } from '@/components/ui/table'
import { useGetCreatorCourseQuery } from '@/features/api/courseApi'
import { Edit } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CourseTable = () => {

    const navigate = useNavigate();

    const { data, isLoading } = useGetCreatorCourseQuery();

    console.log(data);


    if (isLoading) {
        return (
            <div className="my-10">
                <Button disabled><Skeleton width={150} height={40} /></Button>
                <Table>
                    <TableCaption><Skeleton width={200} /></TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton width={100} /></TableHead>
                            <TableHead><Skeleton width={100} /></TableHead>
                            <TableHead><Skeleton width={100} /></TableHead>
                            <TableHead className="text-right"><Skeleton width={100} /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton width={100} /></TableCell>
                                <TableCell><Skeleton width={100} /></TableCell>
                                <TableCell><Skeleton width={150} /></TableCell>
                                <TableCell className="text-right"><Skeleton width={80} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className='my-10'>
            <Button onClick={() => navigate('create')}>Create a new Course</Button>
            <Table>
                <TableCaption>A list of your recent courses.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="w-[100px]">Price</TableHead>
                        <TableHead>Status</TableHead>

                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.map((course) => (
                        <TableRow key={course._id}>
                            <TableCell className="font-medium">{course.courseTitle}</TableCell>
                            <TableCell>{course?.coursePrice || 'NA'}</TableCell>
                            <TableCell><Badge className={course.isPublished ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>{course.isPublished ? 'Published' : 'Pending'}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button size='sm' variant='ghost' onClick={() => navigate(`${course._id}`)}><Edit /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CourseTable