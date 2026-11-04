import ItemCita from './ItemCita'
import './ListaCitas.css'

function ListaCitas({ citas, onSeleccionar, seleccionadaId }) {
  return (
    <div className="lista-citas panel">
      <h3>Citas registradas ({citas.length})</h3>
      {citas.length === 0 ? (
        <p className="lista-citas__vacia">Aún no hay citas registradas.</p>
      ) : (
        <ul>
          {citas.map((cita) => (
            <ItemCita
              key={cita.id}
              cita={cita}
              onSeleccionar={onSeleccionar}
              seleccionada={cita.id === seleccionadaId}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default ListaCitas
