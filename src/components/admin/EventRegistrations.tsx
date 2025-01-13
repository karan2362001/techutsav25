import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { databaseService } from '../../services/database';
import { Event, Registration } from '../../types';
import { Search, Download, ArrowUpDown, CheckCircle, XCircle, Clock } from 'lucide-react';

type SortField = 'registrationDate' | 'teamName' | 'status';
type SortOrder = 'asc' | 'desc';

const EventRegistrations: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Registration['status'] | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('registrationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!eventId) return;
        
        const [loadedEvent, loadedRegistrations] = await Promise.all([
          databaseService.getEventById(eventId),
          databaseService.getRegistrationsByEvent(eventId)
        ]);

        if (!loadedEvent) throw new Error('Event not found');
        
        setEvent(loadedEvent);
        setRegistrations(loadedRegistrations);
      } catch (error) {
        console.error('Failed to load registrations:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [eventId]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (registrationId: string, newStatus: Registration['status']) => {
    try {
      await databaseService.updateRegistrationStatus(registrationId, newStatus);
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === registrationId ? { ...reg, status: newStatus } : reg
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const downloadRegistrations = () => {
    if (!event) return;

    let csvContent = 'Registration ID,Team Name,Registration Date,Status,';
    csvContent += 'Team Leader Name,Team Leader Email,Team Leader Phone,Team Leader College,';
    csvContent += 'Team Members\n';

    filteredAndSortedRegistrations.forEach(reg => {
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
    a.download = `${event.title.toLowerCase().replace(/\s+/g, '-')}-registrations.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredAndSortedRegistrations = registrations
    .filter(reg => {
      const matchesSearch = 
        reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.teamLeader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.teamLeader.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'registrationDate':
          comparison = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
          break;
        case 'teamName':
          comparison = a.teamName.localeCompare(b.teamName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">Event not found</div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h1>
          <p className="text-gray-600">Registration Management</p>
        </div>

        <div className="bg-white rounded-xl shadow-soft">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by team name, leader name, or email..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Registration['status'] | 'all')}
                  className="px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  onClick={downloadRegistrations}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-4 font-semibold text-gray-600">Team</th>
                    <th className="pb-4 font-semibold text-gray-600">
                      <button
                        onClick={() => handleSort('registrationDate')}
                        className="inline-flex items-center"
                      >
                        Registration Date
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </button>
                    </th>
                    <th className="pb-4 font-semibold text-gray-600">Team Leader</th>
                    <th className="pb-4 font-semibold text-gray-600">Team Size</th>
                    <th className="pb-4 font-semibold text-gray-600">
                      <button
                        onClick={() => handleSort('status')}
                        className="inline-flex items-center"
                      >
                        Status
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </button>
                    </th>
                    <th className="pb-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedRegistrations.map((registration) => (
                    <tr key={registration.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-800">{registration.teamName}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        {new Date(registration.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-medium text-gray-800">{registration.teamLeader.name}</p>
                          <p className="text-sm text-gray-600">{registration.teamLeader.email}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        {registration.teamMembers.length + 1} members
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          registration.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : registration.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {registration.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {registration.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                          {registration.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          {registration.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(registration.id, 'approved')}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-all"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(registration.id, 'rejected')}
                                className="px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-all"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
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

export default EventRegistrations; 