import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, getAllDoctors, changeAvailability, aToken } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) getAllDoctors()
  }, [aToken])

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Doctors List</h1>
        <p className="text-slate-500 text-sm mt-1">Manage all registered doctors</p>
      </div>

      {doctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
          <div className="text-5xl mb-4">👨‍⚕️</div>
          <h3 className="text-lg font-semibold text-slate-700">No doctors yet</h3>
          <p className="text-slate-400 text-sm mt-1">Add your first doctor using the Add Doctor page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {doctors.map(doc => (
            <div key={doc._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 card-hover">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold shadow">
                  {doc.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">Dr. {doc.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{doc.speciality}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{doc.degree} · {doc.experience}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-slate-500">Fee: </span>
                  <span className="font-bold text-sky-600">₹{doc.fees}</span>
                </div>

                {/* Toggle availability */}
                <label className="relative inline-flex items-center cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    checked={doc.available}
                    onChange={() => changeAvailability(doc._id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-sky-500 transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 relative" />
                  <span className="text-xs font-medium text-slate-500">
                    {doc.available ? 'Available' : 'Unavailable'}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorsList
