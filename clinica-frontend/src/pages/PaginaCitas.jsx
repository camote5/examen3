import { useEffect, useState } from 'react'
import DetalleCita from '../components/DetalleCita'
import FormularioCita from '../components/FormularioCita'
import ListaCitas from '../components/ListaCitas'
import ResumenCitas from '../components/ResumenCitas'
import { getCitas, getEstados, getMedicos, getPacientes } from '../services/api'
import './Paginas.css'

// Componente padre: es el único dueño de los datos y los reparte por props a sus hijos
function PaginaCitas() {
  const [citas, setCitas] = useState([])
  const [medicos, setMedicos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [estados, setEstados] = useState([]) // catálogo de /api/estados/: ids y cuáles son finales
  const [seleccionadaId, setSeleccionadaId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getCitas(), getMedicos(), getPacientes(), getEstados()])
      .then(([datosCitas, datosMedicos, datosPacientes, datosEstados]) => {
        setCitas(datosCitas)
        setMedicos(datosMedicos)
        setPacientes(datosPacientes)
        setEstados(datosEstados)
      })
      .catch(() => setError('No se pudieron cargar las citas.'))
      .finally(() => setCargando(false))
  }, [])

  // Callbacks que los hijos invocan para avisar al padre (hijo → padre)
  const agregarCita = (cita) => setCitas((anteriores) => [...anteriores, cita])
  const seleccionar = (id) => setSeleccionadaId(id)
  const reemplazarCita = (citaActualizada) =>
    setCitas((anteriores) => anteriores.map((c) => (c.id === citaActualizada.id ? citaActualizada : c)))

  // Se deriva de `citas` (no se guarda una copia): así el detalle siempre muestra el estado actual
  const citaSeleccionada = citas.find((c) => c.id === seleccionadaId)

  if (cargando) return <p>Cargando…</p>
  if (error) return <p className="mensaje-error">{error}</p>

  return (
    <section>
      <h2>Citas</h2>
      <div className="columnas">
        <div className="pila">
          <FormularioCita medicos={medicos} pacientes={pacientes} onCitaCreada={agregarCita} />
          <ResumenCitas citas={citas} estados={estados} />
        </div>
        <div className="pila">
          <ListaCitas citas={citas} onSeleccionar={seleccionar} seleccionadaId={seleccionadaId} />
          {/* key: al elegir otra cita, DetalleCita se reinicia (borra mensajes de la anterior) */}
          <DetalleCita key={seleccionadaId} cita={citaSeleccionada} estados={estados} onCambiarEstado={reemplazarCita} />
        </div>
      </div>
    </section>
  )
}

export default PaginaCitas
