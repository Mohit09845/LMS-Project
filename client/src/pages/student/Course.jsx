import { AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

const Course = () => {
  return (
    <Card className = 'overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300'>
        <div className='relative'>
            <img 
            src='https://wesbos.com/static/6fc098b677ab95df899a42e40b7b3aa4/6d71a/node-facebook-share.jpg'
            className='w-full h-36 object-cover rounded-t-lg'
            alt='Nodejs.jpg'
            />
        </div>
        <CardContent className = 'px-4 py-4 space-y-2'>
            <h1 className='hover:underline font-bold text-lg truncate'>Nextjs Complete Course in Hindi</h1>
            <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3 '>
                <Avatar className='h-8 w-8'>
                    <AvatarImage className='rounded-full' src='https://github.com/shadcn.png' alt='@shadcn'/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='font-medium text-sm'>Mohit Sharma</h1>
            </div>
            <Badge className={'bg-green-500 text-white px-2 py-1 text-xs rounded-full'}>
                Advance
            </Badge>
            </div>
            <div className='text-lg font-bold'>
                <span>₹1999</span>
                </div>   
        </CardContent>
    </Card>
  )
}

export default Course