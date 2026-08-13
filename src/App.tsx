import { Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { AgendaPage } from './pages/AgendaPage'
import { AppointmentDetailPage } from './pages/AppointmentDetailPage'
import { AppointmentFormPage } from './pages/AppointmentFormPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <Routes>
        <Route path="/" element={<AgendaPage />} />
        <Route path="/turnos/nuevo" element={<AppointmentFormPage />} />
        <Route path="/turnos/:id" element={<AppointmentDetailPage />} />
        <Route path="/turnos/:id/reprogramar" element={<AppointmentFormPage />} />
        <Route path="/configuracion" element={<SettingsPage />} />
      </Routes>
    </div>
  )
}
