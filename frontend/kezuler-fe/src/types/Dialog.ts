interface DialogProps {
  date?: string;
  title: string;
  description?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export type { DialogProps };
