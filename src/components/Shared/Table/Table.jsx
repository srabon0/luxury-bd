import React from 'react';

const Table = ({ columns, children }) => {
  // Determine the number of columns based on the columns prop


  // Split the children into rows based on the number of columns

  return (
    <div className='overflow-x-auto'>
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
