import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { convertToIST } from '../utils/time'
import { isObject } from '../utils/isObject'
import LogDetailsModal from './LogDetailsModal'
import FilterSearch from './FilterSearch'
import { filterLogs, exportLogs } from '../utils/logUtils'
import { FiFileText, FiArrowLeft, FiFolder } from 'react-icons/fi'

const LogTable = () => {
  const { logId } = useParams()
  const navigate = useNavigate()
  const [limit, setLimit] = useState(20)
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedLog, setSelectedLog] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!logId) return
    setLoading(true)
    fetch(`http://localhost:5000/api/file?key=${logId}`)
      .then((res) => res.text())
      .then((text) => {
        const logsData = text
          .split('\n')
          .filter(Boolean)
          .map((line) => JSON.parse(line))
        setLogs(logsData)
        setFilteredLogs(logsData)
        setLimit(20)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [logId])

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime()
    const timeB = new Date(b.timestamp).getTime()
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA
  })

  const currentLogs = sortedLogs.slice(0, limit)

  const handleBackToBrowser = () => {
    setLogs([])
    setFilteredLogs([])
    setLimit(20)
    navigate('/')
  }

  const handleFilterApply = (params) => {
    setFilteredLogs(filterLogs(logs, params))
  }

  const handleExport = () => {
    exportLogs(sortedLogs)
  }

  return (
    <div>
      <div className="m-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FiFileText className="inline mr-2" />
          Parsed Log File Entries
        </h1>
        <button
          onClick={handleBackToBrowser}
          className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded text-sm"
          title="Choose another file"
        >
          <FiArrowLeft /> Choose Another File
        </button>
      </div>

      <div className='m-4 flex justify-baseline items-center gap-2'>
       <FiFolder />
       <span className='font-bold text-gray-500'>{logId}</span>
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
      <div className="m-4 border-2 overflow-x-auto rounded-md shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-300 text-gray-700 font-semibold">
            <tr>
              <th
                className="px-4 py-3 cursor-pointer select-none"
                onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              >
                DATE {sortOrder === 'asc' ? '▲' : '▼'}
              </th>

              <th className="px-4 py-3">TAGS</th>
              <th className="px-4 py-3">MESSAGE</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500 text-xl">
                  Loading logs...
                </td>
              </tr>
            ) :
            !currentLogs.length ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-red-600 text-xl">
                  No logs found..!
                </td>
              </tr>
            ) : (
              currentLogs.map((log, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-blue-100 cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span
                        className={`
                        inline-block w-1.5 h-5 mr-2 rounded
                        ${log.level === 'error' ? 'bg-red-500' : ''}
                        ${log.level === 'warn' ? 'bg-orange-400' : ''}
                        ${log.level === 'info' ? 'bg-blue-500' : ''}
                      `}
                        aria-hidden="true"
                      />
                      {convertToIST(log.timestamp)}
                    </div>
                  </td>

                  <td className="px-4 py-2 font-medium text-gray-800">
                    {log.tags ? log.tags.join(', ') : '-'}
                  </td>
                  <td className="px-4 py-2">
                    {isObject(log.message) ? JSON.stringify(log.message) : log.message}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedLog && <LogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />}

      {logs.length > 0 && (
        <div className="flex justify-end mb-2 mr-4">
          <button
            onClick={() => setLimit((prev) => prev + 20)}
            disabled={limit >= logs.length}
            className={`text-blue-600 font-semibold cursor-pointer bg-transparent border-none 
              ${limit >= logs.length ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
          >
            Load more <span className="ml-1">&gt;&gt;</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default LogTable
