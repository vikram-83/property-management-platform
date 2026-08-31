const Input = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ${className}`}
    />
  );
};

export default Input;
