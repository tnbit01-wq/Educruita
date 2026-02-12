// Toast Notification Context - Manages toast notifications

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const Toast = ({ id, type, message, onClose }) => {
    const icons = {
        success: CheckCircleIcon,
        error: XCircleIcon,
        warning: ExclamationTriangleIcon,
        info: InformationCircleIcon,
    };

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-amber-500',
        info: 'text-blue-500',
    };

    const Icon = icons[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg ${colors[type]} min-w-[320px] max-w-md`}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[type]}`} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
        </motion.div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const toast = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast
                            key={toast.id}
                            id={toast.id}
                            type={toast.type}
                            message={toast.message}
                            onClose={removeToast}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export default ToastContext;
