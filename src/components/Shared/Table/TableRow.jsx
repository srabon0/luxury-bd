import React from 'react';

const TableRow = ({ children, key }) => {
    return (
        <tr key={key}>
            {children}
        </tr>

    );
};

export default TableRow;