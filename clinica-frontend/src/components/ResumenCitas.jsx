import './ResumenCitas.css'

// No guarda estado propio: los totales se calculan en cada render a partir de las props
function ResumenCitas({ citas, estados }) {
  // Un total por cada estado del catálogo de la API
  const totales = estados.map((estado) => ({
    id: estado.id,
    nombre: estado.nombre,
    total: citas.filter((cita) => cita.estado === estado.id).length,
  }))

  return (
    <div className="resumen-citas panel">
      <h3>Resumen ({citas.length} citas)</h3>
      <ul>
        {totales.map(({ id, nombre, total }) => (
          <li key={id}>
            <span className={`estado estado--${nombre}`}>{nombre}</span>
            <strong>{total}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ResumenCitas
