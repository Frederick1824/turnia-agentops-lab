import type { Appointment, BusinessSettings } from '../types'
import { isOpenDay } from '../utils/date'

export interface ReservationRequest {
  customerName: string
  date: string
  time: string
  slotPosition: number
}

export type ReservationValidationResult =
  | { valid: true }
  | { valid: false; reason: 'customer-name-required' | 'closed-day' | 'slot-unavailable' }

interface ReservationValidationInput {
  request: ReservationRequest
  settings: BusinessSettings
  appointments: Appointment[]
  excludedAppointmentId?: string
}

export function getOccupiedSlotPositions(
  appointments: Appointment[],
  date: string,
  time: string,
  excludedAppointmentId?: string,
): number[] {
  return appointments
    .filter(item => item.id !== excludedAppointmentId && item.date === date && item.time === time && item.status !== 'cancelled')
    .map(item => item.slotPosition)
}

export function validateReservationRequest({
  request,
  settings,
  appointments,
  excludedAppointmentId,
}: ReservationValidationInput): ReservationValidationResult {
  if (!request.customerName.trim()) return { valid: false, reason: 'customer-name-required' }
  if (!isOpenDay(request.date, settings.openingDays)) return { valid: false, reason: 'closed-day' }


  const occupied = getOccupiedSlotPositions(appointments, request.date, request.time, excludedAppointmentId)
  const freePositions = Array.from(
    { length: settings.maxAppointmentsPerSlot },
    (_, index) => index + 1,
  ).filter(position => !occupied.includes(position))

  if (!freePositions.includes(request.slotPosition)) return { valid: false, reason: 'slot-unavailable' }

  return { valid: true }
}
