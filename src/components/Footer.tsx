import React from 'react';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* College Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Apollo Institute of Engineering and Technology
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-600">
                  Near S. P. Ring Road Circle,<br />
                  GJ SH 68, Nava Naroda, Enasan,<br />
                  Gujarat-382330
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-indigo-600 mr-3" />
                  <div>
                    <p className="text-gray-600">+91 760-012-2122</p>
                    <p className="text-gray-600">+91 968-725-5050</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-indigo-600 mr-3" />
                  <a
                    href="mailto:admin@aiet.edu.in"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    admin@aiet.edu.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Credits */}
          <div className="md:text-right">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Developers
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600">Yash Jadhav</p>
              <p className="text-gray-600">Karan Patani</p>
              <p className="text-gray-600">Dharmik Patel</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-center text-gray-600 flex items-center justify-center">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> by AIET Students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;