import { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { ClinicaContext } from '../context/ClinicaContext'
import './Encabezado.css'

function Encabezado() {
  // La fecha se calcula una sola vez al montar (el render debe ser puro)
  const [hoy] = useState(() => new Date())
  // Recepcionista y fecha de trabajo llegan por contexto, no por props
  const { recepcionista, setRecepcionista, fechaTrabajo, setFechaTrabajo, RECEPCIONISTAS } = useContext(ClinicaContext)

  return (
    <header className="encabezado">
      <div className="encabezado__marca">
        <img src={logo} alt="Logo de la clínica" className="encabezado__logo" />
        <div>
          <h1 className="encabezado__nombre">Clínica San Gabriel</h1>
          <p className="encabezado__fecha">
            {hoy.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="encabezado__sesion">
        <label>
          Recepcionista
          <select value={recepcionista} onChange={(event) => setRecepcionista(event.target.value)}>
            {RECEPCIONISTAS.map((nombre) => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </select>
        </label>
        <label>
          Fecha de trabajo
          <input type="date" value={fechaTrabajo} onChange={(event) => setFechaTrabajo(event.target.value)} />
        </label>
      </div>
    </header>
  )
}

export default Encabezado
