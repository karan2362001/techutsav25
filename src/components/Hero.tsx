import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Tech Utsav 2025
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Join us for an exciting celebration of technology and innovation at Apollo Institute of Engineering and Technology. 
              Participate in various events, showcase your skills, and win exciting prizes!
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-indigo-600" />
                <span>March 15-17, 2025</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-indigo-600" />
                <span>University Campus</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-3 text-indigo-600" />
                <span>1000+ Participants Expected</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/events"
                className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all text-center"
              >
                Register Now
              </Link>
              <a
                href="#schedule"
                className="inline-block px-8 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-50 transition-all text-center"
              >
                View Schedule
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-1">
              <div className="h-full w-full rounded-2xl bg-white/90 backdrop-blur-xl">
                <div className="p-8 h-full flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Highlights</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 mt-2 mr-3"></span>
                      <span className="text-gray-600">Technical Workshops</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 mt-2 mr-3"></span>
                      <span className="text-gray-600">Hackathon</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 mt-2 mr-3"></span>
                      <span className="text-gray-600">Project Exhibition</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 mt-2 mr-3"></span>
                      <span className="text-gray-600">Guest Lectures</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;