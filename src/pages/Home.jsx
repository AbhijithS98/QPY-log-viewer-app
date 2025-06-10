import { useState,useEffect } from "react"
import FileUploader from "../components/FileUploader";
import LogTable from "../components/LogTable";
import FilterSearch from "../components/FilterSearch";

const Home = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  
  useEffect(()=>{
    console.log("parsed logs:", logs);
  }, [logs]);

  const handleParsedLogs = (data) => {
  setLogs(data);
  setFilteredLogs(data);
  };

  const handleFilterApply = ({ tags, exTags, level, logic, searchText }) => {
  if (!tags && !level && !searchText) return setFilteredLogs(logs);

  const filtered = logs.filter((log) => {
    const logTags = (log.tags || []).map((t) => t.toLowerCase());
    const logLevel = (log.level || "").toLowerCase();
    const msg = typeof log.message === "string"
  ? log.message.toLowerCase()
  : JSON.stringify(log.message || "").toLowerCase();


    // Tag filtering
    let tagMatch = true;
    if (tags.length) {
      tagMatch =
        logic === "OR"
          ? tags.some((t) => logTags.includes(t))
          : tags.every((t) => logTags.includes(t)) 
          && exTags.every((t) => !logTags.includes(t));
    }

    // Level filtering
    let levelMatch = true;
    if (level) levelMatch = logLevel === level;

    // Message search
    const searchMatch = searchText ? msg.includes(searchText) : true;

    return tagMatch && levelMatch && searchMatch;
  });

  setFilteredLogs(filtered);
  };


  const handleExport = () => {
  const logsToExport = filteredLogs; 

  const logText = logsToExport.map(log => JSON.stringify(log)).join("\n");

  const blob = new Blob([logText], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `logs-${new Date().toISOString()}.log`;
  a.click();

  URL.revokeObjectURL(url);
  };


  return (
    <>
    <div className="m-4 flex justify-between">
      <h1 className="text-2xl font-semibold">Parsed Log File Entries</h1>
      <FileUploader onParsed={handleParsedLogs}/>
    </div>
    
    {logs.length > 0 && <div>
      <span className="m-4 text-md text-blue-500">{filteredLogs.length} logs found</span>
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
      <LogTable logs={filteredLogs}/>
    </div>
    </>
  )
}

export default Home
