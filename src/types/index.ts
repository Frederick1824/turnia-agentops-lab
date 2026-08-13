export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  customerName: string
  phone?: string
  date: string
  time: string
  slotPosition: number
  note: string
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
}

export interface BusinessSettings {
  businessName: string
  logo?: string
  openingDays: number[]
  openingTime: string
  closingTime: string
  slotDurationMinutes: number
  maxAppointmentsPerSlot: number
}
