import type { Appointment, BusinessSettings } from '../types'
import { createInitialAppointments, initialSettings } from '../data/mockData'

const APPOINTMENTS_KEY = 'turnia-barber:appointments'
const SETTINGS_KEY = 'turnia-barber:settings'

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

export const storage = {
  loadAppointments: () => read<Appointment[]>(APPOINTMENTS_KEY, createInitialAppointments()),
  saveAppointments: (appointments: Appointment[]) => localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments)),
  loadSettings: () => read<BusinessSettings>(SETTINGS_KEY, initialSettings),
  saveSettings: (settings: BusinessSettings) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)),
}
