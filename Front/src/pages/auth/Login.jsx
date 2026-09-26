import { login} from "../../services/authApi";
import { useState } from "react"
import { BiShowAlt } from "react-icons/bi";
import { Link , useNavigate } from 'react-router-dom';
const Login = () => {
  const [formData , setFormData]=useState({
  email: "",
  password: "",
  })
  
  const [error , setError]=useState({})
   const [showPass , setShowPass]=useState(false)
     const [loading , setLoading]= useState(false)
    const [rememberMe , setRememberMe] = useState(false)
    const navigate = useNavigate()
const handleSubmit=async(e)=>{
    e.preventDefault()
    const newError={}
   if(!formData.email){
      newError.email="Email is required" 
   }
    if(formData.email &&  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){
      newError.email="Please Enter Valid Email"
    }
    if(!formData.password){
      newError.password="Password is required"
    }
    if(formData.password && formData.password.length<8){
      newError.password="Password must be at least 8 characters"
    }
    setError(newError)
    if(Object.keys(newError).length>0){
      return
    }
 setLoading(true)

try {
  const response = await login({
    email: formData.email,
    password: formData.password,
  })

  if (response.success) {
    console.log("Login successful:", response)

    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user",JSON.stringify(response.data.user))
    navigate("/dashboard")
  }

} catch (err) {
  console.log("Login error:", err)
} finally {
  setLoading(false)
}
   
  }


  return (
  
    <div className='w-full max-w-md'>
            <p className='text-sm text-gray-500 mb-3 text-shadow-lg font-normal'>Welcome back to AUDEX.</p>
      <h1 className='text-gray-700 text-3xl font-bold tracking-tight'>Welcome Back</h1>
      <p className='text-gray-500 mt-4 text- font-normal'> Login to your account to continue.</p>
            <form onSubmit={handleSubmit}>

      <div className='mt-3'>
        <label htmlFor="Email" className='font-medium text-gray-700 text-sm block mb-2'>Email</label>
        <input id="Email" type="email" placeholder='Enter Your E-mail' className='border border-gray-400 rounded-b-xl w-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow' value={formData.email}
         onChange={(e)=> {setFormData({
            ...formData,
            email: e.target.value,
          })
         setError({
              ...error,
              email: "",
            })
          } }/>
          {error.email &&(
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
         ) }
      </div>
       <div className='mt-3'>
        <label htmlFor="Pass" className='font-medium text-gray-700 text-sm block mb-2'>Password</label>
  <div className="relative">    
      <input id="Pass" type={showPass?"text":"password"} placeholder='Enter Your Password' className='border border-gray-400 rounded-b-xl w-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow' value={formData.password} 
         onChange={(e)=> {setFormData({
            ...formData,
            password: e.target.value,
          })
           setError({
              ...error,
              password: "",
            })
          }}/>
         
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={()=>setShowPass(!showPass)}> <BiShowAlt /></button>
          </div> 
          {error.password &&(
            <p className="text-red-500 text-sm mt-1">{error.password}</p>
         ) }
      </div>
      <div className="flex items-center justify-between mt-4">
      <label className='flex items-center gap-2 text-sm text-gray-500'>
        <input type="checkbox" checked={rememberMe} onChange={(e)=>{
          setRememberMe(e.target.checked)
        }} />
        Remember Me
      </label>
      <Link to="/forgot-password" className='text-sm text-blue-600 font-medium'>Forgot Password</Link>
      </div>
      
        <button type="submit" disabled={loading} className='w-full bg-[#0B1B3A] text-white rounded-lg font-medium mt-6 px-4 py-2 transition-all hover:bg-[#142952]  hover:duration-300 '>
          {loading?"Logging in..." : "Login"}</button>

      <div className="flex justify-center flex-col">
         <p className="text-gray-500 text-sm text-center mt-4">Don't have an account?{""}</p>
         <Link to="/register" className="text-blue-600 font-semibold text-center">Sign Up</Link>
    </div>
    </form> 
      </div>
  )
}
export default Login