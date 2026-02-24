import React from 'react';

export const Card = ({ children, title, subtitle, className = "" }) => (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
        {(title || subtitle) && (
            <div className="px-6 py-4 border-b border-slate-100">
                {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
        )}
        <div className="p-6">
            {children}
        </div>
    </div>
);

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100',
        secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-red-100',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export const Input = ({ label, error, className = "", ...props }) => (
    <div className={`space-y-1.5 ${className}`}>
        {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
        <input
            className={`w-full px-4 py-2 bg-white border rounded-lg text-slate-900 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
            {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

export const Badge = ({ children, variant = "info" }) => {
    const variants = {
        success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        info: 'bg-blue-50 text-blue-700 border-blue-100',
        warning: 'bg-amber-50 text-amber-700 border-amber-100',
        danger: 'bg-red-50 text-red-700 border-red-100',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
            {children}
        </span>
    );
};
