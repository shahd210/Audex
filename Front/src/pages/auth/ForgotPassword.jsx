import {forgotPassword,verifyOtp, resetPassword,resendOtp} from "../../services/authApi";
import { Link } from "react-router-dom"
import { BiShowAlt } from "react-icons/bi"
import { useState } from "react"
const ForgotPassword = () => {
   const [email, setEmail] = useState("")
   const [error , setError]=useState({})
    const [loading , setLoading]= useState(false)
    const [otpStep, setOtpStep] = useState(false)
    const [otp, setOtp] = useState("")
    const [otpError, setOtpError] = useState("")
    const [otpLoading, setOtpLoading] = useState(false)
    const [otpReset, setOtpReset] = useState(false)
    const [resetToken, setResetToken] = useState("")
    const [resendLoading, setResendLoading] = useState(false)
    const [resendMessage, setResendMessage] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
       const [showPass , setShowPass]=useState(false)
   const [showConfirmPass , setShowConfirmPass]=useState(false)
    const [resetLoading, setResetLoading] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)
   const handleSubmit=async(e)=>{
    e.preventDefault()
    const newError={}
     if(!email){
      newError.email="Email is required" 
   }
    if(email &&  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      newError.email="Please Enter Valid Email"
    }
    setError(newError)
    if(Object.keys(newError).length>0){
      return
    }
     setLoading(true)
  try {
    const response = await forgotPassword({ email })

    if (response.success) {
      console.log("OTP sent:", response)
      setOtpStep(true)
    } else {
      setError({ email: response.message })
    }
  } catch (err) {
    console.log("Forgot password error:", err)
  } finally {
    setLoading(false)
  }
}
   const handleOtp=async(e)=>{
    e.preventDefault()
    if(!otp){
      setOtpError("Verification code is required")
      return
    }
    if (!/^\d{6}$/.test(otp)) {
    setOtpError("Please enter a valid 6-digit code")
    return
  }
  setOtpError("")
  setOtpLoading(true)
 try {
    const response = await verifyOtp({
      email,
      otp_code: otp,
    })

    if (response.success) {
      console.log("OTP verified:", response)

      setResetToken(response.data.reset_token)
      setOtpReset(true)
    } else {
      setOtpError(response.message)
    }
  } catch (err) {
    console.log("OTP verification error:", err)
    setOtpError("Something went wrong. Please try again.")
  } finally {
    setOtpLoading(false)
  }
}
   const handleResetPassword = async(e) => {
  e.preventDefault()
  let hasError = false
  setPasswordError("")
  setConfirmPasswordError("")
  if (!password) {
    setPasswordError("Password is required")
    hasError = true
  } 
   if (password && password.length < 8) {
    setPasswordError("Password must be at least 8 characters")
    hasError = true
  }
  if (!confirmPassword) {
    setConfirmPasswordError("Please confirm your password")
    hasError = true
  } 
   if (password && confirmPassword && password !== confirmPassword) {
    setConfirmPasswordError("Passwords do not match")
    hasError = true
  }

  if (hasError) {
    return
  }

  setResetLoading(true)

   try {
    const response = await resetPassword({
      email,
      reset_token: resetToken,
      password,
      password_confirmation: confirmPassword,
    })

    if (response.success) {
      console.log("Password reset successful:", response)

      setResetSuccess(true)
    } else {
      setPasswordError(response.message)
    }
  } catch (err) {
    console.log("Reset password error:", err)
    setPasswordError("Something went wrong. Please try again.")
  } finally {
    setResetLoading(false)
  }
}
const handleResendOtp = async () => {
  setResendLoading(true)
  setResendMessage("")
  setOtpError("")

  try {
    const response = await resendOtp({ email })

    if (response.success) {
      console.log("OTP resent:", response)
      setResendMessage(response.message)
      setOtp("")
    } else {
      setOtpError(response.message)
    }
  } catch (err) {
    console.log("Resend OTP error:", err)
    setOtpError("Something went wrong. Please try again.")
  } finally {
    setResendLoading(false)
  }
}
  return (
  
       <div className='w-full max-w-md'>
         {
          !otpStep? (
            <div>
             <p className='text-sm text-gray-500 mb-3 text-shadow-lg font-normal'>AUDEX Account Recovery.</p>
        <h1 className='text-gray-700 text-3xl font-bold tracking-tight'> Forgot Password? </h1>
       <p className='text-gray-500 mt-4 text- font-normal'>Enter your email address and we'll help you reset your password.</p>
              
            
                 <form onSubmit={handleSubmit}>
                  <div className='mt-3'>
        <label htmlFor="Email" className='font-medium text-gray-700 text-sm block mb-2'>Email</label>
        <input id="Email" type="email" placeholder='Enter Your E-mail' className='border border-gray-400 rounded-b-xl w-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow' value={email}
          onChange={(e)=> {setEmail( e.target.value)
           setError({
              ...error,
              email: "",
            })
          }}
            
          /> 
           {error.email &&(
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
         ) }
          </div>
          <button type="submit" disabled={loading} className='w-full bg-[#0B1B3A] text-white rounded-lg font-medium mt-6 px-4 py-2 transition-all hover:bg-[#142952]  hover:duration-300 '>{loading?"Sending...": "Send"}</button>
            </form> 
            </div>
          ):!otpReset?(
             <form onSubmit={handleOtp}>
     <p className='text-sm text-gray-500 mb-3 text-shadow-lg font-normal'>AUDEX Account Verification</p>
      <h1 className='text-gray-700 text-3xl font-bold tracking-tight'>Verify your email</h1>
     <p className='text-gray-500 mt-4 text- font-normal'> We’ve sent a 6-digit verification code to your email.</p>
<div className="mt-6">
      <label htmlFor="otp" className="font-medium text-gray-700 text-sm block mb-2"> Verification Code</label>
      <input id="otp" type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit code" className="border border-gray-400 rounded-xl w-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow text-center tracking-[0.5em]" value={otp} 
      onChange={(e) =>{setOtp(e.target.value)
        setOtpError("")}
      }/>
       {otpError && (
        <p className="text-red-500 text-sm mt-1">
          {otpError}
        </p>
      )}
    </div>
    <button type="submit" disabled={otpLoading}  className="w-full bg-[#0B1B3A] text-white rounded-lg font-medium mt-6 px-4 py-2 transition-all hover:bg-[#142952]" > {otpLoading?"Verifing...": "Verify Code" }</button>

    <p className="text-sm text-gray-500 text-center mt-4">Didn’t receive the code?{" "}
      <button type="button" onClick={handleResendOtp}  disabled={resendLoading} className="text-blue-600 font-medium hover:underline"> {resendLoading ? "Sending..." : "Resend"}</button>
    </p>
    {resendMessage && (
  <p className="text-green-600 text-sm text-center mt-2">
    {resendMessage}
  </p>
)}
  </form>
          ) :!resetSuccess ?(
<form onSubmit={handleResetPassword}>
  <p className="text-sm text-gray-500 mb-3"> AUDEX Account Recovery</p>
  <h1 className="text-gray-700 text-3xl font-bold tracking-tight"> Create New Password</h1>
  <p className="text-gray-500 mt-4">Create a new password for your AUDEX account.</p>
  <div className="mt-6 relative">
    <label htmlFor="password" className="font-medium text-gray-700 text-sm block mb-2">New Password</label>
    <input id="password" type={showPass ? "text" : "password"} placeholder="Enter new password" className="border border-gray-400 rounded-xl w-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow" value={password}
      onChange={(e) => {
        setPassword(e.target.value)
        setPasswordError("")
      }}/> 
      {passwordError &&(
         <p className="text-red-500 text-sm mt-1">{passwordError}</p>
      )}
        <button type="button" className="absolute right-3 top-13 -translate-y-1/2" onClick={()=>setShowPass(!showPass)}> <BiShowAlt /></button>
  </div>
  <div className="mt-4 relative">
    <label htmlFor="confirmPassword" className="font-medium text-gray-700 text-sm block mb-2" >
      Confirm Password
    </label>

    <input id="confirmPassword" type={showConfirmPass ? "text" : "password"} placeholder="Confirm new password" className="border border-gray-400 rounded-xl w-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 shadow" value={confirmPassword}
      onChange={(e) => {
        setConfirmPassword(e.target.value)
        setConfirmPasswordError("")
      }}/>
      {confirmPasswordError&&(
        <p className="text-red-500 text-sm mt-1"> {confirmPasswordError}</p>
      )}
          <button type="button" className="absolute right-3 top-13 -translate-y-1/2" onClick={()=>setShowConfirmPass(!showConfirmPass)}> <BiShowAlt /></button>
      
  </div>
  
  <button type="submit" disabled={resetLoading} className="w-full bg-[#0B1B3A] text-white rounded-lg font-medium mt-6 px-4 py-2 transition-all hover:bg-[#142952] disabled:opacity-60 disabled:cursor-not-allowed">{resetLoading ? "Updating..." : "Update Password"}</button>
</form>
          ) : (
                <div className="w-full max-w-md text-center">
      <p className="text-sm text-gray-500 mb-3">AUDEX Account Recovery  </p>
      <h1 className="text-gray-700 text-3xl font-bold tracking-tight">Password Updated</h1>
      <p className="text-gray-500 mt-4"> Password Updated Successfully.</p>
      <Link  to="/login" className="block w-full bg-[#0B1B3A] text-white rounded-lg font-medium mt-6 px-4 py-2"> Back to Login</Link>
    </div>
          )
        }
        
    </div>
  )
}

export default ForgotPassword