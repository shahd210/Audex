const API_URL = "http://127.0.0.1:8000/api/auth"

export const login = async ({ email, password }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw {
      success: false,
      message: data.message || "Login failed.",
      errors: data.errors || {},
    }
  }

  return data
}

export const register = async ({
  name,
  email,
  phone,
  password,
  password_confirmation,
}) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
      password_confirmation,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw {
      success: false,
      message: data.message || "Registration failed.",
      errors: data.errors || {},
    }
  }

  return data
}

export const forgotPassword = async ({ email }) => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw {
      success: false,
      message: data.message || "Failed to send OTP.",
      errors: data.errors || {},
    }
  }

  return data
}

export const verifyOtp = async ({ email, otp_code }) => {
  const response = await fetch(`${API_URL}/verify-otp`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      otp_code,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw {
      success: false,
      message: data.message || "OTP verification failed.",
      errors: data.errors || {},
    }
  }

  return data
}

export const resetPassword = async ({
  email,
  reset_token,
  password,
  password_confirmation,
}) => {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      reset_token,
      password,
      password_confirmation,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw {
      success: false,
      message: data.message || "Password reset failed.",
      errors: data.errors || {},
    }
  }

  return data
}

export const resendOtp = async ({ email }) => {
  const response = await fetch(`${API_URL}/resend-otp`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw {
      success: false,
      message: data.message || "Failed to resend OTP.",
      errors: data.errors || {},
    }
  }

  return data
}

export const logout = async () => {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw {
      success: false,
      message: data.message || "Logout failed.",
      errors: data.errors || {},
    }
  }

  return data
}