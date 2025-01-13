import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  lastActivity: number;
  updateLastActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Secure hash function using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    const token = sessionStorage.getItem('adminToken');
    const lastActivity = sessionStorage.getItem('lastActivity');
    
    if (!token || !lastActivity) return false;
    
    // Check if session has expired
    const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('lastActivity');
      return false;
    }
    
    return true;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(() => 
    parseInt(sessionStorage.getItem('lastActivity') || '0')
  );
  
  const navigate = useNavigate();

  // Check for session timeout periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const lastActivityTime = parseInt(sessionStorage.getItem('lastActivity') || '0');
      const timeSinceLastActivity = Date.now() - lastActivityTime;
      
      if (isAdmin && timeSinceLastActivity > SESSION_TIMEOUT) {
        logout();
        navigate('/admin');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAdmin, navigate]);

  // Update last activity timestamp when there's user interaction
  useEffect(() => {
    const handleActivity = () => {
      if (isAdmin) {
        updateLastActivity();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isAdmin]);

  useEffect(() => {
    // Simulate checking token validity
    setIsLoading(false);
  }, []);

  const updateLastActivity = () => {
    const timestamp = Date.now();
    setLastActivity(timestamp);
    sessionStorage.setItem('lastActivity', timestamp.toString());
  };

  const login = async (password: string): Promise<boolean> => {
    try {
      // Hash the password
      const hashedPassword = await hashPassword(password);
      
      // In a real app, you would verify this against a secure backend
      // For demo purposes, we're using a hardcoded hash of 'admin123'
      const correctHash = await hashPassword('admin123');
      
      if (hashedPassword === correctHash) {
        // Generate a session token (in a real app, this would come from the server)
        const token = crypto.randomUUID();
        sessionStorage.setItem('adminToken', token);
        updateLastActivity();
        setIsAdmin(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('lastActivity');
    setIsAdmin(false);
    setLastActivity(0);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      isAdmin,
      login,
      logout,
      isLoading,
      lastActivity,
      updateLastActivity
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 