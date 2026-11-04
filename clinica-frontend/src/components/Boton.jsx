import './Boton.css'

// Botón reutilizable: muestra `texto` o, si no llega, lo que vaya entre las etiquetas (children)
function Boton({ texto, variante = 'primario', onClick, children, disabled = false, type = 'button' }) {
  return (
    <button type={type} className={`boton boton--${variante}`} onClick={onClick} disabled={disabled}>
      {texto ?? children}
    </button>
  )
}

export default Boton
