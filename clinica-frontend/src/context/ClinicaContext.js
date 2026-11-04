import { createContext } from 'react'

// Datos de la sesión de recepción que necesitan varios componentes lejanos en el árbol:
// { recepcionista, setRecepcionista, fechaTrabajo, setFechaTrabajo, RECEPCIONISTAS }
export const ClinicaContext = createContext(null)

export const RECEPCIONISTAS = ['Ana Torres', 'Luis Quispe']
