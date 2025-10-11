"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { auth, googleProvider } from "../../src/utils/firebase"
import { signInWithPopup } from "firebase/auth"
import "./LoginPage.css"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email: formData.email,
        password: formData.password,
      })

      console.log("Login success:", res.data)

      // Simpan token dari response backend
      localStorage.setItem("token", res.data.accessToken)

      // Redirect setelah login
      window.location.href = "/catalog"
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response.data)
        alert(err.response.data.message || "Email atau password salah")
      } else {
        console.error("Error:", err.message)
        alert("Terjadi kesalahan jaringan")
      }
    }
  }

    // ===== LOGIN GOOGLE =====
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()

      const res = await axios.post("http://localhost:3000/auth/google/login", { token })

      console.log("Google signup success:", res.data)
      window.location.href = "/catalog"
    } catch (err) {
      console.error("Google Login error:", err)
      alert("Gagal login dengan Google")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="organic-shape shape-1"></div>
        <div className="organic-shape shape-2"></div>
        <div className="organic-shape shape-3"></div>
        <div className="organic-shape shape-4"></div>
      </div>

      <div className="auth-content">
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Selamat Datang</h1>
            <p>Masuk ke akun anda</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="supplier.buah@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Kata Sandi</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  Tampilkan
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} />
                <span className="checkmark"></span>
                Ingat saya
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="auth-submit-btn">
              Masuk
            </button>

            <div className="auth-divider">
              <span>atau</span>
            </div>

            <button type="button" className="google-auth-btn" onClick={handleGoogleLogin}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Masuk dengan Google
            </button>

            <div className="auth-footer">
              <span>Belum punya akun? </span>
              <Link to="/register" className="auth-link">
                Buat akun
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
