"use client"

import * as React from 'react';
import { Input } from '@/components/ui/input';

const NumberInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    const formatNumber = (value: string) => {
      const cleanNum = value.replace(/[^0-9]/g, ''); 
      return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formattedValue = formatNumber(rawValue);
      e.target.value = formattedValue;
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === '-') {
        e.preventDefault();
      }
    };

    return (
      <Input
        type={type}
        className={className}
        ref={ref}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
