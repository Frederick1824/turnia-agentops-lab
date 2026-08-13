import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { TimeSlot } from '../components/TimeSlot'
import { useApp } from '../context/AppContext'
import { formatLongDate, isOpenDay, isToday, moveDate, toLocalDateKey } from '../utils/date'
import { generateTimeSlots } from '../utils/schedule'

export function AgendaPage() {
  const { appointments, settings } = useApp()
  const [params, setParams] = useSearchParams()
  const date = params.get('fecha') || toLocalDateKey()
  const slots = generateTimeSlots(settings.openingTime, settings.closingTime, settings.slotDurationMinutes)
  const dayAppointments = appointments.filter(item => item.date === date)
  const goTo = (next: string) => setParams(next === toLocalDateKey() ? {} : { fecha: next })
  const isClosed = !isOpenDay(date, settings.openingDays)

  return (
    <main className="page agenda-page">
      <div className="page-heading">
        <div><span className="eyebrow">{isToday(date) ? 'Agenda de hoy' : 'Agenda'}</span><h1>{formatLongDate(date)}</h1><p>{isClosed ? 'El local no abre este día.' : `${dayAppointments.filter(a => a.status !== 'cancelled').length} turnos agendados`}</p></div>
        <Link className="button primary" to={`/turnos/nuevo?date=${date}`}><Plus size={19} /> Nuevo turno</Link>
      </div>
      <div className="date-controls" aria-label="Cambiar fecha">
        <button className="icon-button" onClick={() => goTo(moveDate(date, -1))} aria-label="Día anterior"><ChevronLeft /></button>
        {!isToday(date) && <button className="today-button" onClick={() => goTo(toLocalDateKey())}>Volver a hoy</button>}
        <button className="icon-button" onClick={() => goTo(moveDate(date, 1))} aria-label="Día siguiente"><ChevronRight /></button>
      </div>
      {isClosed ? <div className="empty-state"><span className="brand-mark large">G</span><h2>Día sin atención</h2><p>Podés elegir otro día desde las flechas de arriba.</p></div> :
        <div className="schedule">
          {slots.map(time => <TimeSlot key={time} time={time} date={date} capacity={settings.maxAppointmentsPerSlot} appointments={dayAppointments.filter(item => item.time === time)} />)}
        </div>}
    </main>
  )
}
