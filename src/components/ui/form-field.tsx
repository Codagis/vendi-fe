import React from 'react';
import { Label } from './label';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, required, error, children, className }: FormFieldProps) {
  return (
    <div className={className}>
      <Label className={error ? 'text-red-600' : ''}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="mt-2">
        {children}
        {error && (
          <p className="text-red-600 text-sm mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export function FormInput({ label, required, error, className, ...props }: FormInputProps) {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <Input
        {...props}
        className={`${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className || ''}`}
      />
    </FormField>
  );
}

interface FormSelectProps {
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSelect({ 
  label, 
  required, 
  error, 
  value, 
  onValueChange, 
  placeholder, 
  children, 
  className 
}: FormSelectProps) {
  return (
    <FormField label={label} required={required} error={error} className={className}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
    </FormField>
  );
}




