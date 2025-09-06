import React from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    ];

    const variants = {
      primary: [
        "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
        "focus:ring-blue-500 active:bg-blue-800",
      ],
      secondary: [
        "bg-green-600 text-white shadow-sm hover:bg-green-700",
        "focus:ring-green-500 active:bg-green-800",
      ],
      outline: [
        "border border-gray-300 bg-white text-gray-700 shadow-sm",
        "hover:bg-gray-50 focus:ring-gray-500 active:bg-gray-100",
      ],
      ghost: [
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        "focus:ring-gray-500",
      ],
      danger: [
        "bg-red-600 text-white shadow-sm hover:bg-red-700",
        "focus:ring-red-500 active:bg-red-800",
      ],
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm h-8",
      md: "px-4 py-2 text-sm h-10",
      lg: "px-6 py-3 text-base h-12",
    };

    return (
      <button
        ref={ref}
        className={clsx(baseClasses, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          leftIcon && <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
