// App.jsx
import { Routes, Route } from "react-router-dom"
import HomePage from "/src/HomePage"
import LoginPage from "/App/login/page"
import SignupPage from "/App/signup/page"
import CatalogPage from "/App/catalog/page"

export default function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
    </Routes>
  )
}
