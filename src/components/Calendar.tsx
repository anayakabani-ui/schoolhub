import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download, X, Maximize, Minimize, Edit3, Trash2, Palette } from 'lucide-react';
import { Event, Test, Task, FoodPlan, Settings } from '../types';
import { getCalendarWeekDays, getPlanKey } from '../utils/dateUtils';

interface CalendarProps {
  events: Event[];
  tests: Test[];
  tasks: Task[];
  foodPlan: FoodPlan;
  settings: Settings;
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
  onExportData: () => void;
}

export default function Calendar({ events, tests, tasks, foodPlan, settings, onAddEvent, onDeleteEvent, onExportData }: CalendarProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Event['type']>('ECA');
  const [color, setColor] = useState('#3B82F6');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(() => {
    const saved = localStorage.getItem('calendar-fullscreen');
    return saved ? JSON.parse(saved) : false;
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showEventEditor, setShowEventEditor] = useState(false);

  // Always use 7-day week starting with Sunday
  const weekDays = getCalendarWeekDays(weekOffset);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Color presets
  const colorPresets = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
  ];

  // Save fullscreen state to localStorage
  useEffect(() => {
    localStorage.setItem('calendar-fullscreen', JSON.stringify(isFullscreen));
  }, [isFullscreen]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!date && !repeatWeekly) return;
    if (repeatWeekly && selectedDays.length === 0) return;
    
    onAddEvent({
      title: title.trim(),
      type,
      color,
      date: date || '',
      time: time || '',
      repeatWeekly,
      days: selectedDays
    });
    
    setTitle('');
    setDate('');
    setTime('');
    setRepeatWeekly(false);
    setSelectedDays([]);
    setColor('#3B82F6');
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventEditor(true);
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    // Delete the old event and add the updated one
    onDeleteEvent(editingEvent.id);
    onAddEvent({
      title: editingEvent.title,
      type: editingEvent.type,
      color: editingEvent.color || '#3B82F6',
      date: editingEvent.date,
      time: editingEvent.time || '',
      repeatWeekly: editingEvent.repeatWeekly,
      days: editingEvent.days
    });

    setEditingEvent(null);
    setShowEventEditor(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    onDeleteEvent(eventId);
    setEditingEvent(null);
    setShowEventEditor(false);
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const getEventsForDay = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    const weekday = day.getDay();
    
    const dayEvents = events.filter(event => {
      const isExactDate = event.date === dateStr;
      const isRepeating = event.repeatWeekly && event.days.includes(weekday);
      return isExactDate || isRepeating;
    });
    
    const dayTests = tests.filter(test => test.date === dateStr);
    const dayTasks = tasks.filter(task => task.due === dateStr && !task.done);
    
    return { events: dayEvents, tests: dayTests, tasks: dayTasks };
  };

  const getMealsForDay = (day: Date) => {
    const dayKey = getPlanKey(day);
    return foodPlan[dayKey] || [];
  };

  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'ECA': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Library': return 'bg-green-100 text-green-800 border-green-200';
      case 'Test': return 'bg-red-100 text-red-800 border-red-200';
      case 'Reminder': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatWeekTitle = () => {
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    return `${firstDay.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  };

  const CalendarContent = () => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className={`font-semibold flex items-center gap-2 ${isFullscreen ? 'text-2xl' : 'text-xl'}`}>
          <CalendarIcon className={`text-blue-600 ${isFullscreen ? 'h-7 w-7' : 'h-5 w-5'}`} />
          This Week
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className={`text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${isFullscreen ? 'p-3' : 'p-2'}`}
          >
            <ChevronLeft className={`${isFullscreen ? 'h-6 w-6' : 'h-4 w-4'}`} />
          </button>
          <span className={`font-medium text-gray-700 text-center ${isFullscreen ? 'text-lg min-w-[160px]' : 'text-sm min-w-[120px]'}`}>
            {formatWeekTitle()}
          </span>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className={`text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${isFullscreen ? 'p-3' : 'p-2'}`}
          >
            <ChevronRight className={`${isFullscreen ? 'h-6 w-6' : 'h-4 w-4'}`} />
          </button>
          <button
            onClick={toggleFullscreen}
            className={`ml-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${isFullscreen ? 'p-3' : 'p-2'}`}
            title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className={`${isFullscreen ? 'h-6 w-6' : 'h-4 w-4'}`} />
            ) : (
              <Maximize className={`${isFullscreen ? 'h-6 w-6' : 'h-4 w-4'}`} />
            )}
          </button>
        </div>
      </div>
      
      <div className={`grid grid-cols-7 gap-1 ${isFullscreen ? 'flex-1 p-4' : 'p-4'}`}>
        {weekDays.map((day, index) => {
          const { events: dayEvents, tests: dayTests, tasks: dayTasks } = getEventsForDay(day);
          const meals = getMealsForDay(day);
          const isToday = day.toDateString() === new Date().toDateString();
          const dayName = dayNames[index];
          
          return (
            <div key={`${day.toISOString()}-${index}`} className="space-y-2 flex flex-col">
              <div className="text-center">
                <div className={`font-semibold ${isToday ? 'text-blue-600' : 'text-gray-900'} ${isFullscreen ? 'text-lg' : ''}`}>
                  {dayName}
                </div>
                <div className={`${isToday ? 'text-blue-500' : 'text-gray-500'} ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                  {day.getDate()}/{day.getMonth() + 1}
                </div>
              </div>
              
              <div className={`${isFullscreen ? 'flex-1 min-h-0' : 'min-h-[200px]'} p-2 rounded-lg border ${isToday ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'} overflow-y-auto`}>
                <div className="space-y-1">
                  {/* Events */}
                  {dayEvents.map(event => (
                    <div key={event.id} className="group">
                      <div 
                        className={`${isFullscreen ? 'text-sm p-2' : 'text-xs p-1'} rounded border cursor-pointer hover:opacity-80 transition-opacity`}
                        style={{
                          backgroundColor: event.color ? `${event.color}20` : '#3B82F620',
                          borderColor: event.color ? `${event.color}60` : '#3B82F660',
                          color: event.color || '#3B82F6'
                        }}
                        onClick={() => handleEditEvent(event)}
                      >
                        <div className={`${isFullscreen ? 'leading-relaxed break-words' : 'break-words'} flex items-start justify-between`}>
                          <span className="flex-1 pr-1">
                            {event.time && `${event.time} • `}{event.title}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-1">
                            <Edit3 className={`${isFullscreen ? 'h-4 w-4' : 'h-3 w-3'} flex-shrink-0`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Tests */}
                  {dayTests.map(test => (
                    <div key={test.id} className={`${isFullscreen ? 'text-sm p-2' : 'text-xs p-1'} rounded border bg-red-100 text-red-800 border-red-200`}>
                      <span className={`${isFullscreen ? 'leading-relaxed break-words' : 'break-words'}`}>
                        {test.time && `${test.time} • `}Test: {test.subject}
                      </span>
                    </div>
                  ))}
                  
                  {/* Tasks */}
                  {dayTasks.map(task => (
                    <div key={task.id} className={`${isFullscreen ? 'text-sm p-2' : 'text-xs p-1'} rounded border bg-orange-100 text-orange-800 border-orange-200`}>
                      <span className={`${isFullscreen ? 'leading-relaxed break-words' : 'break-words'}`}>Due: {task.text}</span>
                    </div>
                  ))}
                  
                  {/* Meals */}
                  {meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className={`${isFullscreen ? 'text-sm p-2' : 'text-xs p-1'} rounded border bg-green-100 text-green-800 border-green-200`}>
                      <span className={`${isFullscreen ? 'leading-relaxed break-words' : 'break-words'}`}>🍽️ {meal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <p className={`text-gray-500 text-center border-t border-gray-200 pt-4 ${isFullscreen ? 'text-sm px-4 pb-4' : 'text-xs px-4 pb-4'}`}>
        All your events, tests, tasks, and meals in one view
      </p>
    </div>
  );

  // Event Editor Modal
  const EventEditor = () => {
    if (!showEventEditor || !editingEvent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Edit Event</h3>
            <button
              onClick={() => setShowEventEditor(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleUpdateEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editingEvent.title}
                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time (optional)
              </label>
              <input
                type="time"
                value={editingEvent.time || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="space-y-3">
                <input
                  type="color"
                  value={editingEvent.color || '#3B82F6'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map(presetColor => (
                    <button
                      key={presetColor}
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, color: presetColor })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        editingEvent.color === presetColor ? 'border-gray-400 scale-110' : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: presetColor }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Update Event
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEvent(editingEvent.id)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isFullscreen) {
    return (
      <>
        <div className="fixed inset-0 bg-gray-50 z-50 overflow-hidden">
          <div className="h-full flex flex-col p-4">
            <CalendarContent />
          </div>
        </div>
        <EventEditor />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-xs text-gray-500 mb-4">
        Created by Anaya Kabani
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Event Form */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Add Event
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Basketball ECA"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Event['type'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ECA">ECA</option>
                    <option value="Library">Library</option>
                    <option value="Reminder">Reminder</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time (optional)
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="space-y-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="grid grid-cols-5 gap-2">
                    {colorPresets.map(presetColor => (
                      <button
                        key={presetColor}
                        type="button"
                        onClick={() => setColor(presetColor)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          color === presetColor ? 'border-gray-400 scale-110' : 'border-gray-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: presetColor }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={repeatWeekly}
                    onChange={(e) => setRepeatWeekly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Repeat weekly</span>
                </label>
              </div>
              
              {!repeatWeekly && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={!repeatWeekly}
                  />
                </div>
              )}
              
              {repeatWeekly && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dayNamesShort.map((day, index) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          selectedDays.includes(index)
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add Event
              </button>
            </form>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={onExportData}
                className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export All Data
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="space-y-4">
          <CalendarContent />
        </div>
      </div>

      <EventEditor />
    </div>
  );
}