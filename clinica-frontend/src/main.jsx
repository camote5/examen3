import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ClinicaProvider from './context/ClinicaProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClinicaProvider>
      <App />
    </ClinicaProvider>
  </StrictMode>,
)
