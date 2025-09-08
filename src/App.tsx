import React, { useState } from 'react';
import { GraduationCap, BookOpen, Calendar as CalendarIcon, CheckSquare, MapPin, ChefHat, CalendarDays, Settings as SettingsIcon, Droplets, Heart } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHydrationTracker } from './hooks/useHydrationTracker';
import { generateId } from './utils/dateUtils';
import { AppState, Note, Test, Task, Book, Event, Subject, CustomItem, Settings as SettingsType } from './types';
import Home from './components/Home';
import Notes from './components/Notes';
import Tests from './components/Tests';
import TodoList from './components/TodoList';
import BookTracker from './components/BookTracker';
import FoodPlanner from './components/FoodPlanner';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import HydrationPopup from './components/HydrationPopup';

const initialState: AppState = {
  notes: [],
  tests: [],
  tasks: [],
  books: [],
  meals: [],
  foodPlan: {},
  events: [],
  subjects: [],
  settings: {
    weekLayout: 'mon-fri',
    showHeader: true,
    userName: '',
    curriculum: '',
    school: '',
    yearGroup: '',
    mflLanguage: '',
    widgets: {
      upcomingTests: true,
      todayTomorrowEvents: true,
      foodPlan: true,
      quickTodo: true,
      quickNotes: true
    },
    hydrationGoal: 8
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [state, setState] = useLocalStorage<AppState>('school-hub-data', initialState);
  
  const {
    hydrationProgress,
    showGoalPopup,
    incrementHydration,
    decrementHydration,
    resetHydration,
    closeGoalPopup
  } = useHydrationTracker(state.settings.hydrationGoal);

  const tabs = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'tests', label: 'Tests', icon: CalendarIcon },
    { id: 'todos', label: 'To-Do', icon: CheckSquare },
    { id: 'books', label: 'Books', icon: MapPin },
    { id: 'food', label: 'Food Plan', icon: ChefHat },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  // Note handlers
  const handleAddNote = (noteData: Omit<Note, 'id'>) => {
    const newNote: Note = { ...noteData, id: generateId() };
    setState(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
  };

  const handleDeleteNote = (id: string) => {
    setState(prev => ({ ...prev, notes: prev.notes.filter(note => note.id !== id) }));
  };

  // Test handlers
  const handleAddTest = (testData: Omit<Test, 'id'>) => {
    const newTest: Test = { ...testData, id: generateId() };
    setState(prev => ({ ...prev, tests: [...prev.tests, newTest] }));
  };

  const handleDeleteTest = (id: string) => {
    setState(prev => ({ ...prev, tests: prev.tests.filter(test => test.id !== id) }));
  };

  // Task handlers
  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...taskData, id: generateId() };
    setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const handleToggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    }));
  };

  const handleDeleteTask = (id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(task => task.id !== id) }));
  };

  // Book handlers
  const handleAddBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = { ...bookData, id: generateId() };
    setState(prev => ({ ...prev, books: [newBook, ...prev.books] }));
  };

  const handleUpdateBook = (id: string, updates: Partial<Book>) => {
    setState(prev => ({
      ...prev,
      books: prev.books.map(book =>
        book.id === id ? { ...book, ...updates } : book
      )
    }));
  };

  const handleDeleteBook = (id: string) => {
    setState(prev => ({ ...prev, books: prev.books.filter(book => book.id !== id) }));
  };

  // Meal handlers
  const handleAddMeal = (meal: string) => {
    setState(prev => ({ ...prev, meals: [...prev.meals, meal] }));
  };

  const handleDeleteMeal = (meal: string) => {
    setState(prev => ({ ...prev, meals: prev.meals.filter(m => m !== meal) }));
  };

  const handleUpdateFoodPlan = (foodPlan: AppState['foodPlan']) => {
    setState(prev => ({ ...prev, foodPlan }));
  };

  // Event handlers
  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = { ...eventData, id: generateId() };
    setState(prev => ({ ...prev, events: [...prev.events, newEvent] }));
  };

  const handleDeleteEvent = (id: string) => {
    setState(prev => ({ ...prev, events: prev.events.filter(event => event.id !== id) }));
  };

  // Subject handlers
  const handleAddSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = { ...subjectData, id: generateId() };
    setState(prev => ({ ...prev, subjects: [...prev.subjects, newSubject] }));
  };

  const handleBatchAddSubjects = (subjectsData: Omit<Subject, 'id'>[]) => {
    const newSubjects: Subject[] = subjectsData.map(subjectData => ({
      ...subjectData,
      id: generateId()
    }));
    setState(prev => ({ ...prev, subjects: [...prev.subjects, ...newSubjects] }));
  };
  const handleUpdateSubject = (id: string, updates: Partial<Subject>) => {
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.map(subject =>
        subject.id === id ? { ...subject, ...updates } : subject
      )
    }));
  };

  const handleDeleteSubject = (id: string) => {
    setState(prev => ({ ...prev, subjects: prev.subjects.filter(subject => subject.id !== id) }));
  };

  // Settings handlers
  const handleUpdateSettings = (settings: SettingsType) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
  };

  // Hydration handlers
  const handleHydrationIncrement = incrementHydration;
  const handleHydrationDecrement = decrementHydration;
  const handleHydrationReset = resetHydration;

  // Export data handler
  const handleExportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'school-hub-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            notes={state.notes}
            tests={state.tests}
            tasks={state.tasks}
            events={state.events}
            foodPlan={state.foodPlan}
            subjects={state.subjects}
            settings={state.settings}
            onAddNote={handleAddNote}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
          />
        );
      case 'notes':
        return (
          <Notes
            notes={state.notes}
            subjects={state.subjects}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        );
      case 'tests':
        return (
          <Tests
            tests={state.tests}
            subjects={state.subjects}
            onAddTest={handleAddTest}
            onDeleteTest={handleDeleteTest}
            onAddToCalendar={handleAddEvent}
          />
        );
      case 'todos':
        return (
          <TodoList
            tasks={state.tasks}
            subjects={state.subjects}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'books':
        return (
          <BookTracker
            books={state.books}
            subjects={state.subjects}
            settings={state.settings}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
          />
        );
      case 'food':
        return (
          <FoodPlanner
            meals={state.meals}
            foodPlan={state.foodPlan}
            settings={state.settings}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onUpdateFoodPlan={handleUpdateFoodPlan}
          />
        );
      case 'calendar':
        return (
          <Calendar
            events={state.events}
            tests={state.tests}
            tasks={state.tasks}
            foodPlan={state.foodPlan}
            settings={state.settings}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onExportData={handleExportData}
          />
        );
      case 'settings':
        return (
          <Settings
            subjects={state.subjects}
            settings={state.settings}
            onAddSubject={handleAddSubject}
            onBatchAddSubjects={handleBatchAddSubjects}
            onUpdateSubject={handleUpdateSubject}
            onDeleteSubject={handleDeleteSubject}
            onUpdateSettings={handleUpdateSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hydration Goal Popup */}
      <HydrationPopup isVisible={showGoalPopup} onClose={closeGoalPopup} />
      
      {/* Header */}
      {state.settings.showHeader && (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">School Hub</h1>
                  <p className="text-xs text-gray-500">organize faster • stress less</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Wellbeing Button - Only visible for BSM */}
                {state.settings.school === 'British School Muscat (BSM)' && (
                  <button
                    onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdh7a5a7A2bTFpvBr7e1d2QIDH_GOYC1DSoyK9CFiR6QHLX7Q/viewform', '_blank')}
                    className="flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-2 rounded-lg border border-pink-200 hover:bg-pink-200 transition-colors text-sm font-medium"
                  >
                    <Heart className="h-4 w-4" />
                    Wellbeing
                  </button>
                )}
                
                {/* Global Hydration Tracker */}
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleHydrationDecrement}
                      className="w-5 h-5 flex items-center justify-center text-blue-600 hover:bg-blue-100 rounded text-xs font-bold transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-blue-700 min-w-[40px] text-center">
                      {hydrationProgress}/{state.settings.hydrationGoal}
                    </span>
                    <button
                      onClick={handleHydrationIncrement}
                      className="w-5 h-5 flex items-center justify-center text-blue-600 hover:bg-blue-100 rounded text-xs font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Navigation */}
      <nav className={`bg-white border-b border-gray-200 sticky ${state.settings.showHeader ? 'top-16' : 'top-0'} z-9 overflow-x-auto`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-3">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;