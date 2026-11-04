import { useContext, useState } from 'react'
import Boton from './Boton'
import { ClinicaContext } from '../context/ClinicaContext'
import { crearCita } from '../services/api'
import './FormularioCita.css'

// fecha: null = usar la fecha de trabajo del contexto hasta que el usuario elija otra
const VACIO = { paciente: '', medico: '', fecha: null, hora: '', motivo: '' }

function FormularioCita({ medicos, pacientes, onCitaCreada }) {
  // Recepcionista y fecha de trabajo llegan por contexto, sin props
  const { recepcionista, fechaTrabajo } = useContext(ClinicaContext)
  const [datos, setDatos] = useState(VACIO)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const fecha = datos.fecha ?? fechaTrabajo

  const handleChange = (event) => {
    const { name, value } = event.target
    setDatos({ ...datos, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMensaje('')
    if (!datos.paciente || !datos.medico || !fecha || !datos.hora || !datos.motivo.trim()) {
      setError('Complete paciente, médico, fecha, hora y motivo.')
      return
    }
    try {
      // No se envía `estado`: el backend la registra como "pendiente"
      const cita = await crearCita({
        paciente: Number(datos.paciente), medico: Number(datos.medico), fecha, hora: datos.hora, motivo: datos.motivo,
      })
      onCitaCreada(cita) // hijo → padre: PaginaCitas la agrega a su estado
      setError('')
      setMensaje(`Cita registrada por ${recepcionista}.`)
      setDatos(VACIO)
    } catch (error) {
      setError(error.message) // por ejemplo, el 400 de horario ocupado o fecha pasada
    }
  }

  return (
    <form className="formulario-cita panel" onSubmit={handleSubmit} noValidate>
      <h3>Reservar cita</h3>
      <p className="formulario-cita__sesion">Recepcionista: <strong>{recepcionista}</strong></p>

      <div className="campo">
        <label htmlFor="cita-paciente">Paciente</label>
        <select id="cita-paciente" name="paciente" value={datos.paciente} onChange={handleChange}>
          <option value="">Seleccione…</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>{p.nombres} — DNI {p.dni}</option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="cita-medico">Médico</label>
        <select id="cita-medico" name="medico" value={datos.medico} onChange={handleChange}>
          <option value="">Seleccione…</option>
          {medicos.map((m) => (
            <option key={m.id} value={m.id}>{m.nombres} — CMP {m.cmp}</option>
          ))}
        </select>
      </div>

      <div className="formulario-cita__fila">
        <div className="campo">
          <label htmlFor="cita-fecha">Fecha</label>
          <input id="cita-fecha" type="date" name="fecha" value={fecha} onChange={handleChange} />
        </div>
        <div className="campo">
          <label htmlFor="cita-hora">Hora</label>
          <input id="cita-hora" type="time" name="hora" value={datos.hora} onChange={handleChange} />
        </div>
      </div>

      <div className="campo">
        <label htmlFor="cita-motivo">Motivo</label>
        <input id="cita-motivo" name="motivo" value={datos.motivo} onChange={handleChange} />
      </div>

      {error && <p className="mensaje-error">{error}</p>}
      <Boton type="submit" texto="Registrar cita" />
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
    </form>
  )
}

export default FormularioCita
