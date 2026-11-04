import { useEffect, useState } from 'react'
import FiltroEspecialidad from '../components/FiltroEspecialidad'
import TarjetaMedico from '../components/TarjetaMedico'
import { getMedicos } from '../services/api'
import './Paginas.css'

function PaginaMedicos({ especialidades }) {
  const [medicos, setMedicos] = useState([])
  const [especialidadId, setEspecialidadId] = useState('')
  const [error, setError] = useState('')

  // Cada vez que cambia el filtro se consulta /api/medicos/?especialidad=<id>
  useEffect(() => {
    getMedicos(especialidadId || undefined)
      .then((datos) => {
        setMedicos(datos)
        setError('')
      })
      .catch(() => setError('No se pudieron cargar los médicos.'))
  }, [especialidadId])

  // La API devuelve el id de la especialidad; el nombre se toma de la lista que ya cargó App
  const nombreEspecialidad = (id) => especialidades.find((e) => e.id === id)?.nombre ?? ''

  return (
    <section>
      <h2>Médicos</h2>
      <FiltroEspecialidad
        especialidades={especialidades}
        valor={especialidadId}
        onCambiar={setEspecialidadId}
        total={medicos.length}
      />
      {error && <p className="mensaje-error">{error}</p>}
      <div className="rejilla">
        {medicos.map((medico) => (
          <TarjetaMedico
            key={medico.id}
            nombres={medico.nombres}
            cmp={medico.cmp}
            especialidad={nombreEspecialidad(medico.especialidad)}
          />
        ))}
      </div>
    </section>
  )
}

export default PaginaMedicos
