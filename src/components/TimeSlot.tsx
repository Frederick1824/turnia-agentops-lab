import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Appointment } from '../types'
import { AppointmentCard } from './AppointmentCard'

interface Props { time: string; date: string; capacity: number; appointments: Appointment[] }

export function TimeSlot({ time, date, capacity, appointments }: Props) {
  const active = appointments.filter(item => item.status !== 'cancelled')
  return (
    <section className="time-row">
      <div className="time-label"><strong>{time}</strong><span>{active.length}/{capacity} ocupados</span></div>
      <div className="slot-grid">
        {Array.from({ length: capacity }, (_, index) => index + 1).map(position => {
          const appointment = active.find(item => item.slotPosition === position)
          return appointment
            ? <AppointmentCard key={appointment.id} appointment={appointment} />
            : <Link key={position} className="free-slot" to={`/turnos/nuevo?date=${date}&time=${time}&slot=${position}`}><Plus size={18} /><span>Lugar libre</span><small>Cupo {position}</small></Link>
        })}
      </div>
    </section>
  )
}
