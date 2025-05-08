import React from 'react';
import { useLocation } from 'react-router-dom';

const Toast = ({ msg, type, show = false }) => {
    const location = useLocation();
    const goTop = location.pathname === "/course-detail" || location.pathname === "/test-detail" || location.pathname === "/material-detail";

    return (
        <div
            className={`${show ? "d-flex" : "d-none"} justify-content-between align-items-center px-2 bg-${type}`}
            style={{
                position: 'fixed',
                // margin: "auto",
                left: '0',
                right: '0',
                height: '56px',
                top: '0',
                zIndex: '10000'
            }}
        >
            <div className="text-center w-100" style={{ fontSize: '14px' }}>
                {msg}
            </div>
        </div>
    );
};

export default Toast;