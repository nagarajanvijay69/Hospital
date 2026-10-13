export const backendUrl = 'http://localhost:4000'

export const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
  '03:00 PM', '04:00 PM', '05:00 PM'
]

export const SPECIALITIES = [
  'General Physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
  'Cardiologist',
  'Orthopedic',
  'ENT Specialist',
  'Psychiatrist'
]

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// Generate next 14 days for date selection
export const getAvailableDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    // Skip Sundays
    if (d.getDay() !== 0) {
      const day = d.toLocaleDateString('en-US', { weekday: 'short' })
      const dateStr = d.toLocaleDateString('en-GB').replace(/\//g, '_') // DD_MM_YYYY
      const display = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      dates.push({ day, dateStr, display, fullDate: d })
    }
  }
  return dates
}
