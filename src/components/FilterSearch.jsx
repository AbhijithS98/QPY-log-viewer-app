import { useState } from "react"

const FilterSearch = ({ onApply }) => {

  const [query, setQuery] = useState("");

  const handleApply = () => {
    const tokens = query.trim().split(/\s+/);

    const tags = [];
    let level = null;
    let logic = "AND";
    let searchText = "";

    tokens.forEach((token, i) => {
      if (token.toUpperCase() === "OR") logic = "OR";
      else if (token.toUpperCase() === "AND") logic = "AND";
      else if (token.startsWith("@tags:")) tags.push(token.slice(6).toLowerCase());
      else if (token.startsWith("@level:")) level = token.slice(7).toLowerCase();
      else searchText += token + " ";
    });

    onApply({
      tags,
      level,
      logic,
      searchText: searchText.trim().toLowerCase(),
    });
  };

  const handleClear = () => {
    setQuery("");
    onApply({});
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 m-4 w-full flex-wrap">
      <div className="flex items-center gap-1">
        <label className="text-md font-medium">Search & Filter:</label>
        <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='e.g. @level:info @tags:fyers AND/OR @tags:zerodha "Search Text"'
        className="px-3 py-2 border rounded w-full sm:w-[32rem] text-sm"
        />
      </div>

    
      <button
        onClick={handleApply}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm"
      >
        Apply
      </button>

      <button
        onClick={handleClear}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded text-sm"
      >
        Clear
      </button>
    </div>
  )
}

export default FilterSearch
