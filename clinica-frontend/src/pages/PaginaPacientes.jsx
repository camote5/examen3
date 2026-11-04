import { useEffect, useState } from 'react'
import BuscadorPacientes from '../components/BuscadorPacientes'
import FormularioPaciente from '../components/FormularioPaciente'
import TablaPacientes from '../components/TablaPacientes'
import { eliminarPaciente, getPacientes } from '../services/api'
import './Paginas.css'

function PaginaPacientes() {
  const [pacientes, setPacientes] = useState([])
  const [termino, setTermino] = useState('')
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    getPacientes()
      .then(setPacientes)
      .catch(() => setAviso('No se pudieron cargar los pacientes.'))
  }, [])

  // El filtro se calcula en cada render a partir del estado; no se guarda una copia filtrada
  const busqueda = termino.trim().toLowerCase()
  const filtrados = pacientes.filter(
    (p) => p.nombres.toLowerCase().includes(busqueda) || p.dni.includes(busqueda),
  )

  const agregarPaciente = (paciente) => setPacientes([...pacientes, paciente])

  const eliminar = async (paciente) => {
    if (!window.confirm(`¿Eliminar a ${paciente.nombres} (DNI ${paciente.dni})?`)) return
    setAviso('')
    try {
      await eliminarPaciente(paciente.id)
      setPacientes(pacientes.filter((p) => p.id !== paciente.id))
    } catch (error) {
      setAviso(error.message) // por ejemplo, 409: el paciente tiene citas registradas
    }
  }

  return (
    <section>
      <h2>Pacientes</h2>
      <div className="columnas">
        <FormularioPaciente onPacienteCreado={agregarPaciente} />
        <div>
          <BuscadorPacientes valor={termino} onCambiar={setTermino} onLimpiar={() => setTermino('')} />
          {aviso && <p className="mensaje-error">{aviso}</p>}
          <TablaPacientes pacientes={filtrados} onEliminar={eliminar} />
        </div>
      </div>
    </section>
  )
}

export default PaginaPacientes
