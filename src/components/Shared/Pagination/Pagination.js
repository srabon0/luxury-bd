import React from "react";

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  console.log("currentPage", currentPage);
  console.log("itemsPerPage", itemsPerPage);
  console.log("totalItems", totalItems);
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    //show default 1 page if totalItems is 0
    if (i === 1 && totalItems === 0) {
      pageNumbers.push(i);
    } else if (i > 1) {
      pageNumbers.push(i);
    }
  }
  return (
    <div className="join">
      {pageNumbers?.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`join-item btn btn-xs ${
            currentPage === number ? "btn-active" : ""
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
