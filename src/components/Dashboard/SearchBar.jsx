import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ onSearch, onClear, searchQuery, searchType, onTypeChange, setActiveSection }) => {
  const handleTypeChange = (value) => {
    if (typeof onTypeChange === 'function') {
      onTypeChange(value);
    }
    if (typeof setActiveSection === 'function') {
      setActiveSection(value === 'all' ? 'links' : value);
    }
  };

  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onClear();
  };

  return (
    <div className="w-full px-2 sm:px-0">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          className="block w-full pl-10 pr-31 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 sm:text-sm"
          placeholder="Buscar..."
          maxLength={50}
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-23 pr-3 flex items-center"
          >
            <FiX className="h-5 w-5 text-gray-400 hover:text-gray-300" />
          </button>
        )}
        <select
          value={searchType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="absolute inset-y-0 right-2 flex items-center px-2 text-xs sm:text-sm border-l border-gray-600 bg-gray-700 text-gray-300 rounded-r-lg focus:outline-none"
        >
          <option value="all" className="bg-gray-700 text-gray-300">Todos</option>
          <option value="links" className="bg-gray-700 text-gray-300">Links</option>
          <option value="notes" className="bg-gray-700 text-gray-300">Notas</option>
          <option value="todos" className="bg-gray-700 text-gray-300">Tarefas</option>
          <option value="images" className="bg-gray-700 text-gray-300">Imagens</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;