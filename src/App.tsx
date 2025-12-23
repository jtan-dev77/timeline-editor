import { TimelineProvider } from './contexts/TimelineContext'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import PreviewArea from './components/Layout/PreviewArea'
import PropertiesPanel from './components/Layout/PropertiesPanel'
import Timeline from './components/Layout/Timeline'
import KeyboardShortcuts from './components/KeyboardShortcuts'

function App() {
  return (
    <TimelineProvider>
      <KeyboardShortcuts />
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <PreviewArea />
          <PropertiesPanel />
        </div>
        <Timeline />
      </div>
    </TimelineProvider>
  )
}

export default App
