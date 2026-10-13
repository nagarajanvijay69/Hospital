const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-violet-50 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-extrabold gradient-text">About MedCare</h1>
          <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">
            We are dedicated to making quality healthcare accessible to everyone, everywhere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-8 animate-fadeIn">
            <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              To provide a seamless and efficient platform that connects patients with certified healthcare professionals,
              ensuring timely and quality medical consultations.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-8 animate-fadeIn">
            <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">👁️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              A world where every person has instant access to the healthcare they need, with technology
              bridging the gap between patients and doctors.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-500 to-violet-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Why Choose MedCare?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            {[
              { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is encrypted and kept confidential' },
              { icon: '⚡', title: 'Instant Booking', desc: 'Book an appointment in under 2 minutes' },
              { icon: '⭐', title: 'Verified Doctors', desc: 'All doctors are licensed and verified professionals' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-5">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-sky-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default About
