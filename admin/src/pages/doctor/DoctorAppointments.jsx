import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const [notesModal, setNotesModal] = useState(null) // { appointmentId, notes, prescription }

  useEffect(() => {
    if (dToken) getAppointments()
  }, [dToken])

  const handleComplete = (appt) => {
    setNotesModal({ appointmentId: appt._id, notes: '', prescription: '' })
  }

  const confirmComplete = async () => {
    await completeAppointment(notesModal.appointmentId, notesModal.notes, notesModal.prescription)
    setNotesModal(null)
  }

  // Group by date
  const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '_')
  const upcoming = appointments.filter(a => !a.cancelled && !a.isCompleted)
  const completed = appointments.filter(a => a.isCompleted)
  const cancelled = appointments.filter(a => a.cancelled)

  const tabs = [
    { label: 'Upcoming', data: upcoming, color: 'text-sky-600 border-sky-500' },
    { label: 'Completed', data: completed, color: 'text-green-600 border-green-500' },
    { label: 'Cancelled', data: cancelled, color: 'text-red-500 border-red-400' },
  ]
  const [activeTab, setActiveTab] = useState(0)

  const currentData = tabs[activeTab].data

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">My Appointments</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your patient appointments</p>
      </div>

      {/* Schedule info banner */}
      <div className="bg-gradient-to-r from-sky-50 to-violet-50 border border-sky-100 rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-lg">🌅</span>
          <span className="font-semibold">Morning Session:</span>
          <span>10:00 AM – 01:00 PM</span>
        </div>
        <div className="w-px h-4 bg-slate-300 hidden sm:block" />
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-lg">🌆</span>
          <span className="font-semibold">Afternoon Session:</span>
          <span>03:00 PM – 05:00 PM</span>
        </div>
        <div className="w-px h-4 bg-slate-300 hidden sm:block" />
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-lg">⏱️</span>
          <span>1 hour per slot</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === i
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === i ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {tab.data.length}
            </span>
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      {currentData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-400">No {tabs[activeTab].label.toLowerCase()} appointments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentData.map(appt => (
            <div key={appt._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Patient Avatar + Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                    {appt.userData?.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{appt.userData?.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{appt.userData?.email}</p>

                    {/* Appointment time */}
                    <div className="mt-2 flex flex-wrap gap-3">
                      <div className="flex items-center gap-1.5 text-sm">
                        <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-slate-600 font-medium">{appt.slotDate?.replace(/_/g, '/')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-slate-600 font-medium">{appt.slotTime}</span>
                        <span className="text-slate-400 text-xs">(1 hour)</span>
                      </div>
                    </div>

                    {/* Health Details */}
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {appt.age > 0 && (
                        <div className="text-xs bg-slate-50 rounded-lg px-3 py-1.5 text-slate-600">
                          <span className="font-semibold">Age:</span> {appt.age} years
                        </div>
                      )}
                      {appt.bloodGroup && (
                        <div className="text-xs bg-red-50 rounded-lg px-3 py-1.5 text-red-600">
                          <span className="font-semibold">Blood Group:</span> {appt.bloodGroup}
                        </div>
                      )}
                    </div>
                    {appt.symptoms && (
                      <div className="mt-1.5 text-xs bg-amber-50 rounded-lg px-3 py-1.5 text-amber-700 border border-amber-100">
                        <span className="font-semibold">Symptoms:</span> {appt.symptoms}
                      </div>
                    )}
                    {appt.medicalHistory && (
                      <div className="mt-1.5 text-xs bg-violet-50 rounded-lg px-3 py-1.5 text-violet-700 border border-violet-100">
                        <span className="font-semibold">Medical History:</span> {appt.medicalHistory}
                      </div>
                    )}

                    {/* Doctor notes (if completed) */}
                    {appt.isCompleted && appt.doctorNotes && (
                      <div className="mt-1.5 text-xs bg-green-50 rounded-lg px-3 py-1.5 text-green-700 border border-green-100">
                        <span className="font-semibold">Your Notes:</span> {appt.doctorNotes}
                      </div>
                    )}
                    {appt.isCompleted && appt.prescription && (
                      <div className="mt-1.5 text-xs bg-sky-50 rounded-lg px-3 py-1.5 text-sky-700 border border-sky-100">
                        <span className="font-semibold">Prescription:</span> {appt.prescription}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!appt.cancelled && !appt.isCompleted && (
                  <div className="flex sm:flex-col gap-2 justify-end shrink-0">
                    <button
                      onClick={() => handleComplete(appt)}
                      className="px-4 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Cancel this appointment?')) cancelAppointment(appt._id)
                      }}
                      className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-100 transition-all flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete with Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">Complete Appointment</h3>
              <p className="text-slate-500 text-sm mt-1">Add consultation notes and prescription (optional)</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Doctor Notes / Diagnosis</label>
                <textarea
                  value={notesModal.notes}
                  onChange={e => setNotesModal(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  placeholder="Diagnosis, observations, recommendations..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Prescription</label>
                <textarea
                  value={notesModal.prescription}
                  onChange={e => setNotesModal(p => ({ ...p, prescription: e.target.value }))}
                  rows={3}
                  placeholder="Medications, dosage, instructions..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm resize-none"
                />
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={confirmComplete}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm hover:shadow-md transition-all"
              >
                Mark as Complete
              </button>
              <button
                onClick={() => setNotesModal(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments
