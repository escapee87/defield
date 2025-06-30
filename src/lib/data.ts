import type { Session } from './types';

export const initialSessions: Session[] = [
  {
    id: 'ses_today',
    date: new Date(),
    time: '15:00 - 16:00',
    capacity: 6,
    registrations: [
      { id: 'reg_10', teamName: 'FC Dynamos', coachName: 'Alex Ray', coachEmail: 'alex@example.com', coachPhone: '111-222-3333', checkedIn: false },
      { id: 'reg_11', teamName: 'City United', coachName: 'Sam Jones', coachEmail: 'sam@example.com', coachPhone: '444-555-6666', checkedIn: true },
    ],
    status: 'active',
  },
  {
    id: 'ses_1',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: '16:00 - 17:00',
    capacity: 6,
    registrations: [
      { id: 'reg_1', teamName: 'FC Eagles', coachName: 'John Smith', coachEmail: 'john@example.com', coachPhone: '123-456-7890', checkedIn: false },
      { id: 'reg_2', teamName: 'City Rovers', coachName: 'Jane Doe', coachEmail: 'jane@example.com', coachPhone: '234-567-8901', checkedIn: false },
    ],
    status: 'active',
  },
  {
    id: 'ses_2',
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    time: '17:00 - 18:00',
    capacity: 6,
    registrations: [],
    status: 'active',
  },
  {
    id: 'ses_3',
    date: new Date(new Date().setDate(new Date().getDate() + 4)),
    time: '18:00 - 19:00',
    capacity: 6,
    registrations: [
        { id: 'reg_3', teamName: 'United FC', coachName: 'Peter Jones', coachEmail: 'peter@example.com', coachPhone: '345-678-9012', checkedIn: true },
        { id: 'reg_4', teamName: 'Real Athletic', coachName: 'Mary Brown', coachEmail: 'mary@example.com', coachPhone: '456-789-0123', checkedIn: false },
        { id: 'reg_5', teamName: 'FC Strikers', coachName: 'David Williams', coachEmail: 'david@example.com', coachPhone: '567-890-1234', checkedIn: false },
        { id: 'reg_6', teamName: 'County FC', coachName: 'Susan Taylor', coachEmail: 'susan@example.com', coachPhone: '678-901-2345', checkedIn: false },
        { id: 'reg_7', teamName: 'AFC Giants', coachName: 'Michael Clark', coachEmail: 'michael@example.com', coachPhone: '789-012-3456', checkedIn: false },
        { id: 'reg_8', teamName: 'Sporting Club', coachName: 'Linda Harris', coachEmail: 'linda@example.com', coachPhone: '890-123-4567', checkedIn: false },
    ],
    status: 'active',
  },
    {
    id: 'ses_4',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    time: '19:00 - 20:00',
    capacity: 6,
    registrations: [
      { id: 'reg_9', teamName: 'Warriors', coachName: 'Chris Green', coachEmail: 'chris@example.com', coachPhone: '901-234-5678', checkedIn: true },
    ],
    status: 'active',
  },
];
