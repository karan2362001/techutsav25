import { Event } from '../types';
import { databaseService } from './database';

const defaultEvents: Event[] = [
  {
    id: '1',
    title: 'Code Monk',
    category: 'technical',
    description: 'Test your coding skills and problem-solving abilities',
    rules: ['Individual participation', 'Time-bound coding challenges', 'Multiple programming languages supported'],
    prize: '₹5000',
    deadline: '2024-04-15',
    teamSize: '1',
    contact: 'codemonk@techfest.com',
    studentCoordinator: 'John Doe',
    facultyCoordinator: 'Prof. Smith'
  },
  {
    id: '2',
    title: 'Robo Rally',
    category: 'technical',
    description: 'Navigate your robot through challenging obstacle courses',
    rules: ['Teams of 2-3 members', 'Bring your own robot', 'Follow safety guidelines'],
    prize: '₹7000',
    deadline: '2024-04-15',
    teamSize: '2-3',
    contact: 'roborally@techfest.com',
    studentCoordinator: 'Jane Smith',
    facultyCoordinator: 'Prof. Johnson'
  },
  {
    id: '3',
    title: 'Bot Battle',
    category: 'technical',
    description: 'Robot vs Robot competition in an arena battle',
    rules: ['Teams of 2-4 members', 'Robot weight restrictions apply', 'Safety gear mandatory'],
    prize: '₹8000',
    deadline: '2024-04-15',
    teamSize: '2-4',
    contact: 'botbattle@techfest.com',
    studentCoordinator: 'Mike Wilson',
    facultyCoordinator: 'Prof. Brown'
  },
  {
    id: '9',
    title: 'No Glitch',
    category: 'non-technical',
    description: 'BGMI and FreeFire gaming tournament',
    rules: ['Squad matches', 'Fair play policy', 'Multiple rounds'],
    prize: '₹6000',
    deadline: '2024-04-15',
    teamSize: '4',
    contact: 'noglitch@techfest.com',
    studentCoordinator: 'Alex Turner',
    facultyCoordinator: 'Prof. Davis'
  },
  {
    id: '10',
    title: 'Counter Strike',
    category: 'non-technical',
    description: 'CS:GO tournament with elimination rounds',
    rules: ['5v5 matches', 'Standard competitive rules', 'Best of three'],
    prize: '₹7000',
    deadline: '2024-04-15',
    teamSize: '5',
    contact: 'cs@techfest.com',
    studentCoordinator: 'Chris Martin',
    facultyCoordinator: 'Prof. Wilson'
  }
];

// Initialize database with default events
const initializeDatabase = async () => {
  try {
    await databaseService.initializeDefaultEvents(defaultEvents);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initializeDatabase(); 