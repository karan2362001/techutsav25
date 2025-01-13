import React, { useState, useEffect } from 'react';
import { databaseService } from '../../services/database';
import { Event, Registration } from '../../types';
import { BarChart3, Users, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedEvents, loadedRegistrations] = await Promise.all([
          databaseService.getAllEvents(),
          databaseService.getAllRegistrations()
        ]);
        setEvents(loadedEvents);
        setRegistrations(loadedRegistrations);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getEventStats = () => {
    const stats = events.map(event => ({
      event,
      registrations: registrations.filter(reg => reg.eventId === event.id),
      totalParticipants: registrations
        .filter(reg => reg.eventId === event.id)
        .reduce((acc, reg) => acc + reg.teamMembers.length + 1, 0) // +1 for team leader
    }));

    return stats.sort((a, b) => b.totalParticipants - a.totalParticipants);
  };

  const downloadEventRegistrations = async (eventId: string, eventTitle: string) => {
    const eventRegistrations = registrations.filter(reg => reg.eventId === eventId);
    const event = events.find(e => e.id === eventId);

    if (!event) return;

    let csvContent = 'Registration ID,Team Name,Registration Date,Status,';
    csvContent += 'Team Leader Name,Team Leader Email,Team Leader Phone,Team Leader College,';
    csvContent += 'Team Members\n';

    eventRegistrations.forEach(reg => {
      const teamLeader = reg.teamLeader;
      const teamMembers = reg.teamMembers.map(member => 
        `${member.name} (${member.email})`
      ).join('; ');

      csvContent += `${reg.id},${reg.teamName},${reg.registrationDate},${reg.status},`;
      csvContent += `${teamLeader.name},${teamLeader.email},${teamLeader.phone},${teamLeader.college},`;
      csvContent += `"${teamMembers}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventTitle.toLowerCase().replace(/\s+/g, '-')}-registrations.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = getEventStats();
  const totalRegistrations = registrations.length;
  const totalParticipants = registrations.reduce(
    (acc, reg) => acc + reg.teamMembers.length + 1,
    0
  );

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Events</p>
                  <p className="text-2xl font-bold text-gray-800">{events.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Registrations</p>
                  <p className="text-2xl font-bold text-gray-800">{totalRegistrations}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-800">{totalParticipants}</p>
                </div>
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Event Registration Statistics</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-4 font-semibold text-gray-600">Event</th>
                    <th className="pb-4 font-semibold text-gray-600">Category</th>
                    <th className="pb-4 font-semibold text-gray-600">Registrations</th>
                    <th className="pb-4 font-semibold text-gray-600">Total Participants</th>
                    <th className="pb-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map(({ event, registrations, totalParticipants }) => (
                    <tr key={event.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-4">
                        <Link
                          to={`/admin/registrations/${event.id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          {event.title}
                        </Link>
                      </td>
                      <td className="py-4">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {event.category}
                        </span>
                      </td>
                      <td className="py-4">{registrations.length}</td>
                      <td className="py-4">{totalParticipants}</td>
                      <td className="py-4">
                        <button
                          onClick={() => downloadEventRegistrations(event.id, event.title)}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download CSV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 