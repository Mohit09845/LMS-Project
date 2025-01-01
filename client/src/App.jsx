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
import SearchPage from './pages/student/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoutes'
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute'
import { ThemeProvider } from './components/ThemeProvider'

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
            <Courses />
          </>
        )
      },
      {
        path: 'login',
        element: <AuthenticatedUser><Login /></AuthenticatedUser>
      },
      {
        path: 'my-learning',
        element: <ProtectedRoute><MyLearning /></ProtectedRoute>
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: 'course/search',
        element: <ProtectedRoute><SearchPage /></ProtectedRoute>
      },
      {
        path: 'course-detail/:courseId',
        element: <ProtectedRoute><CourseDetail /></ProtectedRoute>
      },
      {
        path: 'course-progress/:courseId',
        element: <ProtectedRoute>
          <PurchaseCourseProtectedRoute>
            <CourseProgress />
          </PurchaseCourseProtectedRoute>
        </ProtectedRoute>
      },
      {
        path: 'admin',
        element: <AdminRoute><SideBar /></AdminRoute>,
        children: [
          {
            path: 'dashboard',
            element: <DashBoard />
          },
          {
            path: 'course',
            element: <CourseTable />
          },
          {
            path: 'course/create',
            element: <AddCourse />
          },
          {
            path: 'course/:courseId',
            element: <EditCourse />
          },
          {
            path: 'course/:courseId/lecture',
            element: <CreateLecture />
          },
          {
            path: 'course/:courseId/lecture/:lectureId',
            element: <EditLecture />
          }
        ]
      }
    ]
  }
])


function App() {

  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App
