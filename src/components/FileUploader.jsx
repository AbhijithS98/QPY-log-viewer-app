import React from "react";

const FileUploader = ({ onParsed }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const lines = event.target.result.split("\n").filter(Boolean);
      const parsed = lines.map((line) => {
        try {
          return JSON.parse(line);
        } catch (err) {
          console.warn("Invalid JSON line skipped:", line);
          return null;
        }
      }).filter(Boolean);

      onParsed(parsed);
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <label className="block text-sm font-medium text-gray-700">
        Upload Log File:
      </label>
      <input
        type="file"
        accept=".log,.txt,.json"
        onChange={handleFileUpload}
        className="w-full sm:w-auto px-4 py-2 border border-gray-400 rounded-md shadow-sm text-sm focus:outline-none focus:ring focus:ring-indigo-500"
      />
    </div>
  );
}

export default FileUploader