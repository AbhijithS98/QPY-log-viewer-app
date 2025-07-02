import { useState, useEffect } from 'react'
import Breadcrumbs from './BreadCrumbs'
import { FiFolder, FiFileText } from 'react-icons/fi'

const FolderBrowser = ({ onFileSelect, currentPath = [], setCurrentPath }) => {
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
                    <button
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-green-50 text-green-700 font-medium text-lg"
                      onClick={() => onFileSelect(prefix + file, [...currentPath, file])}
                    >
                      <FiFileText /> {file}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default FolderBrowser
