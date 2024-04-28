import React from "react";
const optionValues = [5, 10, 20, 30];
const Pagination = ({ paginate, meta }) => {
  const pageNumbers = [];
  const totalCounts = meta?.totalCounts || 0;
  const count = meta?.count || 10;
  const page = meta?.page || 1;

  for (let i = 1; i <= Math.ceil(totalCounts / count); i++) {
    pageNumbers.push(i);
  }

  // If totalCounts is 0, show default 1 page
  if (totalCounts === 0 && !pageNumbers.includes(1)) {
    pageNumbers.push(1);
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <select
          onChange={(e) => paginate("item", e.target.value)}
          className="select select-bordered select-sm w-full max-w-xs"
        >
          {optionValues.map((value) => (
            <option key={value} value={value} selected={value === count}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="join">
        {pageNumbers?.map((number) => (
          <button
            key={number}
            onClick={() => paginate("page", number)}
            className={`join-item btn btn-md ${
              page === number ? "btn-active" : ""
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
