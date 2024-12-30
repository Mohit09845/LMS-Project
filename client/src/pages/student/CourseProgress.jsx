import { Button } from '@/components/ui/button'
import React from 'react'

const CourseProgress = () => {
  return (
    <div className='max-w-7xl mx-auto p-4 mt-16'>
      <div className='flex justify-between mb-4'>
        <h1 className='font-bold text-2xl'>Course Title</h1>
        <Button>Completed</Button>
      </div>
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='flex-1 md:w-1/3 h-fit rounded-lg shadow-lg p-4'>
          <video />
        </div>
        Current watching lecture title
      </div>
    </div>
  )
}

export default CourseProgress