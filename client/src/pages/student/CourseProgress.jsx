import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgressApi';
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;

  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completeSuccess }] = useCompleteCourseMutation();
  const [inCompleteCourse, { data: markinCompleteData, isSuccess: inCompleteSuccess }] = useInCompleteCourseMutation();

  const { courseDetails, completed } = data?.data || {};
  const { courseTitle, lectures } = courseDetails || {};

  const [currentLecture, setCurrentLecture] = useState(null);

  useEffect(() => {
    if (lectures?.length && !currentLecture) {
      setCurrentLecture(lectures[0]);
    }
  }, [data, currentLecture]);

  useEffect(()=>{
    if(completeSuccess){
      toast.success(markCompleteData.data)
      refetch();
    }
    if(inCompleteSuccess){
      toast.success(markinCompleteData.data)
      refetch();
    }
  },[completeSuccess,inCompleteSuccess])

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleCompleteCourse = async () => {
    await completeCourse(courseId)
  }

  const handleinCompleteCourse = async () => {
    await inCompleteCourse(courseId)
  }

  const isLectureCompleted = (lectureId) => {
    return data?.data?.progress?.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 mt-16">
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="font-bold text-2xl">{courseTitle}</h1>
        </div>
        <Button onClick={completed ? handleinCompleteCourse : handleCompleteCourse} variant={completed ? 'outline' : 'default'}>
          {
            completed ? (<div className='flex items-center'>
              <CheckCircle className='h-4 w-4 mr-2' /> <span>Completed</span>
            </div>)
              : 'In Progress'
          }
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <video
            src={currentLecture?.videoUrl}
            controls
            className="w-full h-auto md:rounded-lg"
            onPlay={() => handleLectureProgress(currentLecture?._id)}
          />
          <div className="mt-2">
            <h3 className="font-medium text-lg">
              Lecture-{lectures?.findIndex((lec) => lec._id === currentLecture?._id) + 1}: {currentLecture?.lectureTitle}
            </h3>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {lectures?.length > 0 ? (
              lectures.map((lecture) => (
                <Card
                  key={lecture._id}
                  className={`mb-3 hover:cursor-pointer ${lecture._id === currentLecture?._id ? 'bg-gray-200 dark:bg-gray-700' : ''
                    }`}
                  onClick={() => setCurrentLecture(lecture)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      {isLectureCompleted(lecture._id) ? (
                        <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      ) : (
                        <CirclePlay size={24} className="text-gray-500 mr-2" />
                      )}
                      <CardTitle className="text-lg font-medium">{lecture.lectureTitle}</CardTitle>
                    </div>
                    {isLectureCompleted(lecture._id) && (
                      <Badge
                        variant={"outline"}
                        className="bg-green-200 text-green-600 "
                      >
                        Completed
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No lectures available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
