import { ArrowLeft, CalendarClock, Check, CheckCircle2, Clock3, Phone, Scissors, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { StatusBadge } from '../components/StatusBadge'
import { useApp } from '../context/AppContext'
import { formatLongDate } from '../utils/date'

export function AppointmentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { appointments, setStatus } = useApp()
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const appointment = appointments.find(item => item.id === id)
  if (!appointment) return <Navigate to="/" replace />
  const inactive = appointment.status === 'cancelled' || appointment.status === 'completed'
  const changeStatus = (status: 'confirmed' | 'completed') => { setStatus(appointment.id, status) }
  const cancel = () => { setStatus(appointment.id, 'cancelled'); setConfirmingCancel(false); navigate(`/?fecha=${appointment.date}`) }

  return (
    <main className="page narrow-page">
      <Link className="back-link" to={`/?fecha=${appointment.date}`}><ArrowLeft size={18} /> Volver a la agenda</Link>
      <article className="detail-card">
        <div className="detail-heading"><div><span className="eyebrow">Detalle del turno</span><h1>{appointment.customerName}</h1></div><StatusBadge status={appointment.status} /></div>
        <div className="detail-list">
          <div><UserRound /><span><small>Cliente</small><strong>{appointment.customerName}</strong></span></div>
          <div><Phone /><span><small>Teléfono</small><strong>{appointment.phone || 'No informado'}</strong></span></div>
          <div><CalendarClock /><span><small>Fecha</small><strong>{formatLongDate(appointment.date)}</strong></span></div>
          <div><Clock3 /><span><small>Horario</small><strong>{appointment.time} · Cupo {appointment.slotPosition}</strong></span></div>
          <div className="detail-note"><Scissors /><span><small>Servicio o comentario</small><strong>{appointment.note || 'Sin comentario'}</strong></span></div>
        </div>
        <div className="detail-actions">
          {!inactive && appointment.status !== 'confirmed' && <button className="button primary" onClick={() => changeStatus('confirmed')}><Check size={18} /> Confirmar</button>}
          {!inactive && <button className="button dark" onClick={() => changeStatus('completed')}><CheckCircle2 size={18} /> Marcar completado</button>}
          {!inactive && <Link className="button secondary" to={`/turnos/${appointment.id}/reprogramar`}><CalendarClock size={18} /> Reprogramar</Link>}
          {!inactive && <button className="button ghost-danger" onClick={() => setConfirmingCancel(true)}><X size={18} /> Cancelar turno</button>}
        </div>
      </article>
      <ConfirmDialog open={confirmingCancel} title="¿Cancelar este turno?" message={`El cupo de ${appointment.customerName} a las ${appointment.time} volverá a quedar disponible.`} confirmLabel="Sí, cancelar" onConfirm={cancel} onClose={() => setConfirmingCancel(false)} />
    </main>
  )
}
