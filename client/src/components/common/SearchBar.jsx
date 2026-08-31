const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />
      <span className="absolute right-3 top-2.5 text-slate-400">⌕</span>
    </div>
  );
};

export default SearchBar;
