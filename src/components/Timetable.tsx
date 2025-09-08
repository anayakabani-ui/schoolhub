import React, { useState } from 'react';
import { Clock, Plus, Edit2, Trash2 } from 'lucide-react';
import { TimetableEntry, Subject } from '../types';

interface TimetableProps {
  timetable: TimetableEntry[];
  subjects: Subject[];
  onAddEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  onEditEntry: (id: string, entry: Omit<TimetableEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
}

export default function Timetable({ 
  timetable, 
  subjects, 
  onAddEntry, 
  onEditEntry, 
  onDeleteEntry 
}: TimetableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day: 'Monday',
    subject: '',
    startTime: '',
    endTime: '',
    room: '',
    teacher: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSubject = subjects.find(s => s.name === formData.subject);
    
    const entry = {
      ...formData,
      teacher: formData.teacher || selectedSubject?.teacher || ''
    };

    if (editingId) {
      onEditEntry(editingId, entry);
      setEditingId(null);
    } else {
      onAddEntry(entry);
    }
    
    setFormData({
      day: 'Monday',
      subject: '',
      startTime: '',
      endTime: '',
      room: '',
      teacher: ''
    });
    setShowForm(false);
  };

  const handleEdit = (entry: TimetableEntry) => {
    setFormData({
      day: entry.day,
      subject: entry.subject,
      startTime: entry.startTime,
      endTime: entry.endTime,
      room: entry.room,
      teacher: entry.teacher
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const getEntriesForDay = (day: string) => {
    return timetable
      .filter(entry => entry.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getSubjectColor = (subjectName: string) => {
    const subject = subjects.find(s => s.name === subjectName);
    return subject?.color || '#6B7280';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Class
        </button>
      </div>

      {/* Timetable Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Class' : 'Add New Class'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day
                </label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => {
                    const selectedSubject = subjects.find(s => s.name === e.target.value);
                    setFormData({ 
                      ...formData, 
                      subject: e.target.value,
                      teacher: selectedSubject?.teacher || formData.teacher
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <select
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <select
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Room 101, Lab A"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher
                </label>
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Teacher's name"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update Class' : 'Add Class'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    day: 'Monday',
                    subject: '',
                    startTime: '',
                    endTime: '',
                    room: '',
                    teacher: ''
                  });
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          {days.map(day => (
            <div key={day} className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {day}
              </h3>
              
              <div className="space-y-2 min-h-[400px]">
                {getEntriesForDay(day).map(entry => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-lg border-l-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
                    style={{ borderLeftColor: getSubjectColor(entry.subject) }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {entry.subject}
                      </h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{entry.startTime} - {entry.endTime}</span>
                      </div>
                      
                      {entry.room && (
                        <div className="text-xs text-gray-600">
                          📍 {entry.room}
                        </div>
                      )}
                      
                      {entry.teacher && (
                        <div className="text-xs text-gray-600">
                          👩‍🏫 {entry.teacher}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {timetable.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes scheduled</h3>
          <p className="text-gray-600 mb-6">Add your first class to create your weekly timetable.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Class
          </button>
        </div>
      )}
    </div>
  );
}