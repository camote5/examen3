import Boton from './Boton'
import './BuscadorPacientes.css'

function BuscadorPacientes({ valor, onCambiar, onLimpiar }) {
  return (
    <div className="buscador-pacientes">
      <input
        type="search"
        placeholder="Buscar por nombre o DNI"
        aria-label="Buscar paciente"
        value={valor}
        onChange={(event) => onCambiar(event.target.value)}
      />
      <Boton texto="Limpiar" variante="secundario" onClick={onLimpiar} />
    </div>
  )
}

export default BuscadorPacientes
