const Button = ({ children, className = '', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
