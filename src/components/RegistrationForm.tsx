import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Event, TeamMember, Registration } from '../types';
import { databaseService } from '../services/database';
import { Users, AlertCircle } from 'lucide-react';

const emptyTeamMember: TeamMember = {
  name: '',
  email: '',
  phone: '',
  college: '',
  year: '',
  branch: ''
};

const RegistrationForm: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [teamName, setTeamName] = useState('');
  const [teamLeader, setTeamLeader] = useState<TeamMember>(emptyTeamMember);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [maxTeamSize, setMaxTeamSize] = useState(1);

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
        // Parse team size (e.g., "2-4" -> 4, "1" -> 1)
        const size = loadedEvent.teamSize.split('-').map(Number);
        setMaxTeamSize(size[size.length - 1]);
        // Initialize team members array if team size > 1
        if (size[size.length - 1] > 1) {
          setTeamMembers(Array(size[size.length - 1] - 1).fill(emptyTeamMember));
        }
      } catch (err) {
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleTeamLeaderChange = (field: keyof TeamMember, value: string) => {
    setTeamLeader(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    try {
      // Validate team leader
      if (!teamLeader.name || !teamLeader.email || !teamLeader.phone) {
        setError('Please fill all team leader details');
        return;
      }

      // Validate team members if required
      if (maxTeamSize > 1) {
        if (!teamName) {
          setError('Team name is required');
          return;
        }
        const invalidMembers = teamMembers.some(
          member => !member.name || !member.email || !member.phone
        );
        if (invalidMembers) {
          setError('Please fill all team member details');
          return;
        }
      }

      const registration: Registration = {
        id: Date.now().toString(),
        eventId: event.id,
        teamName: maxTeamSize > 1 ? teamName : teamLeader.name,
        teamLeader,
        teamMembers: maxTeamSize > 1 ? teamMembers : [],
        registrationDate: new Date().toISOString(),
        status: 'pending'
      };

      await databaseService.createRegistration(registration);
      navigate(`/registration-success/${registration.id}`);
    } catch (err) {
      setError('Failed to submit registration');
    }
  };

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
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Register for {event.title}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {maxTeamSize > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
            )}

            {/* Team Leader Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {maxTeamSize > 1 ? 'Team Leader' : 'Participant'} Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={teamLeader.name}
                    onChange={(e) => handleTeamLeaderChange('name', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={teamLeader.email}
                    onChange={(e) => handleTeamLeaderChange('email', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={teamLeader.phone}
                    onChange={(e) => handleTeamLeaderChange('phone', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College
                  </label>
                  <input
                    type="text"
                    value={teamLeader.college}
                    onChange={(e) => handleTeamLeaderChange('college', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    value={teamLeader.year}
                    onChange={(e) => handleTeamLeaderChange('year', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={teamLeader.branch}
                    onChange={(e) => handleTeamLeaderChange('branch', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Team Members Section */}
            {maxTeamSize > 1 && teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team Member {index + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={member.phone}
                      onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      College
                    </label>
                    <input
                      type="text"
                      value={member.college}
                      onChange={(e) => handleTeamMemberChange(index, 'college', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      value={member.year}
                      onChange={(e) => handleTeamMemberChange(index, 'year', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={member.branch}
                      onChange={(e) => handleTeamMemberChange(index, 'branch', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {error && (
              <div className="text-red-600 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
            >
              Submit Registration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm; 