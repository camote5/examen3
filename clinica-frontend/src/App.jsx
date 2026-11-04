import { useEffect, useState } from 'react'
import Encabezado from './components/Encabezado'
import PiePagina from './components/PiePagina'
import PaginaCitas from './pages/PaginaCitas'
import PaginaMedicos from './pages/PaginaMedicos'
import PaginaPacientes from './pages/PaginaPacientes'
import { getEspecialidades } from './services/api'
import './App.css'

const PANTALLAS = [
  { id: 'inicio', titulo: 'Especialidades' },
  { id: 'pacientes', titulo: 'Pacientes' },
  { id: 'medicos', titulo: 'Médicos' },
  { id: 'citas', titulo: 'Citas' },
]

function App() {
  const [especialidades, setEspecialidades] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [pantalla, setPantalla] = useState('inicio')

  // Al montar el componente se cargan las especialidades desde Django
  useEffect(() => {
    getEspecialidades()
      .then(setEspecialidades)
      .catch(() => setError('No se pudo conectar con la API. ¿Está corriendo el servidor de Django?'))
      .finally(() => setCargando(false))
  }, [])

  return (
    <>
      <Encabezado />

      <nav className="navegacion">
        {PANTALLAS.map((p) => (
          <button
            key={p.id}
            className={p.id === pantalla ? 'navegacion__boton navegacion__boton--activo' : 'navegacion__boton'}
            onClick={() => setPantalla(p.id)}
          >
            {p.titulo}
          </button>
        ))}
      </nav>

      <main className="contenido">
        {cargando && <p>Cargando…</p>}
        {error && <p className="mensaje-error">{error}</p>}

        {!cargando && !error && pantalla === 'inicio' && (
          <section>
            <h2>Especialidades</h2>
            <ul className="especialidades">
              {especialidades.map((especialidad) => (
                <li key={especialidad.id} className="especialidades__item">
                  <strong>{especialidad.nombre}</strong>
                  <span>{especialidad.descripcion}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {!cargando && !error && pantalla === 'pacientes' && <PaginaPacientes />}
        {!cargando && !error && pantalla === 'medicos' && <PaginaMedicos especialidades={especialidades} />}
        {!cargando && !error && pantalla === 'citas' && <PaginaCitas />}
      </main>

      <PiePagina />
    </>
  )
}

export default App
