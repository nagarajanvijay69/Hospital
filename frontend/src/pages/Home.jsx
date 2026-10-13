import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from '../components/DoctorCard'
import { SPECIALITIES } from '../utils/constants'

const Home = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const stats = [
    { value: '500+', label: 'Expert Doctors', icon: '👨‍⚕️' },
    { value: '50K+', label: 'Happy Patients', icon: '😊' },
    { value: '10+', label: 'Specialities', icon: '🏥' },
    { value: '24/7', label: 'Support', icon: '🕐' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-900 via-slate-800 to-violet-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-sky-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Doctors Available Now
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Book Your Doctor
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-violet-300">
                Appointment Online
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8">
              Connect with certified doctors across specialities. Schedule appointments in minutes, get consultations from top healthcare professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/doctors')}
                className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-base hover:scale-105 hover:shadow-2xl transition-all duration-200"
              >
                Find a Doctor →
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-slate-300 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Specialities */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800">Browse by Speciality</h2>
          <p className="text-slate-500 mt-2">Choose from our wide range of specialist doctors</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {SPECIALITIES.map((spec, i) => (
            <button
              key={i}
              onClick={() => navigate(`/doctors?speciality=${encodeURIComponent(spec)}`)}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center hover:border-sky-300 hover:shadow-md hover:scale-105 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 mx-auto mb-2 flex items-center justify-center text-white text-xl">
                {['🩺','👩‍⚕️','🌟','👶','🧠','🫁','❤️','🦴','👂','🧘'][i]}
              </div>
              <span className="text-xs font-medium text-slate-600 group-hover:text-sky-600 transition-colors">
                {spec}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="bg-gradient-to-br from-sky-50 to-violet-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Top Doctors</h2>
              <p className="text-slate-500 mt-1">Book appointment with verified specialists</p>
            </div>
            <button
              onClick={() => navigate('/doctors')}
              className="px-5 py-2.5 rounded-xl border-2 border-sky-500 text-sky-600 font-semibold hover:bg-sky-500 hover:text-white transition-all duration-200"
            >
              View All
            </button>
          </div>
          {doctors.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="text-5xl mb-4">🏥</div>
              <p className="text-lg">No doctors added yet. Check back soon!</p>
              <p className="text-sm mt-1">Admin can add doctors from the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {doctors.slice(0, 8).map(doc => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">How It Works</h2>
          <p className="text-slate-500 mt-2">Book your appointment in 3 simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Choose a Doctor', desc: 'Browse our verified specialists by speciality or search by name.', icon: '🔍' },
            { step: '02', title: 'Select a Slot', desc: 'Pick an available morning (10AM–1PM) or afternoon (3PM–6PM) slot.', icon: '📅' },
            { step: '03', title: 'Confirm Booking', desc: 'Fill in health details and confirm. Get instant appointment confirmation.', icon: '✅' },
          ].map((item, i) => (
            <div key={i} className="relative p-8 rounded-2xl bg-white shadow-md border border-slate-100 text-center group hover:shadow-xl transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-violet-600 text-white text-xs font-bold flex items-center justify-center">
                {item.step}
              </div>
              <div className="text-4xl mb-4 mt-2">{item.icon}</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-sky-500 to-violet-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Appointment?</h2>
          <p className="text-sky-100 text-lg mb-8">Join thousands of patients who trust MedCare for their healthcare needs.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 rounded-2xl bg-white text-slate-900 font-bold text-base hover:scale-105 hover:shadow-2xl transition-all duration-200"
          >
            Get Started Today →
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
