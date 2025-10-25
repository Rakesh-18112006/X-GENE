import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#a0a3bd] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-[#1a1c24] border border-[#2a2d3a] rounded-lg text-white
            placeholder-[#6b6f8a] focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20
            transition-all duration-300 ${error ? 'border-[#ff3366]' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#ff3366]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
