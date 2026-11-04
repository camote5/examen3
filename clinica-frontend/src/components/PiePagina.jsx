import './PiePagina.css'

const ANIO = new Date().getFullYear()

function PiePagina() {
  return (
    <footer className="pie-pagina">
      <p>Clínica San Gabriel · Sistema de citas médicas · {ANIO}</p>
    </footer>
  )
}

export default PiePagina
