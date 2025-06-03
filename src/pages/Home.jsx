import { useState,useEffect } from "react"
import FileUploader from "../components/FileUploader";
import LogTable from "../components/LogTable";

const Home = () => {
  const [logs, setLogs] = useState([]);
  
  useEffect(()=>{
    console.log("parsed logs:", logs);
  }, [logs]);

  return (
    <>
    <div className="p-6 flex justify-between">
      <h1 className="text-2xl font-semibold mb-4">Log Viewer</h1>
      <FileUploader onParsed={setLogs}/>
    </div>
    <div>
      <LogTable logs={logs}/>
    </div>
    </>
  )
}

export default Home
