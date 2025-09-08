import React from 'react';
import { Droplets, X } from 'lucide-react';

interface HydrationPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function HydrationPopup({ isVisible, onClose }: HydrationPopupProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-blue-200 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Content */}
        <div className="text-center pt-2">
          <div className="mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Droplets className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              AWESOME WORK!
            </h2>
            <p className="text-lg text-gray-700 flex items-center justify-center gap-2">
              Stay hydrated 
              <span className="text-2xl">💧</span>
            </p>
            <p className="text-lg font-semibold text-blue-600 mt-2">
              Keep it up!
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}