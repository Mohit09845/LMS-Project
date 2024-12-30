import React from "react";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { Separator } from "@/components/ui/separator";
import BuyCourse from "@/components/BuyCourse";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";

const CourseDetail = () => {
    const params = useParams();
    const courseId = params.courseId;
    const {data,isLoading,isError} = useGetCourseDetailWithStatusQuery(courseId);
    const navigate = useNavigate();

    console.log(data);

    if(isLoading) return <h1>Loading...</h1>
    if(isError) return <h1>Failed to load course details</h1>

    const {course,purchased} = data?.data;

    const handleContinueCourse = ()=>{
        if(purchased){
            navigate(`/course-progress/${courseId}`);
        }
    }
    
    return (
        <div className="space-y-5 mt-10 overflow-x-hidden">
            {/* Header Section */}
            <div className="bg-[#2D2F31] text-white w-full">
                <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
                    <h1 className="font-bold text-2xl md:text-3xl">{course.courseTitle}</h1>
                    <p className="text-base md:text-lg">{course.subTitle}</p>
                    <p>
                        Created By: 
                        <span className="text-[#C0C4FC] underline italic">{course.creator.name}</span>
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <BadgeInfo size={16} />
                        <p>Last updated: {course.createdAt.split('T')[0]}</p>
                    </div>
                    <p>Students enrolled: {course.enrolledStudents.length}</p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
                {/* Left Section */}
                <div className="w-full lg:w-1/2 space-y-5">
                    <h1 className="font-bold text-xl md:text-2xl">Description</h1>
                    <p className="text-sm" dangerouslySetInnerHTML={{__html: course.description}}/>
                        
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>{course.lectures.length} lectures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {course.lectures.map((lecture, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                    <span>
                                        {true ? <PlayCircle size={14} /> : <Lock size={14} />}
                                    </span>
                                    <p>{lecture.lectureTitle}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Section */}
                <div className="w-full lg:w-1/3">
                    <Card>
                        <CardContent className="p-4 flex flex-col">
                            <div className="w-full aspect-video mb-4">
                                <ReactPlayer 
                                width='100%'
                                height='100%'
                                url={course.lectures[0].videoUrl}
                                controls = {true}
                                />
                            </div>
                            <h1>Lecture Title</h1>
                            <Separator className="my-2" />
                            <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4">
                            {
                                purchased ? (
                                    <Button className="w-full" onClick = {handleContinueCourse}>
                                        Continue Course
                                    </Button>
                                ) : (
                                    <BuyCourse courseId={courseId} />
                                )
                            }
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
