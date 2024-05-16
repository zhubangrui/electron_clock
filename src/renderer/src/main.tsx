import './assets/main.css'

import ReactDOM from 'react-dom/client'
import App from './App'
import ColorProvider from './common/context/ColorProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ColorProvider>
    <App />
  </ColorProvider>
)
