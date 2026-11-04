// Comunicación con la API REST de Django (clinica/)
export const API_URL = 'http://localhost:8000/api/'

// Error con el código HTTP y el cuerpo que devolvió la API (por ejemplo, los mensajes de un 400)
export class ErrorApi extends Error {
  constructor(status, datos) {
    super(mensajeDeError(datos) || `Error ${status} al comunicarse con la API`)
    this.status = status
    this.datos = datos
  }
}

// Convierte {"detail": "..."} o {"campo": ["msg"]} en un solo texto legible
export function mensajeDeError(datos) {
  if (!datos) return ''
  if (typeof datos === 'string') return datos
  if (datos.detail) return datos.detail
  return Object.values(datos).flat().join(' ')
}

async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(API_URL + ruta, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  })
  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null)
  if (!respuesta.ok) throw new ErrorApi(respuesta.status, datos)
  return datos
}

const enviar = (metodo, datos) => ({ method: metodo, body: JSON.stringify(datos) })

export const getEspecialidades = () => solicitar('especialidades/')
export const getMedicos = (especialidadId) =>
  solicitar(especialidadId ? `medicos/?especialidad=${especialidadId}` : 'medicos/')
export const getPacientes = () => solicitar('pacientes/')
export const getCitas = () => solicitar('citas/')
export const getEstados = () => solicitar('estados/')
export const crearCita = (datos) => solicitar('citas/', enviar('POST', datos))
export const crearPaciente = (datos) => solicitar('pacientes/', enviar('POST', datos))
export const eliminarPaciente = (id) => solicitar(`pacientes/${id}/`, { method: 'DELETE' })
export const actualizarCita = (id, datos) => solicitar(`citas/${id}/`, enviar('PATCH', datos))
