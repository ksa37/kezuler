interface DialogProps {
  date?: string;
  timeRange?: string;
  title: string;
  description?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

interface AlertProps {
  title: string;
  description?: string;
}

export type { DialogProps, AlertProps };
