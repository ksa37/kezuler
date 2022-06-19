interface DialogProps {
  date?: string;
  timeRange?: string;
  title: string;
  description?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export type { DialogProps };
