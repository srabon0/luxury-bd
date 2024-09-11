import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

const Pagination = ({ meta, onPageChange, onSizeChange }) => {
  const { totalCounts, totalPages, page, limit } = meta;
  const [selectedLimit, setSelectedLimit] = useState(limit);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setSelectedLimit(newLimit);
    onSizeChange(newLimit);
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (page > totalPages - 4) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 md:gap-x-12 lg:gap-x-40 gap-x-0">
      <div className="flex items-center mb-4 sm:mb-0">
        <select
          id="page-limit"
          value={selectedLimit}
          onChange={handleLimitChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-1"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 flex items-center justify-center mb-4 sm:mb-0">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{(page - 1) * limit + 1}</span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(page * limit, totalCounts)}
          </span>{" "}
          of <span className="font-medium">{totalCounts}</span> results
        </p>
      </div>
      <div className="hidden sm:flex items-center">
        <nav
          aria-label="Pagination"
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        >
          <button
            onClick={() => handlePageChange(page - 1)}
            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            disabled={page === 1}
          >
            <span className="sr-only">Previous</span>
            <FaChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          {getPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() =>
                typeof pageNumber === "number" && handlePageChange(pageNumber)
              }
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                page === pageNumber
                  ? "bg-indigo-600 text-white"
                  : "text-gray-900"
              } ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
              disabled={typeof pageNumber !== "number"}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            disabled={page === totalPages}
          >
            <span className="sr-only">Next</span>
            <FaChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </nav>
      </div>
      <div className="flex sm:hidden items-center">
        <button
          onClick={() => handlePageChange(page + 1)}
          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:z-20 focus:outline-offset-0"
          disabled={page === totalPages}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default Pagination;
