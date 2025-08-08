import React from 'react';
import { cn } from '@/lib/utils';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Separator = ({ className, ...props }: SeparatorProps) => {
  return <div className={cn('h-px w-full bg-border my-4', className)} {...props} />;
};
