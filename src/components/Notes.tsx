import React, { useState } from 'react';
import { Plus, Search, X, BookOpen } from 'lucide-react';
import { Note, Subject } from '../types';
import { generateId } from '../utils/dateUtils';

interface NotesProps {
  notes: Note[];
  subjects: Subject[];
  onAddNote: (note: Omit<Note, 'id'>) => void;
  onDeleteNote: (id: string) => void;
}

export default function Notes({ notes, subjects, onAddNote, onDeleteNote }: NotesProps) {
  // Creator Attribution
  const creatorAttribution = (
    <div className="text-xs text-gray-500 mb-4">
      Created by Anaya Kabani
    </div>
  );

  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !text.trim()) return;
    
    onAddNote({
      subject: subject.trim(),
      text: text.trim(),
      created: Date.now()
    });
    
    setSubject('');
    setText('');
  };

  const filteredNotes = notes.filter(note => 
    !filter || note.subject.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {creatorAttribution}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add Note Form */}
        <div className="space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Add Note
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
                  placeholder="e.g., Science, Math"
                  required
                />
              )}
              
              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {subjects.slice(0, 6).map(subj => (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => setSubject(subj.name)}
                      className="px-3 py-1 text-xs rounded-full border transition-colors"
                      style={{ 
                        backgroundColor: `${subj.color}20`, 
                        borderColor: `${subj.color}40`,
                        color: subj.color
                      }}
                    >
                      {subj.name}
                    </button>
                  ))}
                </div>
              )}
              
              {subjects.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Add subjects in Settings to get quick selection buttons
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Write your note here..."
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Note
            </button>
          </form>
        </div>
      </div>

      {/* Notes List */}
        <div className="space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Your Notes ({filteredNotes.length})
            </h2>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by subject..."
              />
            {filter && (
              <button
                onClick={() => setFilter('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>{filter ? 'No notes match your filter' : 'No notes yet'}</p>
                <p className="text-sm">Start by adding your first note!</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2 py-1 text-xs font-medium rounded-full border"
                        style={{
                          backgroundColor: subjects.find(s => s.name === note.subject)?.color + '20' || '#3B82F620',
                          borderColor: subjects.find(s => s.name === note.subject)?.color + '40' || '#3B82F640',
                          color: subjects.find(s => s.name === note.subject)?.color || '#3B82F6'
                        }}
                      >
                        {note.subject}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.created).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{note.text}</p>
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