import * as React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils'; // or replace with your own classNames() helper

export const Dialog = RadixDialog.Root;

export const DialogTrigger = RadixDialog.Trigger;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
    <RadixDialog.Content
      ref={ref}
      className={cn(
        'fixed z-50 left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </RadixDialog.Content>
  </RadixDialog.Portal>
));
DialogContent.displayName = 'DialogContent';
