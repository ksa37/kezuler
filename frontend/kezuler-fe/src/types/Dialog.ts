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

interface ShareProps {
  title: string;
  description?: string;
  element: JSX.Element;
}

export type { DialogProps, AlertProps, ShareProps };
