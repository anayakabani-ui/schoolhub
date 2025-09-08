import React, { useState } from 'react';
import { Plus, Calendar, Clock, AlertCircle, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { Assignment, Subject } from '../types';

interface AssignmentTrackerProps {
  assignments: Assignment[];
  subjects: Subject[];
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onEditAssignment: (id: string, assignment: Omit<Assignment, 'id'>) => void;
  onDeleteAssignment: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export default function AssignmentTracker({
  assignments,
  subjects,
  onAddAssignment,
  onEditAssignment,
  onDeleteAssignment,
  onToggleComplete
}: AssignmentTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    type: 'Homework' as 'Homework' | 'Essay' | 'Project' | 'Exam' | 'Presentation',
    completed: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onEditAssignment(editingId, formData);
      setEditingId(null);
    } else {
      onAddAssignment(formData);
    }
    setFormData({
      title: '',
      subject: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      type: 'Homework',
      completed: false
    });
    setShowForm(false);
  };

  const handleEdit = (assignment: Assignment) => {
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description,
      dueDate: assignment.dueDate,
      priority: assignment.priority,
      type: assignment.type,
      completed: assignment.completed
    });
    setEditingId(assignment.id);
    setShowForm(true);
  };

  const getFilteredAssignments = () => {
    const now = new Date();
    
    switch (filter) {
      case 'pending':
        return assignments.filter(a => !a.completed);
      case 'completed':
        return assignments.filter(a => a.completed);
      case 'overdue':
        return assignments.filter(a => !a.completed && new Date(a.dueDate) < now);
      default:
        return assignments;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredAssignments = getFilteredAssignments().sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Assignment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All', count: assignments.length },
          { key: 'pending', label: 'Pending', count: assignments.filter(a => !a.completed).length },
          { key: 'completed', label: 'Completed', count: assignments.filter(a => a.completed).length },
          { key: 'overdue', label: 'Overdue', count: assignments.filter(a => !a.completed && new Date(a.dueDate) < new Date()).length }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Assignment Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Assignment' : 'Add New Assignment'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Assignment title"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {['Homework', 'Essay', 'Project', 'Exam', 'Presentation'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {['Low', 'Medium', 'High'].map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Assignment details..."
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update Assignment' : 'Add Assignment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    title: '',
                    subject: '',
                    description: '',
                    dueDate: '',
                    priority: 'Medium',
                    type: 'Homework',
                    completed: false
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

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map(assignment => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);
          const isOverdue = daysUntilDue < 0 && !assignment.completed;
          const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && !assignment.completed;
          
          return (
            <div
              key={assignment.id}
              className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${
                assignment.completed 
                  ? 'border-green-200 bg-green-50/30' 
                  : isOverdue 
                  ? 'border-red-200 bg-red-50/30'
                  : isDueSoon
                  ? 'border-orange-200 bg-orange-50/30'
                  : 'border-gray-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => onToggleComplete(assignment.id)}
                    className={`mt-1 transition-colors ${
                      assignment.completed 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-gray-400 hover:text-blue-600'
                    }`}
                  >
                    <CheckCircle2 className={`h-5 w-5 ${assignment.completed ? 'fill-current' : ''}`} />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        assignment.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {assignment.title}
                      </h3>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
                      </span>
                      
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                        {assignment.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="font-medium">{assignment.subject}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      
                      {!assignment.completed && (
                        <div className={`flex items-center gap-1 ${
                          isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                          {isOverdue ? (
                            <>
                              <AlertCircle className="h-4 w-4" />
                              <span>{Math.abs(daysUntilDue)} days overdue</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4" />
                              <span>
                                {daysUntilDue === 0 ? 'Due today' : 
                                 daysUntilDue === 1 ? 'Due tomorrow' : 
                                 `${daysUntilDue} days left`}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {assignment.description && (
                      <p className="text-gray-600 text-sm">{assignment.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(assignment)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAssignment(assignment.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No assignments yet' : `No ${filter} assignments`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Add your first assignment to start tracking your work.'
              : `Try switching to a different filter or add some assignments.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Assignment
            </button>
          )}
        </div>
      )}
    </div>
  );
}