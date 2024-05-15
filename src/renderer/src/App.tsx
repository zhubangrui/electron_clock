// import ClockContent from './components/ClockContent/ClockContent'
import Clock from './components/clock_content/Clock'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      {/* <ClockContent /> */}
      <Clock />
    </>
  )
}

export default App
