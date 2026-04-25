import{ useId, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode;
    fullWidth?: boolean;
    label?: string;
    error?: string;
    id?: string;
}

const Input = ({icon, label, fullWidth, error, id, className, ...rest}: InputProps) => {
    
    const generatedId = useId();
    const inputId = id || generatedId;

    return(
        <div className={`${fullWidth ? 'w-full' : ''}mb-4 `}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-50 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
            {icon && (
                <div className="absolute bottom-0 top-5.5 left-1 pl-1 flex items-center cursor-pointer text-gray-400">
                    {icon}
                </div>
            )}
            </div>
            <input 
            id={inputId}
            className={`block w-full rounded-xl border ${error ? "border-red-700" :"border-gray-700"}
            bg-gray-800 px-4 py-3 text-sm text-gray-50
            transition-all focus:outlione-none focus:ring-2
            ${error ? " bg-red-500 focus:border-red-700 focus:ring-red-700/2" : "focus:bg-gray-700  focus:border-primary-500 focus:ring-gray-500/2"}
            ${icon ? "pl-10" : ""}
            ${className}
            `}
            {...rest}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )} 
        </div>
        
    )
}

export default Input;