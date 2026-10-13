import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext)

  useEffect(() => {
    if (dToken) getDashData()
  }, [dToken])

  if (!dashData) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    { label: "Today's Earnings", value: `₹${dashData.earnings}`, icon: '💰', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50' },
    { label: 'Total Appointments', value: dashData.appointments, icon: '📅', color: 'from-sky-500 to-cyan-500', bg: 'bg-sky-50' },
    { label: 'Total Patients', value: dashData.patients, icon: '👥', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50' },
  ]

  return (
    <div className="p-6 animate-fadeIn space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Doctor Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Your appointment overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <div key={i} className={`${card.bg} rounded-2xl p-6 border border-white shadow-sm card-hover`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{card.label}</p>
                <p className={`text-3xl font-extrabold mt-1 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.value}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl shadow-lg`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Appointments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Latest Appointments</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {dashData.latestAppointments.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No appointments yet.</div>
          ) : (
            dashData.latestAppointments.map(appt => (
              <div key={appt._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                  {appt.userData?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{appt.userData?.name}</p>
                  <p className="text-xs text-slate-400">{appt.slotDate?.replace(/_/g, '/')} at {appt.slotTime}</p>
                  {appt.symptoms && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">Symptoms: {appt.symptoms}</p>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  appt.cancelled ? 'bg-red-100 text-red-600' :
                  appt.isCompleted ? 'bg-green-100 text-green-600' :
                  'bg-sky-100 text-sky-600'
                }`}>
                  {appt.cancelled ? 'Cancelled' : appt.isCompleted ? 'Completed' : 'Upcoming'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
