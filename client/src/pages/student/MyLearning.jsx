import React from 'react'
import Course from './Course';
import { useGetPublishedCourseQuery } from '@/features/api/courseApi';

const MyLearning = () => {
    const { data: coursesData, isLoading, isSuccess, isError } = useGetPublishedCourseQuery();

    if (isError) {
        return <h1>Some error occured while fetching courses</h1>
    }

    return (
        <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
            <h1 className='font-bold text-2xl'>My Learning</h1>
            <div className='my-5'>
                {
                    isLoading ? (<MyLearningSkeleton />) : coursesData?.data.length === 0 ? (<p>You are not enrolled in any course</p>)
                        : <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                            {
                                coursesData?.data && coursesData?.data.map((course, index) => <Course key={index} course={course} />)
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default MyLearning

const MyLearningSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
            ></div>
        ))}
    </div>
);