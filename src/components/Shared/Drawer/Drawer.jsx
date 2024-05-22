import React from 'react';

const Drawer = ({ isOpen, onClose, children, title, bg = 'bg-white', direction = 'right' }) => {
    const translateDirection = direction === 'right' ? 'translate-x-full' : '-translate-x-full';
    const alignment = direction === 'right' ? 'right-0' : 'left-0';

    return (
        <>
            {isOpen && (
                <div
                    style={{ zIndex: 10000000000000000 }}
                    className="fixed inset-0  overflow-hidden">
                    <div onClick={onClose} className="fixed inset-0 z-40 bg-black opacity-40 left-0"></div>
                    <div
                        className={`fixed inset-y-0 ${alignment} z-50 transform transition-transform duration-500 ease-in-out w-8/12  md:w-7/12 lg:w-[33%] ${bg}  overflow-y-hidden ${isOpen ? 'translate-x-0' : translateDirection
                            }`}
                    >
                        <div className="p-2 md:p-4 h-full">
                            <div className="flex justify-between items-center">
                                <h2>{title}</h2>

                                <button onClick={onClose} className="btn btn-square btn-outline btn-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
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