import React from 'react';

const TableCell = ({ content, className, align = 'left', imgSrc, hasImg, element, children }) => {
    return (
        <td className={`${className} text-${align}`}>
            {hasImg && <div className="flex items-center space-x-2">
                <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                        <img src={imgSrc} alt="_" />
                    </div>
                </div>
                <div>
                    {content}
                </div>
            </div>}
            {element}
            {children}
        </td>
    );
};

export default TableCell;