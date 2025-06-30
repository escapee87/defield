import { MonitorView } from '@/components/fieldsync/monitor-view';

export default function MonitorPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Attendance Monitoring</h1>
        <p className="text-muted-foreground">Select a session to track team check-ins in real-time.</p>
      </div>
      <MonitorView />
    </div>
  );
}
