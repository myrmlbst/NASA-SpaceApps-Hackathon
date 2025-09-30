import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Button = forwardRef(({ 
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:opacity-50 disabled:pointer-events-none rounded-lg',
        {
          'bg-test-500 text-white hover:bg-test-600': variant === 'default',
          'bg-transparent border border-test-500 text-test-500 hover:bg-test-500/10': variant === 'outline',
          'px-4 py-2': size === 'default',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
