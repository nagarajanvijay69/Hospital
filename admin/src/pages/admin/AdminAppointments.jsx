import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const AdminAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) getAllAppointments()
  }, [aToken])

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">All Appointments</h1>
        <p className="text-slate-500 text-sm mt-1">Manage all patient appointments</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[50px_1fr_1fr_120px_100px_80px_80px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <span>#</span>
          <span>Patient</span>
          <span>Doctor</span>
          <span>Date & Time</span>
          <span>Fee</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="text-4xl mb-3">📋</div>
            <p>No appointments found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {appointments.map((appt, index) => (
              <div key={appt._id} className="grid grid-cols-1 md:grid-cols-[50px_1fr_1fr_120px_100px_80px_80px] gap-4 px-5 py-4 items-start md:items-center hover:bg-slate-50 transition-colors">
                <span className="text-slate-400 text-sm font-medium hidden md:block">{index + 1}</span>

                {/* Patient */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                    {appt.userData?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{appt.userData?.name}</p>
                    <p className="text-xs text-slate-400">{appt.userData?.email}</p>
                    {appt.symptoms && <p className="text-xs text-slate-400 mt-0.5 max-w-[150px] truncate">Symptoms: {appt.symptoms}</p>}
                  </div>
                </div>

                {/* Doctor */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {appt.docData?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Dr. {appt.docData?.name}</p>
                    <p className="text-xs text-slate-400">{appt.docData?.speciality}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-sm font-medium text-slate-700">{appt.slotDate?.replace(/_/g, '/')}</p>
                  <p className="text-xs text-slate-400">{appt.slotTime}</p>
                </div>

                {/* Fee */}
                <span className="text-sm font-bold text-sky-600">₹{appt.amount}</span>

                {/* Status */}
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                  appt.cancelled ? 'bg-red-100 text-red-600' :
                  appt.isCompleted ? 'bg-green-100 text-green-600' :
                  'bg-sky-100 text-sky-600'
                }`}>
                  {appt.cancelled ? 'Cancelled' : appt.isCompleted ? 'Completed' : 'Upcoming'}
                </span>

                {/* Action */}
                <div>
                  {!appt.cancelled && !appt.isCompleted ? (
                    <button
                      onClick={() => {
                        if (window.confirm('Cancel this appointment?')) cancelAppointment(appt._id)
                      }}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                      title="Cancel"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAppointments
