import { convertToIST } from "../utils/time";
import { isObject } from "../utils/isObject";

const LogDetailsModal = ({ log, onClose}) => {
  if(!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-opacity-30">
      <div className="bg-gray-100 w-full sm:w-3/4 h-full overflow-y-auto shadow-2xl relative p-6 rounded-l-xl">
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
            <span className="text-gray-800 font-mono">{log.tags?.join(", ") || "-"}</span>
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
