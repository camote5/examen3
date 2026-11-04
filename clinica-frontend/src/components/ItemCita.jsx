import Boton from './Boton'
import './ItemCita.css'

function ItemCita({ cita, onSeleccionar, seleccionada }) {
  return (
    <li className={seleccionada ? 'item-cita item-cita--seleccionada' : 'item-cita'}>
      <div className="item-cita__datos">
        <strong>{cita.fecha} · {cita.hora.slice(0, 5)}</strong>
        <span>{cita.paciente_nombre} con {cita.medico_nombre}</span>
      </div>
      <span className={`estado estado--${cita.estado_nombre}`}>{cita.estado_nombre}</span>
      {/* Avisa al padre qué cita se eligió; el hermano DetalleCita la muestra */}
      <Boton variante="secundario" onClick={() => onSeleccionar(cita.id)}>Ver detalle</Boton>
    </li>
  )
}

export default ItemCita
