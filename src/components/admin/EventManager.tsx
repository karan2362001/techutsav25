import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Event } from '../../types';
import { databaseService } from '../../services/database';

const EventManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const dbEvents = await databaseService.getAllEvents();
      setEvents(dbEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultEvent: Event = {
    id: '',
    title: '',
    category: 'technical',
    description: '',
    rules: [''],
    prize: '',
    deadline: '',
    teamSize: '',
    contact: '',
    studentCoordinator: '',
    facultyCoordinator: ''
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsAddingNew(false);
  };

  const handleAdd = () => {
    setEditingEvent({
      ...defaultEvent,
      id: Date.now().toString()
    });
    setIsAddingNew(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await databaseService.deleteEvent(id);
        await loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleSave = async (event: Event) => {
    try {
      if (isAddingNew) {
        await databaseService.createEvent(event);
      } else {
        await databaseService.updateEvent(event);
      }
      await loadEvents();
      setEditingEvent(null);
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setIsAddingNew(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-soft">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Event Management</h2>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Event
        </button>
      </div>

      {/* Event Editor */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {isAddingNew ? 'Add New Event' : 'Edit Event'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editingEvent.category}
                  onChange={e => setEditingEvent({ ...editingEvent, category: e.target.value as 'technical' | 'non-technical' })}
                  className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="technical">Technical</option>
                  <option value="non-technical">Non-Technical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingEvent.description}
                  onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rules (one per line)
                </label>
                <textarea
                  value={editingEvent.rules.join('\n')}
                  onChange={e => setEditingEvent({ ...editingEvent, rules: e.target.value.split('\n').filter(rule => rule.trim()) })}
                  className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prize
                  </label>
                  <input
                    type="text"
                    value={editingEvent.prize}
                    onChange={e => setEditingEvent({ ...editingEvent, prize: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Size
                  </label>
                  <input
                    type="text"
                    value={editingEvent.teamSize}
                    onChange={e => setEditingEvent({ ...editingEvent, teamSize: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={editingEvent.deadline}
                    onChange={e => setEditingEvent({ ...editingEvent, deadline: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="email"
                    value={editingEvent.contact}
                    onChange={e => setEditingEvent({ ...editingEvent, contact: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Coordinator
                  </label>
                  <input
                    type="text"
                    value={editingEvent.studentCoordinator}
                    onChange={e => setEditingEvent({ ...editingEvent, studentCoordinator: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Name of student coordinator"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty Coordinator
                  </label>
                  <input
                    type="text"
                    value={editingEvent.facultyCoordinator}
                    onChange={e => setEditingEvent({ ...editingEvent, facultyCoordinator: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Name of faculty coordinator"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(editingEvent)}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.map(event => (
          <div
            key={event.id}
            className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.category}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(event)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventManager; 