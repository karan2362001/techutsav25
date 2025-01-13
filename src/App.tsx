import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Hero from './components/Hero';
import Events from './components/Events';
import Gallery from './components/Gallery';
import EventManager from './components/admin/EventManager';
import RegistrationForm from './components/RegistrationForm';
import RegistrationSuccess from './components/RegistrationSuccess';
import EventDetails from './components/EventDetails';
import Dashboard from './components/admin/Dashboard';
import EventRegistrations from './components/admin/EventRegistrations';
import Footer from './components/Footer';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : <Navigate to="/admin" />;
};

// Admin Login Component
const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(password);
      if (success) {
        window.location.href = '/admin/dashboard';
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Tech Utsav 2025 Admin
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Admin Password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Navigation Component
const Navigation: React.FC<{ isMenuOpen: boolean; setIsMenuOpen: (open: boolean) => void }> = ({
  isMenuOpen,
  setIsMenuOpen
}) => {
  const { isAdmin, logout } = useAuth();

  return (
    <nav className="bg-white shadow-soft fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Tech Utsav 2025
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/events" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Events
            </Link>
            <Link to="/gallery" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Gallery
            </Link>
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/admin/events" className="text-gray-600 hover:text-indigo-600 transition-colors">
                  Manage Events
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/events"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-all"
              >
                Register Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/events"
            className="block px-3 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Events
          </Link>
          <Link
            to="/gallery"
            className="block px-3 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Gallery
          </Link>
          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="block px-3 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/events"
                className="block px-3 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Manage Events
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/events"
              className="block px-3 py-2 rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
              onClick={() => setIsMenuOpen(false)}
            >
              Register Now
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

          {/* Main Content */}
          <div className="pt-16">
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Events />
                  <Gallery />
                </>
              } />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetails />} />
              <Route path="/events/:eventId/register" element={<RegistrationForm />} />
              <Route path="/registration-success/:registrationId" element={<RegistrationSuccess />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute>
                    <EventManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/registrations/:eventId"
                element={
                  <ProtectedRoute>
                    <EventRegistrations />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;