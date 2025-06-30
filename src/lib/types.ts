export interface Registration {
  id: string;
  teamName: string;
  coachName: string;
  coachEmail: string;
  coachPhone: string;
  checkedIn: boolean;
}

export interface Session {
  id: string;
  date: Date;
  time: string;
  capacity: number;
  registrations: Registration[];
  status: 'active' | 'cancelled';
}
