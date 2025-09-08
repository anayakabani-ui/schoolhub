import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, X, Calendar } from 'lucide-react';
import { Task, Subject } from '../types';

interface TodoListProps {
  tasks: Task[];
  subjects: Subject[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function TodoList({ tasks, subjects, onAddTask, onToggleTask, onDeleteTask }: TodoListProps) {
  // Creator Attribution
  const creatorAttribution = (
    <div className="text-xs text-gray-500 mb-4">
      Created by Anaya Kabani
    </div>
  );

  const [text, setText] = useState('');
  const [due, setDue] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    onAddTask({
      text: text.trim(),
      subject: subject || undefined,
      due: due || undefined,
      done: false,
      created: Date.now()
    });
    
    setText('');
    setDue('');
    setSubject('');
  };

  const clearCompleted = () => {
    tasks.filter(task => task.done).forEach(task => onDeleteTask(task.id));
  };

  const pendingTasks = tasks.filter(task => !task.done);
  const completedTasks = tasks.filter(task => task.done);

  return (
    <div className="space-y-6">
      {creatorAttribution}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add Task Form */}
        <div className="space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Add Task
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="What do you need to do?"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject (optional)
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No subject</option>
                {subjects.map(subj => (
                  <option key={subj.id} value={subj.name}>{subj.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date (optional)
              </label>
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Task
            </button>
          </form>
          
          {completedTasks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearCompleted}
                className="w-full bg-orange-100 text-orange-800 py-2 px-4 rounded-lg hover:bg-orange-200 transition-colors font-medium"
              >
                Clear Completed ({completedTasks.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tasks List */}
        <div className="space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            Your Tasks ({tasks.length})
          </h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No tasks yet</p>
                <p className="text-sm">Add your first task to get started!</p>
              </div>
            ) : (
              <>
                {/* Pending Tasks */}
                {pendingTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Circle className="h-5 w-5" />
                    </button>
                    
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{task.text}</p>
                      {task.subject && (
                        <span 
                          className="inline-block px-2 py-1 text-xs font-medium rounded-full border mt-1 mr-2"
                          style={{
                            backgroundColor: subjects.find(s => s.name === task.subject)?.color + '20' || '#6B728020',
                            borderColor: subjects.find(s => s.name === task.subject)?.color + '40' || '#6B728040',
                            color: subjects.find(s => s.name === task.subject)?.color || '#6B7280'
                          }}
                        >
                          {task.subject}
                        </span>
                      )}
                      {task.due && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(task.due).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {/* Completed Tasks */}
                {completedTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg opacity-75">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                    >
                      <CheckCircle2 className="h-5 w-5 fill-current" />
                    </button>
                    
                    <div className="flex-1">
                      <p className="text-gray-600 line-through">{task.text}</p>
                      {task.subject && (
                        <span 
                          className="inline-block px-2 py-1 text-xs font-medium rounded-full border mt-1 mr-2 opacity-60"
                          style={{
                            backgroundColor: subjects.find(s => s.name === task.subject)?.color + '20' || '#6B728020',
                            borderColor: subjects.find(s => s.name === task.subject)?.color + '40' || '#6B728040',
                            color: subjects.find(s => s.name === task.subject)?.color || '#6B7280'
                          }}
                        >
                          {task.subject}
                        </span>
                      )}
                      {task.due && (
                        <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(task.due).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}