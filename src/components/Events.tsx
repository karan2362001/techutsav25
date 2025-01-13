import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { databaseService } from '../services/database';
import { Calendar, Users, Trophy } from 'lucide-react';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'technical' | 'non-technical'>('all');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const loadedEvents = await databaseService.getAllEvents();
        setEvents(loadedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    filter === 'all' ? true : event.category === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Events</h2>
          <div className="flex justify-center space-x-4">
            {(['all', 'technical', 'non-technical'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {event.category}
                </span>
              </div>

              <p className="text-gray-600 mb-6 line-clamp-3">{event.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{event.deadline}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{event.teamSize}</span>
                </div>
                <div className="flex items-center text-gray-600 col-span-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  <span>{event.prize}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events; 