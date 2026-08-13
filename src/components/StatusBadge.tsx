import type { AppointmentStatus } from '../types'

const labels: Record<AppointmentStatus, string> = {
  pending: 'Pendiente', confirmed: 'Confirmado', completed: 'Completado', cancelled: 'Cancelado',
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={`status status-${status}`}>{labels[status]}</span>
}
