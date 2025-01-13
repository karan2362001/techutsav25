import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Registration, Event } from '../types';
import { databaseService } from '../services/database';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const RegistrationSuccess: React.FC = () => {
  const { registrationId } = useParams<{ registrationId: string }>();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!registrationId) {
          setError('Registration ID is required');
          return;
        }

        const reg = await databaseService.getRegistrationById(registrationId);
        if (!reg) {
          setError('Registration not found');
          return;
        }
        setRegistration(reg);

        const evt = await databaseService.getEventById(reg.eventId);
        if (!evt) {
          setError('Event not found');
          return;
        }
        setEvent(evt);
      } catch (err) {
        setError('Failed to load registration details');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [registrationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !registration || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error || 'Registration details not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-soft">
          <div className="text-center mb-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600">
              Thank you for registering for {event.title}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Registration Details
              </h3>
              <div className="grid gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Registration ID:</span>
                  <p className="text-gray-800">{registration.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Team Name:</span>
                  <p className="text-gray-800">{registration.teamName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Registration Date:</span>
                  <p className="text-gray-800">
                    {new Date(registration.registrationDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <p className="capitalize text-gray-800">{registration.status}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Team Leader Details
              </h3>
              <div className="grid gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Name:</span>
                  <p className="text-gray-800">{registration.teamLeader.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-gray-800">{registration.teamLeader.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone:</span>
                  <p className="text-gray-800">{registration.teamLeader.phone}</p>
                </div>
              </div>
            </div>

            {registration.teamMembers.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Team Members
                </h3>
                {registration.teamMembers.map((member, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Team Member {index + 1}
                    </h4>
                    <div className="grid gap-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Name:</span>
                        <p className="text-gray-800">{member.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="text-gray-800">{member.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone:</span>
                        <p className="text-gray-800">{member.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Link
                to={`/events/${event.id}`}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Back to Event
              </Link>
              <Link
                to="/events"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                Browse More Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess; 