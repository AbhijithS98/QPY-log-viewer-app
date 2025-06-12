import { useState } from "react";
import { convertToIST } from "../utils/time";
import { isObject } from "../utils/isObject";
import { useQuery } from "../context/QueryContext";

const LogDetailsModal = ({ log, onClose}) => {
  if(!log) return null;

  const { setQuery } = useQuery();
  const [openTagMenu, setOpenTagMenu] = useState(null);

  const handleTagClick = (idx) => {
    setOpenTagMenu(openTagMenu === idx ? null : idx);
  };

  const handleOptionClick = (option, tag) => {
    // Handle your option logic here
    if (option === "filterBy") {
      setQuery(prev => prev.trim() + (prev.trim() ? " " : "") + `@tags:${tag}`);
    } else if (option === "exclude") {
      setQuery(prev => prev.trim() + (prev.trim() ? " " : "") + `-@tags:${tag}`);
    } else if (option === "replace") {
      setQuery(`@tags:${tag}`);
    }
    setOpenTagMenu(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-opacity-30">
      <div className={` bg-gray-100 w-full sm:w-3/4 h-full overflow-y-auto shadow-2xl relative p-6 rounded-l-xl border-t-8
            ${log.level === 'info' ? 'border-t-blue-500' : ''}
            ${log.level === 'error' ? 'border-t-red-500' : ''}
            ${log.level === 'warn' ? 'border-t-orange-400' : ''}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Log Entry Details</h2>
        <p className="text-xl font-semibold text-gray-700 mb-6">
        {convertToIST(log.timestamp)}
        </p>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-base">
          <div> 
            <span className="font-bold text-blue-600">Level : </span>
            <span className="text-gray-800 font-mono">{log.level || "-"}</span>
          </div>
          <div>
            <span className="font-bold text-blue-600">Instance : </span>
            <span className="text-gray-800 font-mono">{log.instance || "-"}</span>
          </div>
          <div>
            <span className="font-bold text-blue-600">PID : </span>
            <span className="text-gray-800 font-mono">{log.pid || "-"}</span>
          </div>
          <div>
            <span className="font-bold text-blue-600">Tags : </span>
            {log.tags?.map((tag, idx) => (
              <span key={idx} className="relative inline-block">
                <button 
                  key={idx} 
                  className="mx-1 px-2 py-1 bg-blue-100 hover:bg-blue-300 text-gray-800 font-mono rounded cursor-pointer"
                  onClick={() => handleTagClick(idx)}
                >
                  {tag}
                </button>

                {openTagMenu === idx && (
                  <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10 w-max">
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-blue-100"
                      onClick={() => handleOptionClick("filterBy", tag)}
                    >
                      Filter by <strong className="text-gray-800 font-mono">{tag}</strong>
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-blue-100"
                      onClick={() => handleOptionClick("exclude", tag)}
                    >
                      Exclude <strong className="text-gray-800 font-mono">{tag}</strong>
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-blue-100"
                      onClick={() => handleOptionClick("replace", tag)}
                    >
                      Replace filter with <strong className="text-gray-800 font-mono">{tag}</strong>
                    </button>
                  </div>
                )}
              </span>              
            ))}

          </div>
          <div>
            <span className="font-bold text-blue-600">Timestamp : </span>
            <span className="text-gray-800 font-mono">{convertToIST(log.timestamp)}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="block font-bold text-blue-600 mb-1">Message :</span>
            <pre className="bg-gray-50 border border-gray-200 text-blue-900 p-4 rounded whitespace-pre-wrap break-words">
              {isObject(log.message)
                ? JSON.stringify(log.message, null, 2)
                : log.message}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogDetailsModal
