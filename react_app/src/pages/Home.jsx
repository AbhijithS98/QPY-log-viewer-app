import { useState, useEffect } from 'react'
import FolderBrowser from '../components/FolderBrowser'
import LogTable from '../components/LogTable'
import FilterSearch from '../components/FilterSearch'
import Breadcrumbs from '../components/BreadCrumbs'
import { filterLogs, exportLogs } from '../utils/logUtils'
import { FiFolder, FiArrowLeft, FiFileText } from 'react-icons/fi'

const Home = () => {
  const [limit, setLimit] = useState(20)
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [showBrowser, setShowBrowser] = useState(true)
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    // For debugging
    console.log('parsed logs:', logs)
  }, [logs])

  const handleFilterApply = (params) => {
    setFilteredLogs(filterLogs(logs, params))
  }

  const handleExport = () => {
    exportLogs(filteredLogs)
  }

  const handleFileSelect = async (key, pathArr) => {
    const res = await fetch(`http://localhost:5000/api/file?key=${key}`)
    const text = await res.text()
    const logsData = text
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
    setLogs(logsData)
    setFilteredLogs(logsData)
    setLimit(20)
    setShowBrowser(false)
    setCurrentPath(pathArr);
  }

  const handleBackToBrowser = () => {
    setShowBrowser(true)
    setLogs([])
    setFilteredLogs([])
    setLimit(20)
    setCurrentPath((prevPath)=>prevPath.slice(0,-1))
  }

  return (
    <>
      <div className="m-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          {showBrowser ? (
            <FiFolder className="inline mr-2" />
          ) : (
            <FiFileText className="inline mr-2" />
          )}
          {showBrowser ? 'Browse Log Files' : 'Parsed Log File Entries'}
        </h1>
        {!showBrowser && (
          <button
            onClick={handleBackToBrowser}
            className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded text-sm"
            title="Choose another file"
          >
            <FiArrowLeft /> Choose Another File
          </button>
        )}
      </div>

      {showBrowser ? (
        <FolderBrowser 
          onFileSelect={handleFileSelect}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath} 
        />
      ) : (
        <>
          <div className="flex items-center gap-2 m-4">
            <Breadcrumbs path={currentPath} />
          </div> 
   
          <span className="m-4 font-bold text-blue-500">{filteredLogs.length} logs found</span>
          <div className="flex justify-between items-center pr-4">
            <FilterSearch onApply={handleFilterApply} />
            <button
              onClick={handleExport}
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded text-md whitespace-nowrap"
            >
              Export Logs
            </button>
          </div>
          <div>
            <LogTable logs={filteredLogs} limit={limit} setLimit={setLimit} />
          </div>
        </>
      )}
    </>
  )
}

export default Home
