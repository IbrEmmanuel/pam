import JournalForm from "@/components/admin/JournalForm";

export default function NewJournalPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-white/40">Journals</p>
      <h1 className="mt-2 text-4xl">New journal</h1>
      <div className="mt-8">
        <JournalForm />
      </div>
    </div>
  );
}
