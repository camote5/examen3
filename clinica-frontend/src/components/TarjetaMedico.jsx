import medicoDefault from '../assets/medico-default.svg'
import './TarjetaMedico.css'

// Si no se envía `foto`, se usa la imagen por defecto (el modelo Medico no tiene foto)
function TarjetaMedico({ nombres, cmp, especialidad, foto = medicoDefault }) {
  return (
    <article className="tarjeta-medico">
      <img src={foto} alt={`Foto de ${nombres}`} className="tarjeta-medico__foto" />
      <div className="tarjeta-medico__datos">
        <h3 className="tarjeta-medico__nombre">{nombres}</h3>
        <p className="tarjeta-medico__especialidad">{especialidad}</p>
        <p className="tarjeta-medico__cmp">CMP {cmp}</p>
      </div>
    </article>
  )
}

export default TarjetaMedico
