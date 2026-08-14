import { describe, expect, it } from 'vitest'
import type { Appointment, BusinessSettings } from '../types'
import { validateReservationRequest, type ReservationRequest } from './reservations'

const settings: BusinessSettings = {
  businessName: 'German Spa Urbano',
  openingDays: [1, 2, 3, 4, 5, 6],
  openingTime: '10:00',
  closingTime: '19:00',
  slotDurationMinutes: 30,
  maxAppointmentsPerSlot: 3,
}

const validRequest: ReservationRequest = {
  customerName: 'Caso de prueba',
  date: '2026-08-17',
  time: '10:00',
  slotPosition: 1,
}

function validate(request: ReservationRequest, appointments: Appointment[] = []) {
  return validateReservationRequest({ request, settings, appointments })
}

describe('validateReservationRequest — caracterización', () => {
  it('rechaza un nombre vacío', () => {
    expect(validate({ ...validRequest, customerName: '   ' })).toEqual({
      valid: false,
      reason: 'customer-name-required',
    })
  })

  it('rechaza un día cerrado', () => {
    expect(validate({ ...validRequest, date: '2026-08-16' })).toEqual({
      valid: false,
      reason: 'closed-day',
    })
  })

  it('rechaza un cupo ocupado por un turno activo', () => {
    const occupiedAppointment: Appointment = {
      id: 'occupied-1',
      customerName: 'Cliente existente',
      date: validRequest.date,
      time: validRequest.time,
      slotPosition: validRequest.slotPosition,
      note: '',
      status: 'confirmed',
      createdAt: '2026-08-14T12:00:00.000Z',
      updatedAt: '2026-08-14T12:00:00.000Z',
    }

    expect(validate(validRequest, [occupiedAppointment])).toEqual({
      valid: false,
      reason: 'slot-unavailable',
    })
  })

  it('acepta una reserva válida dentro de una franja normal', () => {
    expect(validate(validRequest)).toEqual({ valid: true })
  })
})

describe('EXP-001-F01 — validación adversarial', () => {
  it('rechaza una hora que no pertenece a las franjas configuradas', () => {
    const result = validate({ ...validRequest, time: '03:00' })

    expect(result.valid).toBe(false)
  })
})
