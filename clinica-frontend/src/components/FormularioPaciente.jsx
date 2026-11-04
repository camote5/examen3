import { useState } from 'react'
import Boton from './Boton'
import { crearPaciente, ErrorApi } from '../services/api'
import './FormularioPaciente.css'

const VACIO = { dni: '', nombres: '', fecha_nacimiento: '', telefono: '', correo: '' }

const CAMPOS = [
  { name: 'dni', etiqueta: 'DNI', type: 'text', inputMode: 'numeric', maxLength: 8 },
  { name: 'nombres', etiqueta: 'Nombres y apellidos', type: 'text' },
  { name: 'fecha_nacimiento', etiqueta: 'Fecha de nacimiento', type: 'date' },
  { name: 'telefono', etiqueta: 'Teléfono', type: 'tel' },
  { name: 'correo', etiqueta: 'Correo', type: 'email' },
]

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar(datos) {
  const errores = {}
  CAMPOS.forEach(({ name }) => {
    if (!datos[name].trim()) errores[name] = 'Este campo es obligatorio.'
  })
  if (datos.dni && !/^\d{8}$/.test(datos.dni)) errores.dni = 'El DNI debe tener exactamente 8 dígitos.'
  if (datos.correo && !CORREO_VALIDO.test(datos.correo)) errores.correo = 'Ingrese un correo válido.'
  return errores
}

function FormularioPaciente({ onPacienteCreado }) {
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  // Un único manejador para todos los campos: usa el name del input como clave del estado
  const handleChange = (event) => {
    const { name, value } = event.target
    setDatos({ ...datos, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault() // evita que el navegador recargue la página
    setMensaje('')
    const nuevosErrores = validar(datos)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    try {
      const paciente = await crearPaciente(datos)
      setMensaje('Paciente registrado correctamente.')
      setDatos(VACIO)
      onPacienteCreado(paciente)
    } catch (error) {
      // Un 400 del backend (por ejemplo, DNI repetido) se muestra debajo de su campo
      if (error instanceof ErrorApi && error.status === 400 && error.datos) {
        const delBackend = {}
        Object.entries(error.datos).forEach(([campo, mensajes]) => {
          delBackend[campo] = [mensajes].flat().join(' ')
        })
        setErrores(delBackend)
      } else {
        setErrores({ general: 'No se pudo registrar el paciente. Intente nuevamente.' })
      }
    }
  }

  return (
    <form className="formulario-paciente" onSubmit={handleSubmit} noValidate>
      <h3>Registrar paciente</h3>
      {CAMPOS.map(({ name, etiqueta, ...atributos }) => (
        <div key={name} className="campo">
          <label htmlFor={name}>{etiqueta}</label>
          <input id={name} name={name} value={datos[name]} onChange={handleChange} {...atributos} />
          {errores[name] && <small className="mensaje-error">{errores[name]}</small>}
        </div>
      ))}
      {errores.general && <p className="mensaje-error">{errores.general}</p>}
      <Boton type="submit" texto="Registrar" />
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
    </form>
  )
}

export default FormularioPaciente
