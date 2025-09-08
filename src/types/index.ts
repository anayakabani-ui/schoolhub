export interface Note {
  id: string;
  subject: string;
  text: string;
  created: number;
}

export interface Test {
  id: string;
  subject: string;
  date: string;
  time?: string;
  details: string;
}

export interface Task {
  id: string;
  text: string;
  subject?: string;
  due?: string;
  done: boolean;
  created: number;
}

export interface Book {
  id: string;
  name: string;
  location: 'Class' | 'Locker' | 'Home' | 'Other';
  customLocation?: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'ECA' | 'Library' | 'Test' | 'Reminder' | 'Other';
  color?: string;
  date: string;
  time?: string;
  repeatWeekly: boolean;
  days: number[]; // 0-6 for Sun-Sat
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  hasBook: boolean;
  teacher?: string;
  room?: string;
  customItems: CustomItem[];
}

export interface CustomItem {
  id: string;
  name: string;
  location: 'Class' | 'Locker' | 'Home' | 'Other';
  customLocation?: string;
}

export interface Settings {
  weekLayout: 'sun-thu' | 'mon-fri';
  showHeader: boolean;
  collapseTabs?: boolean;
  collapseTabs?: boolean;
  userName: string;
  curriculum: string;
  school: string;
  yearGroup: string;
  mflLanguage: string;
  useSchoolSubjects?: boolean;
  studySession?: {
    enabled: boolean;
    duration: number;
  };
  dailyStudyGoal?: {
    enabled: boolean;
    hours: number;
  };
  studyReminders?: boolean;
  useSchoolSubjects?: boolean;
  studySession?: {
    enabled: boolean;
    duration: number;
  };
  dailyStudyGoal?: {
    enabled: boolean;
    hours: number;
  };
  studyReminders?: boolean;
  widgets: {
    upcomingTests: boolean;
    todayTomorrowEvents: boolean;
    foodPlan: boolean;
    quickTodo: boolean;
    quickNotes: boolean;
  };
  hydrationGoal: number;
}

export interface FoodPlan {
  [key: string]: string[]; // weekday key -> meals array
}

export interface AppState {
  notes: Note[];
  tests: Test[];
  tasks: Task[];
  books: Book[];
  meals: string[];
  foodPlan: FoodPlan;
  events: Event[];
  subjects: Subject[];
  settings: Settings;
}