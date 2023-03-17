import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages'
import './index.css'
import WebVitalsMonitor from './components/WebVitalsMonitor'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WebVitalsMonitor></WebVitalsMonitor>
    <App />
  </React.StrictMode>,
)
