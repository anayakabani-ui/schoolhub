import React, { useState } from 'react';
import { Calendar, Clock, BookOpen, Plus, CheckCircle2, Circle, AlertCircle, ChefHat, Droplets } from 'lucide-react';
import { Note, Test, Task, Event, FoodPlan, Subject, Settings } from '../types';
import { useHydrationTracker } from '../hooks/useHydrationTracker';
import { generateId, isSoon, getWeekDays, getPlanKey } from '../utils/dateUtils';
import HydrationPopup from './HydrationPopup';

interface HomeProps {
  notes: Note[];
  tests: Test[];
  tasks: Task[];
  events: Event[];
  foodPlan: FoodPlan;
  subjects: Subject[];
  settings: Settings;
  onAddNote: (note: Omit<Note, 'id'>) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onToggleTask: (id: string) => void;
}

export default function Home({
  notes, 
  tests, 
  tasks, 
  events, 
  foodPlan, 
  subjects, 
  settings,
  onAddNote, 
  onAddTask, 
  onToggleTask 
}: HomeProps) {
  const [quickNote, setQuickNote] = useState('');
  const [quickNoteSubject, setQuickNoteSubject] = useState('');
  const [quickTask, setQuickTask] = useState('');
  
  const {
    hydrationProgress,
    showGoalPopup,
    incrementHydration,
    decrementHydration,
    resetHydration,
    closeGoalPopup
  } = useHydrationTracker(settings.hydrationGoal);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Get upcoming tests (next 7 days)
  const upcomingTests = tests
    .filter(test => isSoon(test.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get today and tomorrow events
  const getTodayTomorrowEvents = () => {
    const todayWeekday = today.getDay();
    const tomorrowWeekday = tomorrow.getDay();
    
    return events.filter(event => {
      const isExactToday = event.date === todayStr;
      const isExactTomorrow = event.date === tomorrowStr;
      const isRepeatingToday = event.repeatWeekly && event.days.includes(todayWeekday);
      const isRepeatingTomorrow = event.repeatWeekly && event.days.includes(tomorrowWeekday);
      
      return isExactToday || isExactTomorrow || isRepeatingToday || isRepeatingTomorrow;
    });
  };

  // Get food plan for today and tomorrow
  const getTodayTomorrowMeals = () => {
    const todayKey = getPlanKey(today);
    const tomorrowKey = getPlanKey(tomorrow);
    
    return {
      today: foodPlan[todayKey] || [],
      tomorrow: foodPlan[tomorrowKey] || []
    };
  };

  const todayTomorrowEvents = getTodayTomorrowEvents();
  const meals = getTodayTomorrowMeals();
  const pendingTasks = tasks.filter(task => !task.done).slice(0, 5);

  const handleQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    
    onAddNote({
      subject: quickNoteSubject || 'General',
      text: quickNote.trim(),
      created: Date.now()
    });
    
    setQuickNote('');
    setQuickNoteSubject('');
  };

  const handleQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTask.trim()) return;
    
    onAddTask({
      text: quickTask.trim(),
      done: false,
      created: Date.now()
    });
    
    setQuickTask('');
  };

  return (
    <div className="space-y-6">
      {/* Hydration Goal Popup */}
      <HydrationPopup isVisible={showGoalPopup} onClose={closeGoalPopup} />
      
      {/* Creator Attribution */}
      <div className="text-xs text-gray-500 mb-4">
        Created by Anaya Kabani
      </div>

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome Back{settings.userName ? `, ${settings.userName}` : ''}!
        </h1>
        <p className="text-blue-100">Ready to tackle your studies today?</p>
        
        {/* Hydration Tracker */}
        <div className="mt-4 bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-200" />
              <span className="font-medium">Daily Hydration</span>
            </div>
            <span className="text-sm text-blue-200">
              {hydrationProgress}/{settings.hydrationGoal} glasses
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-white/80 transition-all duration-300 ease-out"
                style={{ width: `${(hydrationProgress / settings.hydrationGoal) * 100}%` }}
              />
            </div>
            <div className="flex gap-1">
              <button
                onClick={decrementHydration}
                className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold transition-colors"
              >
                −
              </button>
              <button
                onClick={incrementHydration}
                className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold transition-colors"
              >
                +
              </button>
              <button
                onClick={resetHydration}
                className="px-3 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm opacity-90">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          {/* Quick Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Quick Note
            </h2>
            
            <form onSubmit={handleQuickNote} className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={quickNoteSubject}
                  onChange={(e) => setQuickNoteSubject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">General</option>
                  {subjects.map(subj => (
                    <option key={subj.id} value={subj.name}>{subj.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Quick note..."
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick To-Do */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Quick Task
            </h2>
            
            <form onSubmit={handleQuickTask} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickTask}
                  onChange={(e) => setQuickTask(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="What needs to be done?"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Pending Tasks */}
            <div className="mt-4 space-y-2">
              {pendingTasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No pending tasks</p>
              ) : (
                pendingTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Circle className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-700 flex-1">{task.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Information Widgets */}
        <div className="space-y-4">
          {/* Upcoming Tests */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-600" />
              Upcoming Tests
            </h2>
            
            {upcomingTests.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming tests</p>
            ) : (
              <div className="space-y-3">
                {upcomingTests.map(test => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <div className="font-medium text-gray-900">{test.subject}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(test.date).toLocaleDateString()}
                        {test.time && ` • ${test.time}`}
                      </div>
                    </div>
                    {isSoon(test.date) && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Soon
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today & Tomorrow Events */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Today & Tomorrow
            </h2>
            
            {todayTomorrowEvents.length === 0 ? (
              <p className="text-gray-500 text-sm">No events scheduled</p>
            ) : (
              <div className="space-y-2">
                {todayTomorrowEvents.map(event => (
                  <div key={event.id} className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm font-medium text-gray-900">
                      {event.time && `${event.time} • `}{event.title}
                    </div>
                    <div className="text-xs text-gray-600">{event.type}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Food Plan */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-green-600" />
              Food Plan
            </h2>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Today</div>
                {meals.today.length === 0 ? (
                  <p className="text-gray-500 text-xs">No meals planned</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {meals.today.map((meal, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {meal}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Tomorrow</div>
                {meals.tomorrow.length === 0 ? (
                  <p className="text-gray-500 text-xs">No meals planned</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {meals.tomorrow.map((meal, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {meal}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}