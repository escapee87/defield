import { FieldReportForm } from '@/components/fieldsync/field-report-form';

export default function ReportPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Submit Field Report</h1>
        <p className="text-muted-foreground">Rate field conditions and report any issues.</p>
      </div>
      <FieldReportForm />
    </div>
  );
}
