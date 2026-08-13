import { CalendarDays, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function AppHeader() {
  const { settings } = useApp()
  return (
    <header className="app-header">
      <div className="header-inner">
        <NavLink to="/" className="brand" aria-label="Ir a la agenda">
          {settings.logo ? <img src={settings.logo} alt="" className="brand-logo" /> : <span className="brand-mark">G</span>}
          <span><strong>{settings.businessName}</strong><small>Agenda de turnos</small></span>
        </NavLink>
        <nav aria-label="Navegación principal">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><CalendarDays size={19} /><span>Agenda</span></NavLink>
          <NavLink to="/configuracion" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Settings size={19} /><span>Configuración</span></NavLink>
        </nav>
      </div>
    </header>
  )
}
