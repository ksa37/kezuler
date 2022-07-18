interface Reminder {
  fixedEventId: string;
  userId: string;
  Date: number;
  timeDelta: number;
}

interface PPutReminder {
  timeDelta: number;
}

export type { Reminder, PPutReminder };
