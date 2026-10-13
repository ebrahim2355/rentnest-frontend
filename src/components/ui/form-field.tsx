import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const controlStyles =
  "w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-ring/40 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive";

interface FieldProps {
  label?: string;
  htmlFor?: string;
  error?: string | undefined;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export const Field = ({ label, htmlFor, error, hint, required, className, children }: FieldProps) => {
  const labelText = label && (
    <span className="mb-1.5 block text-sm font-medium text-foreground">
      {label}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </span>
  );

  return (
    <div className={cn("space-y-1.5", className)}>
      {htmlFor ? (
        <label className="block">
          {labelText}
          {children}
        </label>
      ) : (
        <div>
          {labelText}
          {children}
        </div>
      )}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={cn(controlStyles, "h-10", className)} {...props} />;
};

export const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return <textarea className={cn(controlStyles, "min-h-28 py-2", className)} {...props} />;
};

export const Select = ({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select className={cn(controlStyles, "h-10 cursor-pointer", className)} {...props}>
      {children}
    </select>
  );
};
