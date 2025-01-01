import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React from 'react';
import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi';

const DashBoard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) {
    return <h1>Loading...</h1>; 
  }

  if (isError) {
    return <h1 className='text-red-500'>Failed to retrieve purchased courses</h1>;
  }

  const { data: purchasedCourses = [] } = data || {}; // Handle undefined `data`

  // Map purchased courses to chart data
  const courseData = purchasedCourses.map((purchase) => ({
    name: purchase.courseId?.courseTitle || 'Unknown', 
    price: purchase.amount || 0, 
  }));

  return (
    <div className='mt-12 ml-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300'>
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold text-blue-600'>{purchasedCourses.length}</p> {/* Total sales count */}
        </CardContent>
      </Card>
      <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300'>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold text-blue-600'>
            ₹{purchasedCourses.reduce((total, purchase) => total + (purchase.amount || 0), 0)} {/* Sum of all amounts */}
          </p>
        </CardContent>
      </Card>
      <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold text-gray-700'>Course Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
              <XAxis
                dataKey='name'
                stroke='#6b7280'
                angle={-30} // Rotated labels for better visibility
                textAnchor='end'
                interval={0} // Display all labels
              />
              <YAxis stroke='#6b7280' />
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              <Line
                type='monotone'
                dataKey='price'
                stroke='#4a90e2' // Changed color to a different shade of blue
                strokeWidth={3}
                dot={{ stroke: '#4a90e2', strokeWidth: 2 }} // Same color for the dot
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashBoard;
