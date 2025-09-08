import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit2, Trash2, GraduationCap, User, MapPin } from 'lucide-react';
import { Subject } from '../types';

interface SubjectManagerProps {
  subjects: Subject[];
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onUpdateSubject: (id: string, updates: Partial<Subject>) => void;
  onDeleteSubject: (id: string) => void;
}

export default function SubjectManager({ subjects, onAddSubject, onUpdateSubject, onDeleteSubject }: SubjectManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    hasBook: false,
    teacher: '',
    room: ''
  });

  // Listen for add subject event from parent
  useEffect(() => {
    const handleAddSubject = () => {
      setShowForm(true);
    };

    document.addEventListener('addSubject', handleAddSubject);
    return () => document.removeEventListener('addSubject', handleAddSubject);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    const subjectData = {
      name: formData.name.trim(),
      color: formData.color,
      hasBook: formData.hasBook,
      teacher: formData.teacher.trim(),
      room: formData.room.trim(),
      customItems: []
    };

    if (editingId) {
      onUpdateSubject(editingId, subjectData);
      setEditingId(null);
    } else {
      onAddSubject(subjectData);
    }
    
    setFormData({
      name: '',
      color: '#3B82F6',
      hasBook: false,
      teacher: '',
      room: ''
    });
    setShowForm(false);
  };

  const handleEdit = (subject: Subject) => {
    setFormData({
      name: subject.name,
      color: subject.color,
      hasBook: subject.hasBook,
      teacher: subject.teacher || '',
      room: subject.room || ''
    });
    setEditingId(subject.id);
    setShowForm(true);
  };

  const handleBookToggle = (id: string, hasBook: boolean) => {
    onUpdateSubject(id, { hasBook });
  };

  const handleTeacherUpdate = (id: string, teacher: string) => {
    onUpdateSubject(id, { teacher });
  };

  const handleRoomUpdate = (id: string, room: string) => {
    onUpdateSubject(id, { room });
  };

  const handleColorUpdate = (id: string, color: string) => {
    onUpdateSubject(id, { color });
  };

  const handleNameUpdate = (id: string, name: string) => {
    onUpdateSubject(id, { name });
  };

  return (
    <div className="space-y-6">
      {/* Subjects Table */}
      <div className="space-y-3">
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No subjects added yet</p>
            <p className="text-sm">Add subjects to organize your studies</p>
          </div>
        ) : (
          subjects.map(subject => (
            <div key={subject.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                {/* Color Swatch */}
                <input
                  type="color"
                  value={subject.color}
                  onChange={(e) => handleColorUpdate(subject.id, e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  title="Change color"
                />
                
                {/* Subject Name */}
                <input
                  type="text"
                  value={subject.name}
                  onChange={(e) => handleNameUpdate(subject.id, e.target.value)}
                  className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 flex-1 min-w-0"
                />
                
                {/* Has Book Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 whitespace-nowrap">Has book?</span>
                  <input
                    type="checkbox"
                    checked={subject.hasBook}
                    onChange={(e) => handleBookToggle(subject.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                
                {/* Teacher Icon & Field */}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={subject.teacher || ''}
                    onChange={(e) => handleTeacherUpdate(subject.id, e.target.value)}
                    placeholder="Teacher"
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-24 bg-white"
                  />
                </div>
                
                {/* Location/Room Icon & Field */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={subject.room || ''}
                    onChange={(e) => handleRoomUpdate(subject.id, e.target.value)}
                    placeholder="Room"
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-20 bg-white"
                  />
                </div>
                
                {/* Delete Button */}
                <button
                  onClick={() => onDeleteSubject(subject.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subject Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Subject' : 'Add New Subject'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Mathematics, English Literature"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="hasBook"
                  checked={formData.hasBook}
                  onChange={(e) => setFormData({ ...formData, hasBook: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hasBook" className="text-sm font-medium text-gray-700">
                  Has book?
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 Teacher (optional)
                </label>
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Teacher's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚪 Room (optional)
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Room number/name"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update Subject' : 'Add Subject'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: '',
                    color: '#3B82F6',
                    hasBook: false,
                    teacher: '',
                    room: ''
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
    </div>
  );
}