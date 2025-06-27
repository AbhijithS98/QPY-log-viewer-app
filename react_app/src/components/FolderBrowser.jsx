import { useState, useEffect } from "react";


const FolderBrowser = () => {
  const [path,setPath] = useState([]);
  const [folders,setFolders] = useState([]);
  const [files,setFiles] = useState([]);

  const prefix = path.join("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/list?prefix=${prefix}`)
      .then((res) => res.json())
      .then((data) => {
        setFolders(data.folders);
        setFiles(data.files);
      });
  }, [prefix]);

  const handleFolderClick = (folder) => setPath([...path, folder]);
  
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">📁 Folders</h3>
          {folders.map((folder) => (
            <div
              key={folder}
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => handleFolderClick(folder)}
            >
              {folder}
            </div>
          ))}
        </div>
 
      </div>
    </div>
  )
}

export default FolderBrowser
