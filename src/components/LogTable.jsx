import { useState } from "react"
import { convertToIST } from "../utils/time"
import { isObject } from "../utils/isObject"


const LogTable = ({logs}) => {
  const [limit,setLimit] = useState(20);

  const currentLogs = logs.slice(0, limit);

  return (
    <div>
      <div className="m-4 border-2 overflow-x-auto rounded-md shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-300 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3">Date (IST)</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.map((log, index) => (
              <tr
                key={index}
                className="border-t hover:bg-blue-100 cursor-pointer"
                
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm">{convertToIST(log.timestamp)}</td>
                <td className="px-4 py-2 font-medium text-gray-800">
                  {log.tags ? log.tags.join(", ") : "-"}
                </td>
                <td className="px-4 py-2">{isObject(log.message) ? JSON.stringify(log.message) : log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length > 0 &&
      <div className="flex justify-end mb-2 mr-4"> 
        <span class="text-blue-600 font-semibold cursor-pointer" onClick={()=>setLimit(prev=>prev+20)}>
          load more <span class="ml-1">&gt;&gt;</span>
        </span>
      </div>
      }
      
    </div>
  )
}

export default LogTable
