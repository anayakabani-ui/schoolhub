import React, { useState } from 'react';
import { Plus, Calendar, Clock, AlertCircle, X } from 'lucide-react';
import { Test, Event, Subject } from '../types';
import { generateId, isSoon } from '../utils/dateUtils';

interface TestsProps {
  tests: Test[];
  subjects: Subject[];
  onAddTest: (test: Omit<Test, 'id'>) => void;
  onDeleteTest: (id: string) => void;
  onAddToCalendar: (event: Omit<Event, 'id'>) => void;
}

export default function Tests({ tests, subjects, onAddTest, onDeleteTest, onAddToCalendar }: TestsProps) {
  // Creator Attribution
  const creatorAttribution = (
    <div className="text-xs text-gray-500 mb-4">
      Created by Anaya Kabani
    </div>
  );

  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !date) return;
    
    onAddTest({
      subject: subject.trim(),
      date,
      time: time || undefined,
      details: details.trim()
    });
    
    setSubject('');
    setDate('');
    setTime('');
    setDetails('');
  };

  const handleAddToCalendar = (test: Test) => {
    onAddToCalendar({
      title: `Test: ${test.subject}`,
      type: 'Test',
      color: '#EF4444',
      date: test.date,
      time: test.time || '',
      repeatWeekly: false,
      days: []
    });
  };

  const sortedTests = [...tests].sort((a, b) => {
    const dateA = new Date(a.date + (a.time ? `T${a.time}` : 'T00:00'));
    const dateB = new Date(b.date + (b.time ? `T${b.time}` : 'T00:00'));
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      {creatorAttribution}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add Test Form */}
        <div className="space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Add Test or Important Date
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              {subjects.length > 0 ? (
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map(subj => (
                    <option key={subj.id} value={subj.name}>{subj.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Math, Science"
                  required
                />
              )}
              
              {subjects.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Add subjects in Settings for quick selection
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details or Topics
              </label>
              <textarea
                value={subject}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="What topics will be covered?"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details or Topics
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="What topics will be covered?"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Test
            </button>
          </form>
        </div>
      </div>

      {/* Tests List */}
        <div className="space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Upcoming Tests ({tests.length})
          </h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedTests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No tests scheduled</p>
                <p className="text-sm">Add your first test or important date!</p>
              </div>
            ) : (
              sortedTests.map(test => (
                <div key={test.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{test.subject}</h3>
                      {isSoon(test.date) && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Soon
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteTest(test.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(test.date).toLocaleDateString()}</span>
                    </div>
                    {test.time && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{test.time}</span>
                      </div>
                    )}
                  </div>
                  
                  {test.details && (
                    <p className="text-gray-700 text-sm mb-3">{test.details}</p>
                  )}
                  
                  <button
                    onClick={() => handleAddToCalendar(test)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    Add to Calendar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}