import React, { useState } from 'react';
import { ChefHat, Plus, Trash2, Calendar } from 'lucide-react';
import { Settings } from '../types';
import { getWeekDays } from '../utils/dateUtils';

interface FoodPlannerProps {
  meals: string[];
  foodPlan: Record<string, string[]>;
  settings: Settings;
  onAddMeal: (meal: string) => void;
  onDeleteMeal: (index: number) => void;
  onUpdateFoodPlan: (key: string, meals: string[]) => void;
}

export default function FoodPlanner({
  meals,
  foodPlan,
  settings,
  onAddMeal,
  onDeleteMeal,
  onUpdateFoodPlan
}: FoodPlannerProps) {
  const [newMeal, setNewMeal] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [draggedMeal, setDraggedMeal] = useState<string | null>(null);

  const weekDays = getWeekDays(weekOffset, settings.weekLayout);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeal.trim()) return;
    onAddMeal(newMeal.trim());
    setNewMeal('');
  };

  const seedMeals = () => {
    const defaultMeals = [
      'Pasta salad',
      'Chicken wrap',
      'Hummus + veg',
      'Leftover curry',
      'Tuna sandwich',
      'Egg fried rice',
      'Caesar salad',
      'Soup + bread'
    ];
    
    defaultMeals.forEach(meal => {
      if (!meals.includes(meal)) {
        onAddMeal(meal);
      }
    });
  };

  const getWeekKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDragStart = (meal: string) => {
    setDraggedMeal(meal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    if (!draggedMeal) return;
    
    const key = getWeekKey(date);
    const currentMeals = foodPlan[key] || [];
    onUpdateFoodPlan(key, [...currentMeals, draggedMeal]);
    setDraggedMeal(null);
  };

  const removeMealFromDay = (date: Date, mealToRemove: string) => {
    const key = getWeekKey(date);
    const currentMeals = foodPlan[key] || [];
    onUpdateFoodPlan(key, currentMeals.filter(meal => meal !== mealToRemove));
  };

  const clearWeek = () => {
    if (!confirm('Clear all meals for this week?')) return;
    weekDays.forEach(date => {
      const key = getWeekKey(date);
      onUpdateFoodPlan(key, []);
    });
  };

  const formatWeekTitle = () => {
    const firstDay = weekDays[0];
    const lastDay = weekDays[weekDays.length - 1];
    return `${firstDay.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="space-y-6">
      {/* Creator Attribution */}
      <div className="text-xs text-gray-500 mb-4">
        Created by Anaya Kabani
      </div>

      <div className="flex items-center gap-3 mb-6">
        <ChefHat className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900">Food Plan</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Options */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Meal Options</h2>
          
          <form onSubmit={handleAddMeal} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMeal}
                onChange={(e) => setNewMeal(e.target.value)}
                placeholder="e.g., Chicken wrap"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
          </form>

          <button
            onClick={seedMeals}
            className="mb-4 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
          >
            Add Example Meals
          </button>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {meals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No meals added yet</p>
            ) : (
              meals.map((meal, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(meal)}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg cursor-grab hover:bg-green-100 transition-colors"
                >
                  <span className="font-medium text-gray-900">{meal}</span>
                  <button
                    onClick={() => onDeleteMeal(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Drag any meal into a day cell to plan your week
          </p>
        </div>

        {/* Weekly Planner */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Weekly Lunch Planner</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset(weekOffset - 1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
                {formatWeekTitle()}
              </span>
              <button
                onClick={() => setWeekOffset(weekOffset + 1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                →
              </button>
              <button
                onClick={clearWeek}
                className="ml-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear Week
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {weekDays.map((date, index) => {
              const key = getWeekKey(date);
              const dayMeals = foodPlan[key] || [];
              const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
              const dayDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

              return (
                <div
                  key={index}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, date)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[80px] hover:border-green-400 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-gray-900">{dayName}</span>
                      <span className="text-sm text-gray-500 ml-2">{dayDate}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {dayMeals.length === 0 ? (
                      <p className="text-gray-400 text-sm">Drop meals here</p>
                    ) : (
                      dayMeals.map((meal, mealIndex) => (
                        <div
                          key={mealIndex}
                          className="flex items-center justify-between bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                        >
                          <span>{meal}</span>
                          <button
                            onClick={() => removeMealFromDay(date, meal)}
                            className="text-green-600 hover:text-green-800 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}