import { MonitorView } from '@/components/fieldsync/monitor-view';

export default function MonitorPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Today's Attendance</h1>
        <p className="text-muted-foreground">Track team check-ins for sessions happening today.</p>
      </div>
      <MonitorView />
    </div>
  );
}
