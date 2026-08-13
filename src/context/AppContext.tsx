import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Appointment, AppointmentStatus, BusinessSettings } from '../types'
import { storage } from '../services/localStorage'

interface AppointmentInput {
  customerName: string
  phone?: string
  date: string
  time: string
  slotPosition: number
  note: string
}

interface AppContextValue {
  appointments: Appointment[]
  settings: BusinessSettings
  addAppointment: (input: AppointmentInput) => Appointment
  updateAppointment: (id: string, input: AppointmentInput) => void
  setStatus: (id: string, status: AppointmentStatus) => void
  saveSettings: (settings: BusinessSettings) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState(storage.loadAppointments)
  const [settings, setSettings] = useState(storage.loadSettings)

  useEffect(() => storage.saveAppointments(appointments), [appointments])
  useEffect(() => storage.saveSettings(settings), [settings])

  const value = useMemo<AppContextValue>(() => ({
    appointments,
    settings,
    addAppointment: (input) => {
      const now = new Date().toISOString()
      const appointment: Appointment = { ...input, id: crypto.randomUUID(), status: 'pending', createdAt: now, updatedAt: now }
      setAppointments(current => [...current, appointment])
      return appointment
    },
    updateAppointment: (id, input) => setAppointments(current => current.map(item => item.id === id ? { ...item, ...input, updatedAt: new Date().toISOString() } : item)),
    setStatus: (id, status) => setAppointments(current => current.map(item => item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item)),
    saveSettings: setSettings,
  }), [appointments, settings])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp debe usarse dentro de AppProvider')
  return context
}
