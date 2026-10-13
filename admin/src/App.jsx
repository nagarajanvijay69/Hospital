import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'

import Login from './pages/Login'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AddDoctor from './pages/admin/AddDoctor'
import DoctorsList from './pages/admin/DoctorsList'
import AdminAppointments from './pages/admin/AdminAppointments'

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfile from './pages/doctor/DoctorProfile'

function App() {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  const isLoggedIn = aToken || dToken

  if (!isLoggedIn) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <Login />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto min-h-[calc(100vh-64px)]">
          <Routes>
            {/* Admin routes */}
            {aToken && (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/add-doctor" element={<AddDoctor />} />
                <Route path="/admin/doctors-list" element={<DoctorsList />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </>
            )}
            {/* Doctor routes */}
            {dToken && (
              <>
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                <Route path="/doctor/profile" element={<DoctorProfile />} />
                <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
