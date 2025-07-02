import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const Breadcrumbs = ({ path, onNavigate = () => {}, onBack = () => {} } ) => {
  
  return (
    <nav className="flex items-center mb-4 gap-1">
      <button
        onClick={onBack}
        disabled={path.length === 0}
        className={`text-gray-500 hover:text-blue-600 ${path.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
        title="Go up one folder"
      >
        <FiChevronLeft />
       
      </button>
      <span className="text-gray-700 font-semibold">Root</span>
      {path.map((folder, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <FiChevronRight className="text-gray-400" />
          <button
            className="text-blue-600 hover:underline"
            onClick={() => onNavigate(path.slice(0, idx + 1))}
          >
            {folder.replace(/\/$/, "")}
          </button>
        </span>
      ))}
    </nav>
  );
}


export default Breadcrumbs