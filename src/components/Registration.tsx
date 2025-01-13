import React, { useState } from 'react';
import { User, Mail, School, Phone, Users, Sparkles, ChevronRight } from 'lucide-react';

const Registration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    phone: '',
    teamName: '',
    teamSize: '1',
    events: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEventToggle = (event: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 h-0.5 w-full bg-gray-200 -z-10" />
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= num
                  ? 'bg-indigo-600 text-white scale-110'
                  : 'bg-white text-gray-400 shadow-soft'
              }`}
            >
              {step > num ? (
                <Sparkles className="w-5 h-5 animate-pulse" />
              ) : (
                num
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-soft">
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Details</h2>
                
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>

                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    placeholder="College Name"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Details</h2>
                
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    placeholder="Team Name"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>

                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  >
                    {[1, 2, 3, 4].map(size => (
                      <option key={size} value={size}>{size} Member{size > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Events</h2>
                
                {['Hackathon', 'Coding Competition', 'Tech Quiz', 'Robotics Workshop'].map((event) => (
                  <div
                    key={event}
                    onClick={() => handleEventToggle(event)}
                    className={`p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                      formData.events.includes(event)
                        ? 'bg-indigo-50 border-2 border-indigo-500'
                        : 'bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{event}</span>
                      <ChevronRight className={`w-5 h-5 transition-transform ${
                        formData.events.includes(event) ? 'rotate-90 text-indigo-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={step === 3 ? () => console.log('Submit:', formData) : nextStep}
                className={`px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-all ml-auto`}
              >
                {step === 3 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;