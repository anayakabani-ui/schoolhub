import React, { useState } from 'react';
import { Settings as SettingsIcon, Plus, Trash2, User, School, BookOpen, Palette, Eye, EyeOff, Droplets, X } from 'lucide-react';
import { Subject, Settings as SettingsType } from '../types';
import SubjectManager from './SubjectManager';

interface SettingsProps {
  subjects: Subject[];
  settings: SettingsType;
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onBatchAddSubjects: (subjects: Omit<Subject, 'id'>[]) => void;
  onUpdateSubject: (id: string, updates: Partial<Subject>) => void;
  onDeleteSubject: (id: string) => void;
  onUpdateSettings: (settings: SettingsType) => void;
}

const YEAR_GROUPS = ['Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'];

const MFL_OPTIONS = {
  'Year 5': ['French', 'Spanish', 'Arabic'],
  'Year 6': ['French', 'Spanish', 'Arabic'],
  'Year 7': ['French', 'Spanish', 'Arabic'],
  'Year 8': ['French', 'Spanish', 'Arabic'],
  'Year 9': ['French', 'Spanish', 'Arabic'],
  'Year 10': ['French', 'Spanish', 'Arabic'],
  'Year 11': ['French', 'Spanish', 'Arabic']
};

const MFL_COLORS = {
  'French': '#6bcfd5',
  'Spanish': '#d5806b',
  'Arabic': '#9c5b27'
};

const YEAR_SUBJECTS = {
  'Year 5': [
    { name: 'English', color: '#6bcfd5', hasBook: true },
    { name: 'Maths', color: '#d5806b', hasBook: true },
    { name: 'Science', color: '#9c5b27', hasBook: true },
    { name: 'Humanities', color: '#cf6bd5', hasBook: true },
    { name: 'Art', color: '#27a69c', hasBook: false },
    { name: 'Music', color: '#b58f3c', hasBook: false },
    { name: 'PE', color: '#8c3c3c', hasBook: false },
    { name: 'Library', color: '#a65d27', hasBook: false },
    { name: 'Spelling/Reading', color: '#d59c6b', hasBook: true },
    { name: 'Computing', color: '#6bd59c', hasBook: true }
  ],
  'Year 6': [
    { name: 'English', color: '#6bcfd5', hasBook: true },
    { name: 'Swimming', color: '#4b87d1', hasBook: false },
    { name: 'Humanities', color: '#cf6bd5', hasBook: true },
    { name: 'Maths', color: '#d5806b', hasBook: true },
    { name: 'PE', color: '#27a69c', hasBook: false },
    { name: 'Music Instrumental', color: '#b58f3c', hasBook: false },
    { name: 'Spelling/Reading', color: '#8c3c3c', hasBook: true },
    { name: 'Science', color: '#9c5b27', hasBook: true },
    { name: 'PSHE', color: '#6b9cd5', hasBook: false },
    { name: 'Library', color: '#a65d27', hasBook: false },
    { name: 'Music', color: '#d59c6b', hasBook: false },
    { name: 'Computing', color: '#6bd59c', hasBook: true },
    { name: 'Art', color: '#cf6b6b', hasBook: false },
    { name: 'Design & Technology', color: '#806bd5', hasBook: false }
  ],
  'Year 7': [
    { name: 'English', color: '#6bcfd5', hasBook: true },
    { name: 'Maths', color: '#d5806b', hasBook: true },
    { name: 'Science', color: '#9c5b27', hasBook: true },
    { name: 'History', color: '#cf6bd5', hasBook: true },
    { name: 'Geography', color: '#27a69c', hasBook: true },
    { name: 'Art', color: '#b58f3c', hasBook: false },
    { name: 'Music', color: '#8c3c3c', hasBook: false },
    { name: 'Drama', color: '#6b9cd5', hasBook: false },
    { name: 'PE', color: '#a65d27', hasBook: false },
    { name: 'Computing', color: '#d59c6b', hasBook: true },
    { name: 'Design & Technology', color: '#6bd59c', hasBook: false },
    { name: 'PSHE', color: '#cf6b6b', hasBook: false }
  ],
  'Year 8': [
    { name: 'English', color: '#6bcfd5', hasBook: true },
    { name: 'Maths', color: '#d5806b', hasBook: true },
    { name: 'Science', color: '#9c5b27', hasBook: true },
    { name: 'History', color: '#cf6bd5', hasBook: true },
    { name: 'Geography', color: '#27a69c', hasBook: true },
    { name: 'Art', color: '#b58f3c', hasBook: false },
    { name: 'Music', color: '#8c3c3c', hasBook: false },
    { name: 'Drama', color: '#6b9cd5', hasBook: false },
    { name: 'PE', color: '#a65d27', hasBook: false },
    { name: 'Computing', color: '#d59c6b', hasBook: true },
    { name: 'Design & Technology', color: '#6bd59c', hasBook: false },
    { name: 'PSHE', color: '#cf6b6b', hasBook: false }
  ],
  'Year 9': [
    { name: 'English', color: '#75d66b', hasBook: true },
    { name: 'Math', color: '#6b9cd6', hasBook: true },
    { name: 'Science', color: '#e36a6a', hasBook: true },
    { name: 'Design & Technology', color: '#b85151', hasBook: false },
    { name: 'Art', color: '#6b7fd6', hasBook: false },
    { name: 'Computing', color: '#b8b4b0', hasBook: true },
    { name: 'Geography', color: '#c26bd6', hasBook: true },
    { name: 'History', color: '#d59b6b', hasBook: true },
    { name: 'PE', color: '#e5ca4b', hasBook: false },
    { name: 'Library', color: '#a1d4e0', hasBook: false },
    { name: 'Drama', color: '#e59ac3', hasBook: false },
    { name: 'Music', color: '#d36bd6', hasBook: false }
  ],
  'Year 10': [
    { name: 'English Language', color: '#6bcfd5', hasBook: true },
    { name: 'English Literature', color: '#4b87d1', hasBook: true },
    { name: 'Mathematics', color: '#d5806b', hasBook: true }
  ],
  'Year 11': [
    { name: 'English Language', color: '#6bcfd5', hasBook: true },
    { name: 'English Literature', color: '#4b87d1', hasBook: true },
    { name: 'Mathematics', color: '#d5806b', hasBook: true }
  ]
};

const GCSE_OPTIONS = {
  science: [
    { name: 'Combined Science', color: '#9c5b27', hasBook: true },
    { name: 'Triple Science', color: '#9c5b27', hasBook: true }
  ],
  humanities: [
    { name: 'History', color: '#cf6bd5', hasBook: true },
    { name: 'Geography', color: '#27a69c', hasBook: true }
  ],
  arts: [
    { name: 'Art', color: '#b58f3c', hasBook: false },
    { name: 'Drama', color: '#8c3c3c', hasBook: false },
    { name: 'Music', color: '#6b9cd5', hasBook: false },
    { name: 'Design & Technology', color: '#a65d27', hasBook: false }
  ],
  additional: [
    { name: 'Computer Science', color: '#d59c6b', hasBook: true },
    { name: 'Business', color: '#6bd59c', hasBook: true },
    { name: 'Economics', color: '#cf6b6b', hasBook: true },
    { name: 'PE', color: '#806bd5', hasBook: false },
    { name: 'RE', color: '#d5806b', hasBook: true }
  ]
};

export default function Settings({
  subjects,
  settings,
  onAddSubject,
  onBatchAddSubjects,
  onUpdateSubject,
  onDeleteSubject,
  onUpdateSettings
}: SettingsProps) {
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showMflPopup, setShowMflPopup] = useState(false);
  const [showGcsePopup, setShowGcsePopup] = useState(false);
  const [gcseStep, setGcseStep] = useState(1);
  const [selectedMfls, setSelectedMfls] = useState<string[]>([]);
  const [gcseSelections, setGcseSelections] = useState({
    science: '',
    humanities: '',
    mfl: '',
    arts: [] as string[],
    additional: [] as string[]
  });

  const handleSettingChange = (key: keyof SettingsType, value: any) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleWidgetToggle = (widget: keyof SettingsType['widgets']) => {
    onUpdateSettings({
      ...settings,
      widgets: {
        ...settings.widgets,
        [widget]: !settings.widgets[widget]
      }
    });
  };

  const handleUseSchoolSubjects = () => {
    if (!settings.yearGroup) {
      alert('Please select a year group first');
      return;
    }

    const yearSubjects = YEAR_SUBJECTS[settings.yearGroup as keyof typeof YEAR_SUBJECTS];
    if (!yearSubjects) return;

    // Handle Year 5 (1 MFL)
    if (settings.yearGroup === 'Year 5') {
      setSelectedMfls([]);
      setShowMflPopup(true);
      return;
    }

    // Handle Year 6 (2 MFLs)
    if (settings.yearGroup === 'Year 6') {
      setSelectedMfls([]);
      setShowMflPopup(true);
      return;
    }

    // Handle Year 7-8 (2 MFLs)
    if (['Year 7', 'Year 8'].includes(settings.yearGroup)) {
      setSelectedMfls([]);
      setShowMflPopup(true);
      return;
    }

    // Handle Year 9 (1 MFL)
    if (settings.yearGroup === 'Year 9') {
      setSelectedMfls([]);
      setShowMflPopup(true);
      return;
    }

    // Handle Year 10-11 (GCSE)
    if (['Year 10', 'Year 11'].includes(settings.yearGroup)) {
      setGcseStep(1);
      setGcseSelections({
        science: '',
        humanities: '',
        mfl: '',
        arts: [],
        additional: []
      });
      setShowGcsePopup(true);
      return;
    }
  };

  const handleMflSelection = () => {
    const yearSubjects = YEAR_SUBJECTS[settings.yearGroup as keyof typeof YEAR_SUBJECTS];
    if (!yearSubjects) return;

    const requiredMfls = settings.yearGroup === 'Year 5' ? 1 : 
                        settings.yearGroup === 'Year 6' ? 2 :
                        ['Year 7', 'Year 8'].includes(settings.yearGroup) ? 2 : 1;

    if (selectedMfls.length !== requiredMfls) {
      alert(`Please select exactly ${requiredMfls} MFL${requiredMfls > 1 ? 's' : ''}`);
      return;
    }

    const subjectsToAdd = [...yearSubjects];
    
    // Add selected MFLs
    selectedMfls.forEach(mfl => {
      subjectsToAdd.push({
        name: mfl,
        color: MFL_COLORS[mfl as keyof typeof MFL_COLORS],
        hasBook: true
      });
    });

    const finalSubjects = subjectsToAdd.map(subject => ({
      ...subject,
      teacher: '',
      room: '',
      customItems: []
    }));

    onBatchAddSubjects(finalSubjects);
    setShowMflPopup(false);
    setSelectedMfls([]);
  };

  const handleGcseNext = () => {
    if (gcseStep === 1 && !gcseSelections.science) {
      alert('Please select a science option');
      return;
    }
    if (gcseStep === 2 && !gcseSelections.humanities) {
      alert('Please select a humanities option');
      return;
    }
    if (gcseStep === 4 && gcseSelections.arts.length === 0) {
      alert('Please select at least one arts/performance subject');
      return;
    }

    if (gcseStep < 5) {
      setGcseStep(gcseStep + 1);
    } else {
      handleGcseConfirm();
    }
  };

  const handleGcseConfirm = () => {
    const coreSubjects = YEAR_SUBJECTS[settings.yearGroup as keyof typeof YEAR_SUBJECTS] || [];
    const subjectsToAdd = [...coreSubjects];

    // Add science choice
    const scienceOption = GCSE_OPTIONS.science.find(s => s.name === gcseSelections.science);
    if (scienceOption) {
      subjectsToAdd.push(scienceOption);
    }

    // Add humanities choice
    const humanitiesOption = GCSE_OPTIONS.humanities.find(h => h.name === gcseSelections.humanities);
    if (humanitiesOption) {
      subjectsToAdd.push(humanitiesOption);
    }

    // Add MFL choice (if not None)
    if (gcseSelections.mfl && gcseSelections.mfl !== 'None') {
      subjectsToAdd.push({
        name: gcseSelections.mfl,
        color: MFL_COLORS[gcseSelections.mfl as keyof typeof MFL_COLORS],
        hasBook: true
      });
    }

    // Add arts choices
    gcseSelections.arts.forEach(artName => {
      const artOption = GCSE_OPTIONS.arts.find(a => a.name === artName);
      if (artOption) {
        subjectsToAdd.push(artOption);
      }
    });

    // Add additional choices
    gcseSelections.additional.forEach(additionalName => {
      const additionalOption = GCSE_OPTIONS.additional.find(a => a.name === additionalName);
      if (additionalOption) {
        subjectsToAdd.push(additionalOption);
      }
    });

    const finalSubjects = subjectsToAdd.map(subject => ({
      ...subject,
      teacher: '',
      room: '',
      customItems: []
    }));

    onBatchAddSubjects(finalSubjects);
    setShowGcsePopup(false);
    setGcseStep(1);
    setGcseSelections({
      science: '',
      humanities: '',
      mfl: '',
      arts: [],
      additional: []
    });
  };

  const toggleMfl = (mfl: string) => {
    const requiredMfls = settings.yearGroup === 'Year 5' ? 1 : 
                        settings.yearGroup === 'Year 6' ? 2 :
                        ['Year 7', 'Year 8'].includes(settings.yearGroup) ? 2 : 1;

    if (selectedMfls.includes(mfl)) {
      setSelectedMfls(selectedMfls.filter(m => m !== mfl));
    } else if (selectedMfls.length < requiredMfls) {
      setSelectedMfls([...selectedMfls, mfl]);
    }
  };

  const toggleGcseArts = (art: string) => {
    if (gcseSelections.arts.includes(art)) {
      setGcseSelections({
        ...gcseSelections,
        arts: gcseSelections.arts.filter(a => a !== art)
      });
    } else {
      setGcseSelections({
        ...gcseSelections,
        arts: [...gcseSelections.arts, art]
      });
    }
  };

  const toggleGcseAdditional = (additional: string) => {
    if (gcseSelections.additional.includes(additional)) {
      setGcseSelections({
        ...gcseSelections,
        additional: gcseSelections.additional.filter(a => a !== additional)
      });
    } else {
      setGcseSelections({
        ...gcseSelections,
        additional: [...gcseSelections.additional, additional]
      });
    }
  };

  const getMflRequiredText = () => {
    if (settings.yearGroup === 'Year 5') return 'Which MFL are you taking?';
    if (settings.yearGroup === 'Year 6') return 'Which TWO MFLs are you taking?';
    if (['Year 7', 'Year 8'].includes(settings.yearGroup)) return 'Which TWO MFLs are you taking?';
    return 'Which MFL are you taking?';
  };

  const getMflRequiredCount = () => {
    if (settings.yearGroup === 'Year 5') return 1;
    if (settings.yearGroup === 'Year 6') return 2;
    if (['Year 7', 'Year 8'].includes(settings.yearGroup)) return 2;
    return 1;
  };

  return (
    <div className="space-y-6">
      {/* Creator Attribution */}
      <div className="text-xs text-gray-500 mb-4">
        Created by Anaya Kabani
      </div>

      {/* MFL Selection Popup */}
      {showMflPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{getMflRequiredText()}</h3>
              <button
                onClick={() => setShowMflPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {MFL_OPTIONS[settings.yearGroup as keyof typeof MFL_OPTIONS]?.map(language => (
                <label
                  key={language}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMfls.includes(language) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMfls.includes(language)}
                    onChange={() => toggleMfl(language)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: MFL_COLORS[language as keyof typeof MFL_COLORS] }}
                  />
                  <span className="font-medium text-gray-900">{language}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleMflSelection}
                disabled={selectedMfls.length !== getMflRequiredCount()}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Selection ({selectedMfls.length}/{getMflRequiredCount()})
              </button>
              <button
                onClick={() => setShowMflPopup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GCSE Subject Selection Popup */}
      {showGcsePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {gcseStep === 1 && 'Choose Science Option'}
                {gcseStep === 2 && 'Choose Humanities Subject'}
                {gcseStep === 3 && 'Choose Modern Foreign Language'}
                {gcseStep === 4 && 'Choose Arts/Performance Subjects'}
                {gcseStep === 5 && 'Choose Additional Subjects'}
              </h3>
              <button
                onClick={() => setShowGcsePopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              {gcseStep === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Select one science option:</p>
                  {GCSE_OPTIONS.science.map(option => (
                    <label
                      key={option.name}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        gcseSelections.science === option.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="science"
                        checked={gcseSelections.science === option.name}
                        onChange={() => setGcseSelections({ ...gcseSelections, science: option.name })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className="font-medium text-gray-900">{option.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {gcseStep === 2 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Choose one humanities subject:</p>
                  {GCSE_OPTIONS.humanities.map(option => (
                    <label
                      key={option.name}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        gcseSelections.humanities === option.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="humanities"
                        checked={gcseSelections.humanities === option.name}
                        onChange={() => setGcseSelections({ ...gcseSelections, humanities: option.name })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className="font-medium text-gray-900">{option.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {gcseStep === 3 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Choose one modern foreign language (or none):</p>
                  <label
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      gcseSelections.mfl === 'None' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mfl"
                      checked={gcseSelections.mfl === 'None'}
                      onChange={() => setGcseSelections({ ...gcseSelections, mfl: 'None' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-900">None</span>
                  </label>
                  {Object.entries(MFL_COLORS).map(([language, color]) => (
                    <label
                      key={language}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        gcseSelections.mfl === language 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mfl"
                        checked={gcseSelections.mfl === language}
                        onChange={() => setGcseSelections({ ...gcseSelections, mfl: language })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium text-gray-900">{language}</span>
                    </label>
                  ))}
                </div>
              )}

              {gcseStep === 4 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Choose at least one arts/performance subject:</p>
                  {GCSE_OPTIONS.arts.map(option => (
                    <label
                      key={option.name}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        gcseSelections.arts.includes(option.name) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={gcseSelections.arts.includes(option.name)}
                        onChange={() => toggleGcseArts(option.name)}
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className="font-medium text-gray-900">{option.name}</span>
                    </label>
                  ))}
                </div>
              )}

              {gcseStep === 5 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Choose additional subjects (optional):</p>
                  {GCSE_OPTIONS.additional.map(option => (
                    <label
                      key={option.name}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        gcseSelections.additional.includes(option.name) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={gcseSelections.additional.includes(option.name)}
                        onChange={() => toggleGcseAdditional(option.name)}
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className="font-medium text-gray-900">{option.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              {gcseStep > 1 && (
                <button
                  onClick={() => setGcseStep(gcseStep - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleGcseNext}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {gcseStep === 5 ? 'Confirm Subjects' : 'Next'}
              </button>
              <button
                onClick={() => setShowGcsePopup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="h-8 w-8 text-gray-600" />
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => handleSettingChange('userName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School
              </label>
              <select
                value={settings.school}
                onChange={(e) => handleSettingChange('school', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your School</option>
                <option value="British School Muscat (BSM)">British School Muscat (BSM)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Group
              </label>
              <select
                value={settings.yearGroup}
                onChange={(e) => handleSettingChange('yearGroup', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select year group</option>
                {YEAR_GROUPS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            App Preferences
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Week Layout
              </label>
              <select
                value={settings.weekLayout}
                onChange={(e) => handleSettingChange('weekLayout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="mon-fri">Monday - Friday</option>
                <option value="sun-thu">Sunday - Thursday</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.showHeader ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">Show Header</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showHeader}
                  onChange={(e) => handleSettingChange('showHeader', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Home Widgets */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-green-600" />
          Home Page Widgets
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.widgets).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleWidgetToggle(key as keyof SettingsType['widgets'])}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects Management */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Subjects ({subjects.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleUseSchoolSubjects}
              className="bg-green-100 text-green-800 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              Use School Subjects
            </button>
            <button
              onClick={() => setShowSubjectForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Subject
            </button>
          </div>
        </div>

        <SubjectManager
          subjects={subjects}
          onAddSubject={onAddSubject}
          onUpdateSubject={onUpdateSubject}
          onDeleteSubject={onDeleteSubject}
        />
      </div>

      {/* Hydration Goals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-600" />
          Hydration Goals
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Water Goal (glasses)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={settings.hydrationGoal}
              onChange={(e) => handleSettingChange('hydrationGoal', parseInt(e.target.value) || 8)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Recommended: 8 glasses per day
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}