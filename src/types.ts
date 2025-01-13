export interface Event {
  id: string;
  title: string;
  category: 'technical' | 'non-technical';
  description: string;
  rules: string[];
  prize: string;
  deadline: string;
  teamSize: string;
  contact: string;
  studentCoordinator: string;
  facultyCoordinator: string;
}

export interface TeamMember {
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  branch: string;
}

export interface Registration {
  id: string;
  eventId: string;
  teamName: string;
  teamLeader: TeamMember;
  teamMembers: TeamMember[];
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface GalleryImage {
  id: string;
  url: string;
  category: 'previous' | 'campus' | 'performances';
  alt: string;
}