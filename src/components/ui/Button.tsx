import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark-outline' | 'white' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 border border-transparent focus:ring-blue-500',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-sm border border-transparent focus:ring-slate-900',
    outline:
      'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 focus:ring-blue-500',
    'dark-outline':
      'bg-slate-800/90 hover:bg-slate-700/90 text-white hover:text-cyan-300 border border-slate-700 hover:border-slate-500 shadow-sm focus:ring-slate-700',
    white:
      'bg-white hover:bg-slate-100 text-slate-900 shadow-md border border-slate-200 hover:border-slate-300 focus:ring-slate-300',
    glass:
      'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-md shadow-sm focus:ring-white/30',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-blue-600 border border-transparent focus:ring-slate-400',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
