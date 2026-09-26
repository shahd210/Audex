import { useState } from "react"
import { register } from "../../services/authApi"
import { BiShowAlt } from "react-icons/bi";
import { Link , useNavigate } from "react-router-dom";

const Register = () => {
  const [formData , setFormData]=useState({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "", 
  })
  const [error , setError]=useState({})
   const [agree , setAgree]=useState(false)
   const [showPass , setShowPass]=useState(false)
   const [showConfirmPass , setShowConfirmPass]=useState(false)
   const [loading , setLoading]= useState(false)
   const navigate = useNavigate()
  const handleSubmit=async(e)=>{
    e.preventDefault()
    const newError={}
    if(!formData.firstName){
      newError.firstName="First name is required"
    }
    if(!formData.lastName){
      newError.lastName="Last name is required"
    }
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
    if(!formData.confirmPassword){
      newError.confirmPassword="Confirm Password is required"
    }
    if(formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword){
     newError.confirmPassword="Passwords Don't Match"
    }
    if(!agree){
      newError.terms="You must agree to the Terms & Condition"
    }
    setError(newError)
    if(Object.keys(newError).length>0){
      return
    }
    setLoading(true)
try {
  const response = await register({
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    password: formData.password,
    password_confirmation: formData.confirmPassword,
  })

  if (response.success) {
    console.log("Registration successful:", response)

    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    navigate("/dashboard")
  } else {
    setError({ email: response.message })
  }

} catch (err) {
  console.log("Registration error:", err)
} finally {
  setLoading(false)
}
   
  }
 
  return (
    <div className='w-full max-w-md'>
            <p className='text-sm text-gray-500 mb-3 text-shadow-lg font-normal'>Welcome to AUDEX.</p>
      <h1 className='text-gray-700 text-3xl font-bold tracking-tight'>Create Your Account</h1>
      <p className='text-gray-500 mt-4 text- font-normal'>Create an account to get started with AUDEX.</p>
      <form onSubmit={handleSubmit}>
      <div className='grid grid-cols-2 gap-4 mt-8'>
        <div>
          <label htmlFor="FirstName" className='font-medium text-gray-700 text-sm block mb-2'>First Name</label>
          <input id="FirstName" type="text" placeholder='First Name' className='border border-gray-400 rounded-b-lg w-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow' value={formData.firstName}
          onChange={(e) => {setFormData({
              ...formData,
              firstName: e.target.value,
            })
          
            setError({
              ...error,
              firstName: "",
            })
            }}
 />
          {error.firstName &&(
            <p className="text-red-500 text-sm mt-1">{error.firstName}</p>
         ) }
        </div>
          <div>
          <label htmlFor="LasttName" className='font-medium text-gray-700 text-sm block mb-2'>Last Name</label>
          <input id="LasttName" type="text" placeholder='Last Name' className='border border-gray-400 rounded-b-xl w-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow' value={formData.lastName} 
           onChange={(e)=> {setFormData({
            ...formData,
            lastName: e.target.value,
            
          }) 
          setError({
              ...error,
              lastName: "",
            })}}
            />
          {error.lastName &&(
            <p className="text-red-500 text-sm mt-1">{error.lastName}</p>
         ) }
        </div>  
        </div>
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
      <div className='mt-3'>
        <label htmlFor="Confirm" className='font-medium text-gray-700 text-sm block mb-2'>Confirm Password</label>
    <div className="relative">
         <input id="Confirm" type={showConfirmPass?"text": "password"} placeholder='Confirm Your Password' className='border border-gray-400 rounded-b-xl w-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow' value={formData.confirmPassword} 
         onChange={(e)=> {setFormData({
            ...formData,
            confirmPassword: e.target.value,
          })
           setError({
              ...error,
              confirmPassword: "",
            })
          }}/>
         
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={()=>setShowConfirmPass(!showConfirmPass)}> <BiShowAlt /></button>
         </div>   
         {error.confirmPassword &&(
            <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>
         ) }
      </div>
      <div className="flex items-center gap-2 mt-3">
       <input type="checkbox" checked={agree} className='w-4 h-4 accent-blue-600' onChange={(e)=> {
        setAgree(e.target.checked)
        setError({
    ...error,
    terms: "",
  })
        } }/>
       <p className='text-sm text-gray-500'>I agree to the {""}<span className='cursor-pointer text-blue-600'>Terms & Conditions</span></p>
         </div>
          {error.terms &&(
            <p className="text-red-500 text-sm mt-1">{error.terms}</p>
         ) }
        <button type="submit" disabled={loading} className='w-full bg-[#0B1B3A] text-white rounded-lg font-medium mt-6 px-4 py-2 transition-all hover:bg-[#142952]  hover:duration-300 '>
          {loading?" Account is creating...":"Create Account"}</button>
          <div className="flex justify-center flex-col">
         <p className="text-gray-500 text-sm text-center mt-4">Already have an account?{""}</p>
         <Link to="/login" className="text-blue-600 font-semibold text-center">Login</Link>
    </div>
    </form>   
    </div>
  )
}

export default Register