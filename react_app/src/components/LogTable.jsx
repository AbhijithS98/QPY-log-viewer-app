import { useState } from "react"
import { convertToIST } from "../utils/time"
import { isObject } from "../utils/isObject"
import LogDetailsModal from "./LogDetailsModal"


const LogTable = ({logs, limit, setLimit}) => {
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedLog,setSelectedLog] = useState(null);

  const sortedLogs = [...logs].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
  });

  const currentLogs = sortedLogs.slice(0, limit);

  return (
    <div>     
      <div className="m-4 border-2 overflow-x-auto rounded-md shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-300 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3 cursor-pointer select-none"
                  onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              >
                DATE {sortOrder === "asc" ? "▲" : "▼"}
              </th>
              
              <th className="px-4 py-3">TAGS</th>
              <th className="px-4 py-3">MESSAGE</th>
            </tr>
          </thead>
          <tbody>
            {!currentLogs.length ? (
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
                  {log.tags ? log.tags.join(", ") : "-"}
                </td>
                <td className="px-4 py-2">{isObject(log.message) ? JSON.stringify(log.message) : log.message}</td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      {selectedLog && (
        <LogDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}

      {logs.length > 0 && (
        <div className="flex justify-end mb-2 mr-4">
          <button
            onClick={() => setLimit((prev) => prev + 20)}
            disabled={limit >= logs.length}
            className={`text-blue-600 font-semibold cursor-pointer bg-transparent border-none 
              ${limit >= logs.length ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
            
          >
            Load more <span className="ml-1">&gt;&gt;</span>
          </button>
        </div>
      )}
       
    </div>
  )
}

export default LogTable
