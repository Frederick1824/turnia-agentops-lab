import { ArrowLeft, Check } from 'lucide-react'
import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isOpenDay, toLocalDateKey } from '../utils/date'
import { generateTimeSlots } from '../utils/schedule'

export function AppointmentFormPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { appointments, settings, addAppointment, updateAppointment } = useApp()
  const existing = appointments.find(item => item.id === id)
  const [customerName, setCustomerName] = useState(existing?.customerName || '')
  const [phone, setPhone] = useState(existing?.phone || '')
  const [date, setDate] = useState(existing?.date || params.get('date') || toLocalDateKey())
  const [time, setTime] = useState(existing?.time || params.get('time') || settings.openingTime)
  const [slotPosition, setSlotPosition] = useState(Number(existing?.slotPosition || params.get('slot') || 1))
  const [note, setNote] = useState(existing?.note || '')
  const [error, setError] = useState('')
  const times = generateTimeSlots(settings.openingTime, settings.closingTime, settings.slotDurationMinutes)
  const occupied = useMemo(() => appointments.filter(item => item.id !== id && item.date === date && item.time === time && item.status !== 'cancelled').map(item => item.slotPosition), [appointments, date, time, id])
  const freePositions = Array.from({ length: settings.maxAppointmentsPerSlot }, (_, i) => i + 1).filter(position => !occupied.includes(position))

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!customerName.trim()) return setError('Ingresá el nombre del cliente.')
    if (!isOpenDay(date, settings.openingDays)) return setError('El negocio no atiende en la fecha elegida.')
    if (!freePositions.includes(slotPosition)) return setError('Ese cupo ya no está disponible. Elegí otro.')
    const input = { customerName: customerName.trim(), phone: phone.trim() || undefined, date, time, slotPosition, note: note.trim() }
    if (existing) { updateAppointment(existing.id, input); navigate(`/turnos/${existing.id}`) }
    else { const created = addAppointment(input); navigate(`/turnos/${created.id}`) }
  }

  return (
    <main className="page narrow-page">
      <Link className="back-link" to={existing ? `/turnos/${existing.id}` : `/?fecha=${date}`}><ArrowLeft size={18} /> Volver</Link>
      <div className="form-card">
        <span className="eyebrow">{existing ? 'Cambiar fecha u horario' : 'Agendar cliente'}</span>
        <h1>{existing ? 'Reprogramar turno' : 'Nuevo turno'}</h1>
        <p className="form-intro">Completá los datos necesarios para reservar un lugar.</p>
        <form onSubmit={handleSubmit}>
          <label>Nombre del cliente <span>*</span><input autoFocus value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Ej. Juan Pérez" /></label>
          <label>Teléfono <small>Opcional</small><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej. 11 4567-8901" /></label>
          <div className="form-row">
            <label>Fecha <span>*</span><input type="date" value={date} onChange={e => { setDate(e.target.value); setError('') }} /></label>
            <label>Hora <span>*</span><select value={time} onChange={e => { setTime(e.target.value); setError('') }}>{times.map(value => <option key={value}>{value}</option>)}</select></label>
          </div>
          <fieldset><legend>Cupo libre <span>*</span></legend><div className="slot-picker">{Array.from({ length: settings.maxAppointmentsPerSlot }, (_, i) => i + 1).map(position => <button type="button" key={position} disabled={occupied.includes(position)} className={slotPosition === position ? 'selected' : ''} onClick={() => setSlotPosition(position)}>{slotPosition === position && <Check size={17} />} Cupo {position}<small>{occupied.includes(position) ? 'Ocupado' : 'Disponible'}</small></button>)}</div></fieldset>
          <label>Servicio o comentario<textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ej. Corte y barba" rows={4} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions"><Link className="button secondary" to={existing ? `/turnos/${existing.id}` : '/'}>Cancelar</Link><button className="button primary" type="submit">{existing ? 'Guardar cambios' : 'Guardar turno'}</button></div>
        </form>
      </div>
    </main>
  )
}
