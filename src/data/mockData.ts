import type { Appointment, BusinessSettings } from '../types'
import { toLocalDateKey } from '../utils/date'

export const initialSettings: BusinessSettings = {
  businessName: 'German Spa Urbano',
  openingDays: [1, 2, 3, 4, 5, 6],
  openingTime: '10:00',
  closingTime: '19:00',
  slotDurationMinutes: 30,
  maxAppointmentsPerSlot: 3,
}

export function createInitialAppointments(): Appointment[] {
  const now = new Date().toISOString()
  const today = toLocalDateKey()
  return [
    { id: 'demo-1', customerName: 'Martín Alvarez', phone: '11 5821-3046', date: today, time: '10:00', slotPosition: 1, note: 'Corte clásico', status: 'confirmed', createdAt: now, updatedAt: now },
    { id: 'demo-2', customerName: 'Nicolás Duarte', phone: '11 4038-9210', date: today, time: '11:30', slotPosition: 1, note: 'Corte y barba', status: 'pending', createdAt: now, updatedAt: now },
    { id: 'demo-3', customerName: 'Facundo Ruiz', date: today, time: '11:30', slotPosition: 2, note: 'Perfilado de barba', status: 'confirmed', createdAt: now, updatedAt: now },
    { id: 'demo-4', customerName: 'Santiago López', phone: '11 6782-1140', date: today, time: '14:00', slotPosition: 1, note: 'Corte', status: 'completed', createdAt: now, updatedAt: now },
  ]
}
