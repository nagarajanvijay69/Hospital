import { useContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from '../components/DoctorCard'
import { SPECIALITIES } from '../utils/constants'

const Doctors = () => {
  const { doctors } = useContext(AppContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedSpec, setSelectedSpec] = useState(searchParams.get('speciality') || '')

  useEffect(() => {
    const spec = searchParams.get('speciality') || ''
    setSelectedSpec(spec)
  }, [searchParams])

  const filtered = doctors.filter(doc => {
    const matchSpec = selectedSpec ? doc.speciality === selectedSpec : true
    const matchSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(search.toLowerCase())
    return matchSpec && matchSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-violet-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-extrabold gradient-text">Our Doctors</h1>
          <p className="text-slate-500 mt-2">Find and book appointments with top specialists</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or speciality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-slate-700"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Filters */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-24">
              <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">Speciality</h3>
              <button
                onClick={() => { setSelectedSpec(''); setSearchParams({}) }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium mb-1 transition-all ${
                  !selectedSpec
                    ? 'bg-sky-50 text-sky-600 border border-sky-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Doctors
              </button>
              {SPECIALITIES.map(spec => (
                <button
                  key={spec}
                  onClick={() => { setSelectedSpec(spec); setSearchParams({ speciality: spec }) }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium mb-1 transition-all ${
                    selectedSpec === spec
                      ? 'bg-sky-50 text-sky-600 border border-sky-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </aside>

          {/* Doctors Grid */}
          <div className="flex-1">
            {/* Mobile filter chips */}
            <div className="flex gap-2 flex-wrap mb-6 md:hidden">
              <button
                onClick={() => { setSelectedSpec(''); setSearchParams({}) }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  !selectedSpec ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                All
              </button>
              {SPECIALITIES.map(spec => (
                <button
                  key={spec}
                  onClick={() => { setSelectedSpec(spec); setSearchParams({ speciality: spec }) }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedSpec === spec ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-5">
              <p className="text-slate-500 text-sm">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> doctor{filtered.length !== 1 ? 's' : ''}
                {selectedSpec && <span> in <span className="text-sky-600">{selectedSpec}</span></span>}
              </p>
              {selectedSpec && (
                <button
                  onClick={() => { setSelectedSpec(''); setSearchParams({}) }}
                  className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1"
                >
                  Clear filter ✕
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-slate-700">No doctors found</h3>
                <p className="text-slate-400 text-sm mt-1">
                  {doctors.length === 0
                    ? 'No doctors have been added yet. Admin needs to add doctors.'
                    : 'Try changing your search or filter.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
                {filtered.map(doc => (
                  <DoctorCard key={doc._id} doctor={doc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors
