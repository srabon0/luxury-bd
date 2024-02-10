import React from 'react';

const SIZE = {
    sm: "w-1/4",
    md: "w-1/3",
    lg: "w-1/2",
    xl: "w-2/3",
}

const Drawer = ({ isOpen, onClose, children, title, size = "md" }) => {
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div onClick={onClose} className="fixed inset-0 z-40 bg-black opacity-40 left-0"></div>
                    <div
                        className={`fixed inset-y-0 right-0 z-50 transform transition-transform duration-500 ease-in-out ${SIZE[size]} bg-white overflow-y-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        <div className="p-4 h-full">
                            <div className="flex justify-between items-center">
                                <h2>{title}</h2>
                                <button className="text-base font-bold" onClick={onClose}>
                                    X
                                </button>
                            </div>
                            <div className="mt-4 h-full">{children}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Drawer;