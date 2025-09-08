// src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Clock, TrendingUp, Plus, Bell, Droplet, Moon } from 'lucide-react';
import { Subject, Assignment } from '../types';

interface DashboardProps {
  subjects: Subject[];
  assignments: Assignment[];
  onViewAssignments: () => void;
  onViewTimetable: () => void;
}

// Placeholder for now, replace with your actual API call
const fetchUserPreferences = async () => {
  return {
    showSchoolHub: true,
    waterIntakeCups: 4,
    lastSleepEntry: { totalHours: 7.5, notes: "Good sleep" }
  };
};

export default function Dashboard({ subjects, assignments, onViewAssignments, onViewTimetable }: DashboardProps) {
  const [showSchoolHub, setShowSchoolHub] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [lastSleepEntry, setLastSleepEntry] = useState(null);
  
  const upcomingAssignments = assignments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const completionRate = assignments.length > 0
    ? Math.round((assignments.filter(a => a.completed).length / assignments.length) * 100)
    : 0;

  const todayAssignments = assignments.filter(a => {
    const today = new Date().toDateString();
    const dueDate = new Date(a.dueDate).toDateString();
    return dueDate === today && !a.completed;
  });

  const handleWaterIncrement = () => {
    // TODO: Implement the actual PATCH request here
    const newCount = waterIntake + 1;
    setWaterIntake(newCount);
  };
  
  useEffect(() => {
    const loadPreferences = async () => {
      const preferences = await fetchUserPreferences();
      setShowSchoolHub(preferences.showSchoolHub);
      setWaterIntake(preferences.waterIntakeCups);
      setLastSleepEntry(preferences.lastSleepEntry);
    };
    loadPreferences();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header (with our logic) */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {showSchoolHub ? 'School Hub' : 'Welcome Back!'}
        </h1>
        <p className="text-blue-100">
          {showSchoolHub ? 'organize faster - stress less' : 'Ready to tackle your studies today?'}
        </p>
        
        {todayAssignments.length > 0 && (
          <div className="mt-4 bg-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4" />
              <span className="font-medium">Due Today</span>
            </div>
            <div className="space-y-1">
              {todayAssignments.map(assignment => (
                <div key={assignment.id} className="text-sm">
                  {assignment.title} - {assignment.subject}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Our Custom Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water Tracker Widget */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Hydration</p>
            <div className="flex items-center gap-2">
              <Droplet className="h-8 w-8 text-blue-500" />
              <p className="text-2xl font-bold text-gray-900">{waterIntake}</p>
            </div>
          </div>
          <button onClick={handleWaterIncrement} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
            <Plus size={24} />
          </button>
        </div>
        
        {/* Sleep Diary Widget */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Last Night's Sleep</p>
            {lastSleepEntry ? (
              <div className="flex items-center gap-2">
                <Moon className="h-8 w-8 text-purple-500" />
                <p className="text-2xl font-bold text-gray-900">{lastSleepEntry.totalHours} hrs</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Log your first entry!</p>
            )}
          </div>
          {/* TODO: Add button to open sleep modal */}
        </div>
      </div>
      
      {/* Existing Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Due This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => {
                  const oneWeek = new Date();
                  oneWeek.setDate(oneWeek.getDate() + 7);
                  return new Date(a.dueDate) <= oneWeek && !a.completed;
                }).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Existing Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Assignments</h2>
            <button
              onClick={onViewAssignments}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          
          {upcomingAssignments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAssignments.map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-600">{assignment.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">{assignment.priority} priority</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming assignments</p>
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
            <button
              onClick={onViewTimetable}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              View Timetable
            </button>
          </div>
          
          <div className="space-y-3">
            {['Mathematics', 'English Literature', 'Chemistry', 'History'].map((subject, index) => (
              <div key={subject} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-blue-500' : 
                  index === 1 ? 'bg-green-500' : 
                  index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{subject}</p>
                  <p className="text-sm text-gray-600">
                    {9 + index}:00 - {10 + index}:00
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}