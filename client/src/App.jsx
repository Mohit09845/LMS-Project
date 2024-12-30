import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login'
import HeroSection from './pages/student/HeroSection'
import MainLayout from './Layout/MainLayout'
import Courses from './pages/student/Courses'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import SideBar from './pages/admin/SideBar'
import DashBoard from './pages/admin/DashBoard'
import AddCourse from './pages/admin/course/AddCourse'
import CourseTable from './pages/admin/course/CourseTable'
import EditCourse from './pages/admin/course/EditCourse'
import { CreateLecture } from './pages/admin/Lecture/CreateLecture'
import EditLecture from './pages/admin/Lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <>
            <HeroSection />
            <Courses/>
          </>
        )
      },
      {
        path: 'login',
        element: <Login/>
      },
      {
        path: 'my-learning',
        element: <MyLearning/>
      },
      {
        path: 'profile',
        element: <Profile/>
      },
      {
        path: 'course-detail/:courseId',
        element: <CourseDetail/>
      },
      {
        path: 'course-progress/:courseId',
        element: <CourseProgress/>
      },
      {
        path: 'admin',
        element: <SideBar/>,
        children: [
          {
            path: 'dashboard',
            element: <DashBoard/>
          },
          {
            path: 'course',
            element: <CourseTable/>
          },
          {
            path: 'course/create',
            element: <AddCourse/>
          },
          {
            path: 'course/:courseId',
            element: <EditCourse/>
          },
          {
            path: 'course/:courseId/lecture',
            element: <CreateLecture/>
          },
          {
            path: 'course/:courseId/lecture/:lectureId',
            element: <EditLecture/>
          }
        ]
      }
    ]
  }
])


function App() {

  return (
    <main>
      <RouterProvider router={appRouter}/>
    </main>

  )
}

export default App
