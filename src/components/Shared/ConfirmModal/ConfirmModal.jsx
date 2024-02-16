// Modal.js

import { XMarkIcon } from '@heroicons/react/24/solid';
import React from 'react';

const ConfirmModal = ({ isOpen, onClose, children }) => {
    const modalClasses = isOpen
        ? 'fixed p-50 top-10 left-0 w-full h-full flex items-center justify-center z-30'
        : 'hidden';

    return (
        <div className={modalClasses}>
            <div className="absolute w-full h-full bg-gray-800 opacity-75" onClick={onClose}></div>
            <div className="bg-white p-8 rounded-lg z-990 relative">
                <button className="absolute top-0 right-0 p-4" onClick={onClose}>
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
                {children}
            </div>
        </div>
    );
};

export default ConfirmModal;
