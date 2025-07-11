import { AdminView } from '@/components/fieldsync/admin-view';

export default function AdminPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Administrator Dashboard</h1>
        <p className="text-muted-foreground">Create new sessions and manage existing ones.</p>
      </div>
      <AdminView />
    </div>
  );
}
