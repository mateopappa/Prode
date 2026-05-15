'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  blur?: boolean;
}

export function Card({ className, blur = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/20 backdrop-blur-md bg-white/10',
        blur && 'backdrop-blur-xl',
        'shadow-lg shadow-white/10',
        className
      )}
      {...props}
    />
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600 hover:to-purple-600 text-white border border-white/20 backdrop-blur-sm',
    secondary:
      'bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm',
    ghost: 'bg-transparent hover:bg-white/10 text-white border border-transparent',
  };

  return (
    <button
      className={cn(
        'rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, ...props }: InputProps) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-white/90">{label}</label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2 rounded-lg',
          'bg-white/10 border border-white/20 backdrop-blur-sm',
          'text-white placeholder:text-white/50',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent',
          'transition-all duration-200',
          error && 'border-red-500/50 focus:ring-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
}

export function Textarea({
  className,
  label,
  error,
  maxLength,
  ...props
}: TextareaProps) {
  const [length, setLength] = React.useState(0);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-white/90">{label}</label>
      )}
      <textarea
        maxLength={maxLength}
        onChange={(e) => {
          setLength(e.target.value.length);
          props.onChange?.(e);
        }}
        className={cn(
          'w-full px-4 py-2 rounded-lg min-h-[80px]',
          'bg-white/10 border border-white/20 backdrop-blur-sm',
          'text-white placeholder:text-white/50',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent',
          'transition-all duration-200 resize-none',
          error && 'border-red-500/50 focus:ring-red-500/50',
          className
        )}
        {...props}
      />
      <div className="flex justify-between text-xs text-white/50">
        <span>{error || ''}</span>
        {maxLength && <span>{length}/{maxLength}</span>}
      </div>
    </div>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        'bg-white/10 border border-white/20 backdrop-blur-sm text-white',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
