import { useState, useEffect } from "react"

const FilterSearch = ({ onApply }) => {
  const TRIGGER_SUGGESTIONS = ['@tags:', '-@tags:', '@level:'];
  const LEVEL_SUGGESTIONS = ['info', 'error', 'warn'];

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");

  const updateSuggestions = (value) => {
    if (value.endsWith("@level:")) {
      setSuggestions(LEVEL_SUGGESTIONS);
      setShowSuggestions(true);
    } else if (value.endsWith('@')) {
      setSuggestions(TRIGGER_SUGGESTIONS);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    updateSuggestions(value);
  };

  useEffect(() => {
    updateSuggestions(query);
  }, [query]);

  const handleSuggestionClick = (suggestion) => {
    let newQuery = query;

    if (query.endsWith('@')) {
      newQuery = query.replace(/@$/, suggestion);
    } else if (query.endsWith('@level:')) {
      newQuery = query.replace(/@level:$/, `@level:${suggestion} `);
    } else {
      newQuery = query + suggestion + ' ';
    }
    setQuery(newQuery);
    setShowSuggestions(false);
  };


  const handleApply = () => {
    const tokens = query.trim().split(/\s+/);

    const tags = [];
    const exTags = [];
    let level = null;
    let logic = "AND";
    let searchText = "";

    tokens.forEach((token, i) => {
      if (token.toUpperCase() === "OR") logic = "OR";
      else if (token.toUpperCase() === "AND") logic = "AND";
      else if (token.startsWith("@tags:")) tags.push(token.slice(6).toLowerCase());
      else if (token.startsWith("-@tags:")) exTags.push(token.slice(7).toLowerCase());
      else if (token.startsWith("@level:")) level = token.slice(7).toLowerCase();
      else searchText += token + " ";
    });

    onApply({
      tags,
      exTags,
      level,
      logic,
      searchText: searchText.trim().toLowerCase(),
    });
  };

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
    onApply({});
  };  

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 m-4 w-full flex-wrap">
      <div className="relative flex items-center gap-1">
        <label className="text-md font-medium">Search & Filter:</label>
        <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder='e.g. @level:info @tags:fyers AND/OR @tags:zerodha "Search Text"'
        className="px-3 py-2 border rounded w-full sm:w-[32rem] text-sm"
        />

        {showSuggestions && (
          <div className="absolute left-28 top-full mt-1 w-1/3 bg-gray-100 border rounded shadow z-10">
            {suggestions.map(s => (
              <div
                key={s}
                className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </div>
            ))}
          </div>
        )}
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
