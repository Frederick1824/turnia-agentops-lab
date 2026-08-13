import { ArrowLeft, ImagePlus, Save } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { BusinessSettings } from '../types'

const days = [{ value: 1, label: 'Lun' }, { value: 2, label: 'Mar' }, { value: 3, label: 'Mié' }, { value: 4, label: 'Jue' }, { value: 5, label: 'Vie' }, { value: 6, label: 'Sáb' }, { value: 0, label: 'Dom' }]

export function SettingsPage() {
  const { settings, saveSettings } = useApp()
  const [form, setForm] = useState<BusinessSettings>(settings)
  const [saved, setSaved] = useState(false)
  const update = <K extends keyof BusinessSettings>(key: K, value: BusinessSettings[K]) => { setForm(current => ({ ...current, [key]: value })); setSaved(false) }
  function toggleDay(day: number) { update('openingDays', form.openingDays.includes(day) ? form.openingDays.filter(value => value !== day) : [...form.openingDays, day]) }
  function handleLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update('logo', String(reader.result))
    reader.readAsDataURL(file)
  }
  function handleSubmit(event: FormEvent) { event.preventDefault(); saveSettings(form); setSaved(true) }

  return (
    <main className="page narrow-page">
      <Link className="back-link" to="/"><ArrowLeft size={18} /> Volver a la agenda</Link>
      <div className="form-card settings-card">
        <span className="eyebrow">Preferencias del local</span><h1>Configuración</h1><p className="form-intro">Estos datos definen cómo se organiza la agenda.</p>
        <form onSubmit={handleSubmit}>
          <div className="logo-setting">
            {form.logo ? <img src={form.logo} alt="Logo del negocio" /> : <span className="brand-mark large">G</span>}
            <label className="button secondary file-button"><ImagePlus size={18} /> Cambiar imagen<input type="file" accept="image/*" onChange={handleLogo} /></label>
          </div>
          <label>Nombre del negocio <span>*</span><input value={form.businessName} required onChange={e => update('businessName', e.target.value)} /></label>
          <fieldset><legend>Días de atención</legend><div className="day-picker">{days.map(day => <button type="button" key={day.value} className={form.openingDays.includes(day.value) ? 'selected' : ''} onClick={() => toggleDay(day.value)}>{day.label}</button>)}</div></fieldset>
          <div className="form-row"><label>Hora de apertura<input type="time" value={form.openingTime} onChange={e => update('openingTime', e.target.value)} /></label><label>Hora límite de finalización<input type="time" value={form.closingTime} onChange={e => update('closingTime', e.target.value)} /></label></div>
          <p className="field-help">El último turno comienza antes de esta hora. Por ejemplo, con cierre a las 19:00 y franjas de 30 minutos, comienza a las 18:30.</p>
          <div className="form-row"><label>Duración de franja<select value={form.slotDurationMinutes} onChange={e => update('slotDurationMinutes', Number(e.target.value))}><option value={15}>15 minutos</option><option value={30}>30 minutos</option><option value={45}>45 minutos</option><option value={60}>60 minutos</option></select></label><label>Capacidad por franja<input type="number" min="1" max="10" value={form.maxAppointmentsPerSlot} onChange={e => update('maxAppointmentsPerSlot', Number(e.target.value))} /></label></div>
          <div className="form-actions"><span className={saved ? 'save-message visible' : 'save-message'}>Cambios guardados</span><button className="button primary" type="submit"><Save size={18} /> Guardar configuración</button></div>
        </form>
      </div>
    </main>
  )
}
