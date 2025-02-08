interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-[#1b1f26]/95 backdrop-blur-sm border border-gray-600 disabled:opacity-50 text-foreground"
      >
        Previous
      </button>
      <span className="text-sm font-medium text-black">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-[#1b1f26]/95 backdrop-blur-sm border border-gray-600 disabled:opacity-50 text-foreground"
      >
        Next
      </button>
    </div>
  );
}
