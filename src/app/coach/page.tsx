import { CoachView } from '@/components/fieldsync/coach-view';

export default function CoachPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Available Sessions</h1>
        <p className="text-muted-foreground">Find a practice slot and register your team.</p>
      </div>
      <CoachView />
    </div>
  );
}
