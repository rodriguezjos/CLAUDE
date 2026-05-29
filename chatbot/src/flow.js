// Conversation step definitions
export const STEPS = {
  WELCOME: 'WELCOME',
  REASON: 'REASON',
  DATE: 'DATE',
  TIME: 'TIME',
  NAME: 'NAME',
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  CONFIRM: 'CONFIRM',
  DONE: 'DONE',
}

export const REASONS = [
  'Consulta técnica de topografía',
  'Levantamiento de terreno',
  'Replanteo de obra',
  'Procesamiento de datos',
  'Otro',
]

// Simulated available dates (next 7 working days from today)
export function getAvailableDates() {
  const dates = []
  const today = new Date()
  let added = 0
  let offset = 1

  while (added < 6) {
    const d = new Date(today)
    d.setDate(today.getDate() + offset)
    const day = d.getDay()
    if (day !== 0 && day !== 6) {
      dates.push(d)
      added++
    }
    offset++
  }

  return dates
}

export function formatDate(date) {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

// Simulated available time slots
export const TIME_SLOTS = [
  '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00',
]

export function getInitialState() {
  return {
    step: STEPS.WELCOME,
    reason: null,
    date: null,
    time: null,
    name: null,
    email: null,
    phone: null,
  }
}
