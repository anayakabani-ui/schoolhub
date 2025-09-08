export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
  return date.toTimeString().split(' ')[0].slice(0, 5);
};

export const getWeekDays = (weekOffset: number = 0, layout: 'sun-thu' | 'mon-fri' = 'mon-fri'): Date[] => {
  const now = new Date();
  const day = now.getDay();
  
  if (layout === 'sun-thu') {
    // Sunday to Thursday
    const sunday = new Date(now);
    const diff = (0 - day) + weekOffset * 7;
    sunday.setDate(now.getDate() + diff);
    
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      return date;
    });
  } else {
    // Monday to Friday
    const monday = new Date(now);
    const diff = (day === 0 ? -6 : 1 - day) + weekOffset * 7;
    monday.setDate(now.getDate() + diff);
    
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  }
};

export const getFullWeekDays = (weekOffset: number = 0): Date[] => {
  const now = new Date();
  const day = now.getDay();
  const startDay = new Date(now);
  // Always start from Sunday for full week
  const diff = (0 - day) + weekOffset * 7;
  startDay.setDate(now.getDate() + diff);
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDay);
    date.setDate(startDay.getDate() + i);
    return date;
  });
};

export const getCalendarWeekDays = (weekOffset: number = 0): Date[] => {
  const now = new Date();
  const day = now.getDay();
  const startDay = new Date(now);
  // Always start from Sunday for calendar
  const diff = (0 - day) + weekOffset * 7;
  startDay.setDate(now.getDate() + diff);
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDay);
    date.setDate(startDay.getDate() + i);
    return date;
  });
};

export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const getPlanKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-wk${getWeekNumber(date)}-day${date.getDay()}`;
};

export const isSoon = (dateStr: string): boolean => {
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / (1000 * 3600 * 24);
  return diff >= 0 && diff <= 7;
};

export const generateId = (): string => {
  return Math.random().toString(36).slice(2, 9);
};