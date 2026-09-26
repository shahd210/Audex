import { Routes , Route ,Navigate } from 'react-router-dom'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'
import ForgotPassword from '../pages/auth/ForgotPassword'
import AuthLayout from '../components/auth/AuthLayout'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from '../components/ProtectedRoute'
const AppRoutes = () => {
  return (
  <Routes>
    <Route element={<AuthLayout/>} >
   <Route index  element={<Navigate to= "/login"/> } />
   <Route path='/login' element={<Login/>}/>
   <Route path='/register' element={<Register/>}/>
   <Route path='/forgot-password' element={<ForgotPassword/>}/>
</Route>
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
    </Routes>
  )
}

export default AppRoutes