import React, { useState } from 'react';
import { Plus, BookOpen, MapPin, X } from 'lucide-react';
import { Book, Subject, Settings } from '../types';

interface BookTrackerProps {
  books: Book[];
  subjects: Subject[];
  settings: Settings;
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onUpdateBook: (id: string, updates: Partial<Book>) => void;
  onDeleteBook: (id: string) => void;
}

export default function BookTracker({ books, subjects, settings, onAddBook, onUpdateBook, onDeleteBook }: BookTrackerProps) {
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookModalType, setBookModalType] = useState<'subject' | 'custom'>('subject');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customBookName, setCustomBookName] = useState('');
  const [bookLocation, setBookLocation] = useState<Book['location']>('Class');
  const [customLocation, setCustomLocation] = useState('');

  const locations: Book['location'][] = ['Class', 'Locker', 'Home', 'Other'];

  const handleTrackBookClick = () => {
    setShowBookModal(true);
    setBookModalType('subject');
    setSelectedSubject('');
    setCustomBookName('');
    setBookLocation('Class');
    setCustomLocation('');
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let bookName = '';
    if (bookModalType === 'subject' && selectedSubject) {
      bookName = `${selectedSubject} Book`;
    } else if (bookModalType === 'custom' && customBookName.trim()) {
      bookName = customBookName.trim();
    }
    
    if (!bookName) return;
    
    onAddBook({
      name: bookName,
      location: bookLocation,
      customLocation: bookLocation === 'Other' ? customLocation.trim() : undefined
    });
    
    setShowBookModal(false);
  };

  const handleLocationChange = (bookId: string, newLocation: Book['location']) => {
    if (newLocation === 'Other') {
      const custom = prompt('Where exactly?', 'Other location');
      if (custom !== null) {
        onUpdateBook(bookId, { location: newLocation, customLocation: custom });
      }
    } else {
      onUpdateBook(bookId, { location: newLocation, customLocation: undefined });
    }
  };

  const getLocationDisplay = (book: Book) => {
    return book.location === 'Other' && book.customLocation ? book.customLocation : book.location;
  };

  const getLocationColor = (location: Book['location']) => {
    switch (location) {
      case 'Class': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Locker': return 'bg-green-100 text-green-800 border-green-200';
      case 'Home': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Other': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const subjectsWithBooks = subjects.filter(subject => subject.hasBook);

  return (
    <div className="space-y-6">
      {/* Creator Attribution */}
      <div className="text-xs text-gray-500 mb-4">
        Created by Anaya Kabani
      </div>

      {/* Track Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Track a Book</h3>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleBookSubmit} className="space-y-4">
              {/* Book Type Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="bookType"
                    value="subject"
                    checked={bookModalType === 'subject'}
                    onChange={(e) => setBookModalType(e.target.value as 'subject' | 'custom')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Select from existing subjects</span>
                    <p className="text-sm text-gray-500">Choose a subject that has a book</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="bookType"
                    value="custom"
                    checked={bookModalType === 'custom'}
                    onChange={(e) => setBookModalType(e.target.value as 'subject' | 'custom')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Enter custom book name</span>
                    <p className="text-sm text-gray-500">e.g., "Library Book", "PO"</p>
                  </div>
                </label>
              </div>

              {/* Subject Selection */}
              {bookModalType === 'subject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={bookModalType === 'subject'}
                  >
                    <option value="">Choose a subject</option>
                    {subjectsWithBooks.map(subject => (
                      <option key={subject.id} value={subject.name}>{subject.name}</option>
                    ))}
                  </select>
                  {subjectsWithBooks.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No subjects with books found. Add subjects in Settings first.
                    </p>
                  )}
                </div>
              )}

              {/* Custom Book Name */}
              {bookModalType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Name
                  </label>
                  <input
                    type="text"
                    value={customBookName}
                    onChange={(e) => setCustomBookName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Library Book, PO"
                    required={bookModalType === 'custom'}
                  />
                </div>
              )}

              {/* Location Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {locations.map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setBookLocation(loc)}
                      className={`p-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                        bookLocation === loc
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
                
                {bookLocation === 'Other' && (
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Specify location..."
                    required={bookLocation === 'Other'}
                  />
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Track Book
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track Book Button */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <BookOpen className="h-5 w-5 text-blue-600" />
              Track a Book
            </h2>
            
            <button
              onClick={handleTrackBookClick}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Track a Book
            </button>
            
            <p className="text-sm text-gray-500 mt-3 text-center">
              Track books from your subjects or add custom books like library books
            </p>
          </div>
          
          {/* Subject Books & Custom Items */}
          {subjects.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Subject Items
              </h2>
              
              <div className="space-y-4">
                {subjects.map(subject => (
                  <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                    </div>
                    
                    {subject.hasBook && (
                      <div className="mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          📚 {subject.name} Book
                        </span>
                      </div>
                    )}
                    
                    {subject.customItems && subject.customItems.length > 0 && (
                      <div className="space-y-2">
                        {subject.customItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLocationColor(item.location)}`}>
                              {item.location === 'Other' && item.customLocation ? item.customLocation : item.location}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Books List */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Book Locations ({books.length})
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {books.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No books tracked</p>
                  <p className="text-sm">Add your first book to start tracking!</p>
                </div>
              ) : (
                books.map(book => (
                  <div key={book.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{book.name}</h3>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLocationColor(book.location)}`}>
                            {getLocationDisplay(book)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteBook(book.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {locations.map(loc => (
                        <button
                          key={loc}
                          onClick={() => handleLocationChange(book.id, loc)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            book.location === loc
                              ? getLocationColor(loc)
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
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