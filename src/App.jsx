// App.jsx
import { Routes, Route } from "react-router-dom"
import HomePage from "/src/HomePage"
import LoginPage from "/app/login/page"
import SignupPage from "/app/signup/page"
import CatalogPage from "/app/catalog/page"

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
