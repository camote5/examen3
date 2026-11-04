import './FiltroEspecialidad.css'

// `valor` es "" (todas) o el id de la especialidad como texto
function FiltroEspecialidad({ especialidades, valor, onCambiar, total }) {
  return (
    <div className="filtro-especialidad">
      <label htmlFor="filtro-especialidad">Especialidad</label>
      <select id="filtro-especialidad" value={valor} onChange={(event) => onCambiar(event.target.value)}>
        <option value="">Todas</option>
        {especialidades.map((especialidad) => (
          <option key={especialidad.id} value={especialidad.id}>
            {especialidad.nombre}
          </option>
        ))}
      </select>
      <span className="filtro-especialidad__contador">
        {total} {total === 1 ? 'médico mostrado' : 'médicos mostrados'}
      </span>
    </div>
  )
}

export default FiltroEspecialidad
