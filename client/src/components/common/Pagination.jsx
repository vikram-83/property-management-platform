const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
