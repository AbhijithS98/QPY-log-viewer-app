import { useState,useEffect } from "react"
import FileUploader from "../components/FileUploader";
import LogTable from "../components/LogTable";
import FilterSearch from "../components/FilterSearch";
import { filterLogs, exportLogs } from "../utils/logUtils";

const Home = () => {
  const [limit,setLimit] = useState(20);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  
  useEffect(()=>{
    console.log("parsed logs:", logs);
  }, [logs]);

  const handleParsedLogs = (data) => {
    setLogs(data);
    setFilteredLogs(data);
  };

  const handleFilterApply = (params) => {
  setFilteredLogs(filterLogs(logs, params));
  };

  const handleExport = () => {
  exportLogs(filteredLogs);
  };

  return (
    <>
    <div className="m-4 flex justify-between">
      <h1 className="text-2xl font-semibold">Parsed Log File Entries</h1>
      <FileUploader onParsed={handleParsedLogs} setLimit={setLimit}/>
    </div>
    
    {logs.length > 0 && <div>
      <span className="m-4 font-bold text-blue-500">{filteredLogs.length} logs found</span>
      <div className="flex justify-between items-center pr-4">
        <FilterSearch onApply={handleFilterApply}/>
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded text-md whitespace-nowrap"
          >
          Export Logs
        </button>
      </div>    
    </div>}

    <div>
      <LogTable logs={filteredLogs} limit={limit} setLimit={setLimit}/>
    </div>
    </>
  )
}

export default Home
