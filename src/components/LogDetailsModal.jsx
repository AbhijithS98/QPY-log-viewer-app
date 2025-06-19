import { useState, useRef, useEffect } from "react";
import { convertToIST } from "../utils/time";
import { isObject } from "../utils/isObject";
import { useQuery } from "../context/QueryContext";
import { highlightMatches } from "../utils/highlightMatches";
import { FiSearch } from "react-icons/fi";

const LogDetailsModal = ({ log, onClose}) => {
  if(!log) return null;

  const { setQuery } = useQuery();
  const [openTagMenu, setOpenTagMenu] = useState(null);
  const [openLevelMenu, setOpenLevelMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef(null);

  const handleTagClick = (idx) => {
    setOpenTagMenu(openTagMenu === idx ? null : idx);
  };

  const handleLevelClick = (level) => {
    setOpenLevelMenu(openLevelMenu === level ? null : level);
  };

  const handleTagOptionClick = (option, tag) => {
    if (option === "filterBy") {
      setQuery(prev => prev.trim() + (prev.trim() ? " " : "") + `@tags:${tag}`);
    } else if (option === "exclude") {
      setQuery(prev => prev.trim() + (prev.trim() ? " " : "") + `-@tags:${tag}`);
    } else if (option === "replace") {
      setQuery(`@tags:${tag}`);
    }
    setOpenTagMenu(null);
  };

  const handleLevelOptionClick = (option, level) => {
    if (option === "filterBy") {
      setQuery(prev => prev.trim() + (prev.trim() ? " " : "") + `@level:${level}`);
    } else if (option === "exclude") {
      setQuery(prev => prev.trim() + (prev.trim() ? " " : "") + `-@level:${level}`);
    } 
    setOpenLevelMenu(null);
  };

  
  const messageString = isObject(log.message)
    ? JSON.stringify(log.message, null, 2)
    : String(log.message);

  // Focus input when shown
  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-opacity-30">
      <div className={` bg-gray-100 w-full sm:w-3/4 h-full overflow-y-auto shadow-2xl relative p-6 rounded-l-xl border-t-8
            ${log.level === 'info' ? 'border-t-blue-500' : ''}
            ${log.level === 'error' ? 'border-t-red-400' : ''}
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
        <div className="flex items-center gap-1 mt-2 mb-8">
          <span className={`border rounded py-0.5 px-1.5
                  ${log.level === 'info' ? 'bg-blue-400' : ''}
                  ${log.level === 'error' ? 'bg-red-400' : ''}
                  ${log.level === 'warn' ? 'bg-orange-400' : ''}`}
          >
            {log.level.toUpperCase()}
          </span>
          <p className="text-xl font-semibold text-gray-700">
          {convertToIST(log.timestamp)}
          </p>
        </div>
        

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-base">

          <div>
            <span className="font-bold text-blue-600">Instance : </span>
            <span className="text-gray-800 font-mono">{log.instance || "-"}</span>
          </div>
          <div>
            <span className="font-bold text-blue-600">PID : </span>
            <span className="text-gray-800 font-mono">{log.pid || "-"}</span>
          </div>
          <div>
            <span className="font-bold text-blue-600">Timestamp : </span>
            <span className="text-gray-800 font-mono">{convertToIST(log.timestamp)}</span>
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
                      onClick={() => handleTagOptionClick("filterBy", tag)}
                    >
                      Filter by <strong className="text-gray-800 font-mono">{tag}</strong>
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-blue-100"
                      onClick={() => handleTagOptionClick("exclude", tag)}
                    >
                      Exclude <strong className="text-gray-800 font-mono">{tag}</strong>
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-blue-100"
                      onClick={() => handleTagOptionClick("replace", tag)}
                    >
                      Replace filter with <strong className="text-gray-800 font-mono">{tag}</strong>
                    </button>
                  </div>
                )}
              </span>              
            ))}
          </div>

          <div>
            <span className="font-bold text-blue-600">Level : </span>
              <span className="relative inline-block">
                <button                    
                  className="mx-1 px-2 py-1 bg-blue-100 hover:bg-blue-300 text-gray-800 font-mono rounded cursor-pointer"
                  onClick={() => handleLevelClick(log.level)}
                >
                  {log.level}
                </button>
                {openLevelMenu === log.level && (
                  <div className="absolute left-0 mt-1 bg-white border rounded shadow-lg z-10 w-max">
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-blue-100"
                      onClick={() => handleLevelOptionClick("filterBy", log.level)}
                    >
                      Filter by <strong className="text-gray-800 font-mono">{log.level}</strong>
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-blue-100"
                      onClick={() => handleLevelOptionClick("exclude", log.level)}
                    >
                      Exclude <strong className="text-gray-800 font-mono">{log.level}</strong>
                    </button>       
                  </div>
                )}
                </span>
          </div>

          {log.func && <div>
            <span className="font-bold text-blue-600">func : </span>
            <span className="text-gray-800 font-mono">{log.func || "-"}</span>
          </div>}
          {log.errorFunc && <div>
            <span className="font-bold text-blue-600">errorFunc : </span>
            <span className="text-gray-800 font-mono">{log.errorFunc || "-"}</span>
          </div>}
          {log.module && <div>
            <span className="font-bold text-blue-600">module : </span>
            <span className="text-gray-800 font-mono">{log.module || "-"}</span>
          </div>}

          
          <div className="sm:col-span-2">
            <span className="block font-bold text-blue-600 mb-1">Message :</span>
            <div className="relative">
              <pre className="bg-gray-50 border border-gray-200 text-blue-900 p-4 rounded whitespace-pre-wrap break-words">
                {/* Search icon/input in top-right */}
                <div className="absolute top-2 right-2">
                  {!showSearch ? (
                    <button
                      onClick={() => setShowSearch(true)}
                      className="p-1 rounded hover:bg-gray-200"
                      aria-label="Search in message"
                    >
                      <FiSearch size={18} />
                    </button>
                  ) : (
                    <input
                      ref={inputRef}
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      onBlur={() => setShowSearch(false)}
                      placeholder="Search..."
                      className="border px-2 py-1 rounded text-sm"
                      style={{ minWidth: 80 }}
                    />
                  )}
                </div>

                {highlightMatches(messageString, search)}
              </pre>
            </div>          
          </div>

        </div>
      </div>
    </div>
  )
}

export default LogDetailsModal
