import Clock from './components/clock_content/Clock'
import ControlConfig from './components/control_config/ControlConfig'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div style={{ position: 'relative' }}>
      <Clock />
      <ControlConfig />
    </div>
  )
}

export default App
