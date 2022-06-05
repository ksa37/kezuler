interface TError {
  response?: {
    data?: {
      error?: {
        header: string;
        message: string;
        name?: unknown;
      };
    };
    status?: number;
  };
  message?: string;
}

export type { TError };
