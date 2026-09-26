import { useNavigate } from "react-router-dom"
import { logout } from "../services/authApi"

const Dashboard = () => {
  const navigate = useNavigate()

const handleLogout = async () => {
  console.log("Logout button clicked")

  try {
    const response = await logout()

    console.log("Logout response:", response)

    if (response.success) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      navigate("/login")
    }
  } catch (err) {
    console.log("Logout error:", err)
  }
}

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1B3A]">
            Welcome to AUDEX
          </h1>

          <p className="text-gray-500 mt-2">
            This is your AUDEX dashboard.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#0B1B3A] text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard