import { convertToIST } from "../utils/time"

const LogTable = ({logs}) => {
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
            {logs.map((log, index) => (
              <tr
                key={index}
                className="border-t hover:bg-blue-100 cursor-pointer"
                
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm">{convertToIST(log.timestamp)}</td>
                <td className="px-4 py-2 font-medium text-gray-800">
                  {log.tags ? log.tags.join(", ") : "-"}
                </td>
                <td className="px-4 py-2">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LogTable
