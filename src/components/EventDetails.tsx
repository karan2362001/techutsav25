import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Event } from '../types';
import { databaseService } from '../services/database';
import { AlertCircle, Calendar, Users, Trophy, Book } from 'lucide-react';

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadEvent = async () => {
      try {
        if (!eventId) {
          setError('Event ID is required');
          return;
        }
        const loadedEvent = await databaseService.getEventById(eventId);
        if (!loadedEvent) {
          setError('Event not found');
          return;
        }
        setEvent(loadedEvent);
      } catch (err) {
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error || 'Event not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-soft">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {event.category}
            </span>
          </div>

          <div className="grid gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About the Event</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Book className="w-5 h-5 mr-2" />
                Rules
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {event.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Prize
                </h3>
                <p className="text-gray-600">{event.prize}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Registration Deadline
                </h3>
                <p className="text-gray-600">{event.deadline}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team Size
                </h3>
                <p className="text-gray-600">{event.teamSize}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
                <p className="text-gray-600">{event.contact}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Student Coordinator</h3>
                <p className="text-gray-600">{event.studentCoordinator}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Faculty Coordinator</h3>
                <p className="text-gray-600">{event.facultyCoordinator}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/events"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Back to Events
            </Link>
            <Link
              to={`/events/${event.id}/register`}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 