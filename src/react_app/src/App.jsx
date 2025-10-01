import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import FolderBrowser from './pages/FolderBrowser'
import LogTable from './pages/LogTable'
import { QueryProvider } from './context/QueryContext'

const App = () => {
  return (
    <Router>
      <QueryProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<FolderBrowser />} />
          <Route path="/log-archives/*" element={<FolderBrowser />} />
          <Route path="/logs/:logId" element={<LogTable />} />
        </Routes>
      </QueryProvider>
    </Router>
  )
}

export default App
