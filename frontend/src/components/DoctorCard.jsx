import { useNavigate } from 'react-router-dom'

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate()

  const specialityColors = {
    'General Physician': 'from-sky-500 to-blue-600',
    'Gynecologist': 'from-pink-500 to-rose-600',
    'Dermatologist': 'from-orange-400 to-amber-500',
    'Pediatricians': 'from-green-400 to-emerald-500',
    'Neurologist': 'from-purple-500 to-violet-600',
    'Gastroenterologist': 'from-teal-400 to-cyan-500',
    'Cardiologist': 'from-red-400 to-red-600',
    'Orthopedic': 'from-indigo-400 to-indigo-600',
    'ENT Specialist': 'from-yellow-400 to-orange-400',
    'Psychiatrist': 'from-violet-400 to-purple-600',
  }

  const gradient = specialityColors[doctor.speciality] || 'from-sky-500 to-violet-600'

  return (
    <div
      onClick={() => { navigate(`/appointment/${doctor._id}`); scrollTo(0, 0) }}
      className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden card-hover cursor-pointer group"
    >
      {/* Avatar area */}
      <div className={`bg-gradient-to-br ${gradient} p-6 flex justify-center relative`}>
        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30 shadow-xl">
          {doctor.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        {/* Availability badge */}
        <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
          doctor.available
            ? 'bg-white/20 text-white'
            : 'bg-black/20 text-white/70'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-green-300 animate-pulse' : 'bg-gray-300'}`} />
          {doctor.available ? 'Available' : 'Unavailable'}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
          Dr. {doctor.name}
        </h3>
        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white`}>
          {doctor.speciality}
        </span>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {doctor.degree} · {doctor.experience}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Consultation Fee: <span className="font-semibold text-slate-700">₹{doctor.fees}</span>
          </div>
        </div>

        <button
          className={`mt-4 w-full py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r ${gradient} hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}
        >
          Book Appointment
        </button>
      </div>
    </div>
  )
}

export default DoctorCard
