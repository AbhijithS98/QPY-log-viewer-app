import { useState, useEffect } from 'react'
import Breadcrumbs from '../components/BreadCrumbs'
import { FiFolder, FiFileText } from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom';

const FolderBrowser = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const pathString = decodeURIComponent(location.pathname.replace(/^\/log-archives\/?/, ''))
  const initialPath = pathString ? pathString.split('/').filter(Boolean).map(p => p + '/') : []
  const [currentPath, setCurrentPath] = useState(initialPath)
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  

  const prefix = currentPath.join('')

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:5000/api/list?prefix=${prefix}`)
      .then((res) => res.json())
      .then((data) => {
        setFolders(data.folders)
        setFiles(data.files)
        setLoading(false)
      })
  }, [prefix])

  // Update URL when currentPath changes
  useEffect(() => {
    if (currentPath.length) {
      navigate(`/log-archives/${encodeURIComponent(currentPath.join(''))}`)
    } else {
      navigate(`/log-archives`)
    }
    // eslint-disable-next-line
  }, [currentPath])

  const handleFolderClick = (folder) => {
    setCurrentPath([...currentPath, folder])
  }

  const handleBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1)
      setCurrentPath(newPath)
    }
  }

  return (
    <>
    <div className="m-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <FiFolder className="inline mr-2" />
        Browse Log Files
      </h1>
    </div>
    <div className="bg-gray-200 rounded-lg shadow p-6 w-full max-w-screen-lg mx-auto">
      <Breadcrumbs path={currentPath} onNavigate={setCurrentPath} onBack={handleBack} />

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-1 text-gray-700">
                <FiFolder /> Folders
              </h3>
              {folders.length === 0 && <div className="text-gray-400 italic">No folders</div>}
              <ul>
                {folders.map((folder) => (
                  <li key={folder}>
                    <button
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 text-blue-700 font-medium text-lg"
                      onClick={() => handleFolderClick(folder)}
                    >
                      <FiFolder /> {folder.replace(/\/$/, '')}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-1 text-gray-700">
                <FiFileText /> Files
              </h3>
              {files.length === 0 && <div className="text-gray-400 italic">No files</div>}
              <ul>
                {files.map((file) => (
                  <li key={file}>
                    <Link
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-green-50 text-green-700 font-medium text-lg"
                      to={`/logs/${encodeURIComponent(prefix + file)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiFileText /> {file}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
    </>
  )
}

export default FolderBrowser
