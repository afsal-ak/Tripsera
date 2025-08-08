import { type ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './Dialog';
import { Button } from '../Button';

interface CustomDialogProps {
  title?: string;
  triggerLabel: string;
  triggerVariant?: 'default' | 'destructive' | 'outline';
  children?: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  disabled?: boolean;
}

export const CustomDialog = ({
  title,
  triggerLabel,
  triggerVariant = 'default',
  children,
  confirmLabel = 'Confirm',
  onConfirm,
  disabled = false,
}: CustomDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} disabled={disabled}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        {children}
        {onConfirm && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>{confirmLabel}</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
