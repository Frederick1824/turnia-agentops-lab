import { Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Appointment } from '../types'
import { StatusBadge } from './StatusBadge'

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <Link to={`/turnos/${appointment.id}`} className={`appointment-card ${appointment.status === 'cancelled' ? 'is-cancelled' : ''}`}>
      <div className="appointment-top"><strong>{appointment.customerName}</strong><StatusBadge status={appointment.status} /></div>
      <p>{appointment.note || 'Sin comentario'}</p>
      {appointment.phone && <span className="phone"><Phone size={13} /> {appointment.phone}</span>}
    </Link>
  )
}
