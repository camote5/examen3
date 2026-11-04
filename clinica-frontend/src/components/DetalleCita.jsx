import { useState } from 'react'
import Boton from './Boton'
import { actualizarCita } from '../services/api'
import './DetalleCita.css'

const ACCIONES = [
  { texto: 'Confirmar', estado: 'confirmada', variante: 'primario' },
  { texto: 'Marcar como atendida', estado: 'atendida', variante: 'secundario' },
  { texto: 'Cancelar', estado: 'cancelada', variante: 'peligro' },
]

function DetalleCita({ cita, estados, onCambiarEstado }) {
  const [error, setError] = useState('')

  if (!cita) return <p className="detalle-cita panel">Seleccione una cita para ver su detalle.</p>

  // Los ids y la regla "es final" vienen de /api/estados/: el frontend ya no los supone
  const esFinal = estados.find((e) => e.id === cita.estado)?.es_final ?? false
  const idDeEstado = (nombre) => estados.find((e) => e.nombre === nombre)?.id

  const cambiarEstado = async (nombreEstado) => {
    try {
      const citaActualizada = await actualizarCita(cita.id, { estado: idDeEstado(nombreEstado) })
      setError('')
      onCambiarEstado(citaActualizada) // el padre la reemplaza: se actualizan lista, detalle y resumen
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="detalle-cita panel">
      <h3>Detalle de la cita</h3>
      <dl>
        <dt>Paciente</dt><dd>{cita.paciente_nombre}</dd>
        <dt>Médico</dt><dd>{cita.medico_nombre}</dd>
        <dt>Especialidad</dt><dd>{cita.especialidad}</dd>
        <dt>Fecha</dt><dd>{cita.fecha}</dd>
        <dt>Hora</dt><dd>{cita.hora.slice(0, 5)}</dd>
        <dt>Motivo</dt><dd>{cita.motivo}</dd>
        <dt>Estado</dt><dd><span className={`estado estado--${cita.estado_nombre}`}>{cita.estado_nombre}</span></dd>
      </dl>

      <div className="detalle-cita__acciones">
        {ACCIONES.map((accion) => (
          <Boton
            key={accion.estado}
            texto={accion.texto}
            variante={accion.variante}
            disabled={esFinal || cita.estado_nombre === accion.estado || !idDeEstado(accion.estado)}
            onClick={() => cambiarEstado(accion.estado)}
          />
        ))}
      </div>
      {esFinal && <p className="detalle-cita__nota">La cita está en un estado final y ya no puede cambiar.</p>}
      {error && <p className="mensaje-error">{error}</p>}
    </div>
  )
}

export default DetalleCita
