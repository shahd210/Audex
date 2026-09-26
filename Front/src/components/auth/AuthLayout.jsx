import { Outlet } from "react-router-dom"
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex flex-col justify-center text-white bg-[#0B1B3A] px-16 relative overflow-hidden">
      <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
       <h1 className="font-bold text-5xl tracking-wider"> Audex </h1>
       <h2 className="font-semibold mt-16 text-4xl leading-tight">  Smarter decisions  <br /> for better education</h2>
       <p className="text-lg leading-8 text-gray-400 mt-6 max-w-lg "> AUDEX helps schools turn data into insights,simulations into opportunities, and decisions into better outcomes.</p>
      </div>

      <div className="flex justify-center items-center w-1/2 px-12 bg-[#fdfdfd]">
        <Outlet/> 
      </div>
       
    </div>
  )
}

export default AuthLayout