import { useState } from 'react'
import { ClinicaContext, RECEPCIONISTAS } from './ClinicaContext'

// Fecha local de hoy en formato aaaa-mm-dd (toISOString usaría UTC y podría dar el día siguiente)
function hoyLocal() {
  const hoy = new Date()
  const dosDigitos = (n) => String(n).padStart(2, '0')
  return `${hoy.getFullYear()}-${dosDigitos(hoy.getMonth() + 1)}-${dosDigitos(hoy.getDate())}`
}

// Guarda el estado compartido y lo entrega a todo el árbol que envuelve
export default function ClinicaProvider({ children }) {
  const [recepcionista, setRecepcionista] = useState(RECEPCIONISTAS[0])
  const [fechaTrabajo, setFechaTrabajo] = useState(hoyLocal)

  return (
    <ClinicaContext.Provider value={{ recepcionista, setRecepcionista, fechaTrabajo, setFechaTrabajo, RECEPCIONISTAS }}>
      {children}
    </ClinicaContext.Provider>
  )
}
