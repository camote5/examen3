import Boton from './Boton'
import './TablaPacientes.css'

function TablaPacientes({ pacientes, onEliminar }) {
  if (pacientes.length === 0) return <p className="tabla-pacientes__vacia">No hay pacientes que coincidan.</p>

  return (
    <div className="tabla-pacientes">
      <table>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombres</th>
            <th>Nacimiento</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td>{paciente.dni}</td>
              <td>{paciente.nombres}</td>
              <td>{paciente.fecha_nacimiento}</td>
              <td>{paciente.telefono}</td>
              <td>{paciente.correo}</td>
              <td>
                {/* Función flecha: onEliminar se ejecuta en el clic, con el paciente de esta fila */}
                <Boton texto="Eliminar" variante="peligro" onClick={() => onEliminar(paciente)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaPacientes
