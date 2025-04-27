export interface SpecialDay {
  date: string;
  isClosed: boolean;
  openingTime?: string;
  closingTime?: string;
  reason?: string;
}

export interface TimeSlot {
  open: string; // Format: "HH:MM" (24-hour)
  close: string; // Format: "HH:MM" (24-hour)
}

export interface DailySchedule {
  isOpen: boolean;
  slots: TimeSlot[];
}

export interface Availability {
  restaurant: string;
  regularHours: Record<string, DailySchedule>;
  specialDays: Record<string, DailySchedule>;
  isTemporarilyClosed?: boolean;
  temporaryClosureEndDate?: string;
} 