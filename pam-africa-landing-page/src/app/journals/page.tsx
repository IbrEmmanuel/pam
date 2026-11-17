import HeroTitleText from "@/components/HeroTitleText";
import JournalsList from "@/components/journals/JounalList";
import NavBar from "@/components/NavBar";
import { listPublishedJournals } from "@/lib/journals";

export default async function JournalsPage() {
  const initialJournals = await listPublishedJournals();
  return (
    <div>
      <NavBar />
      <HeroTitleText
        title="Journals"
        text="Welcome to our Journal — a space for ideas, insights, and impact.
Here, we document key moments, press features, opinion pieces, and behind-the-scenes stories that reflect PAM's journey in powering Africa's energy future. From event recaps and policy shifts to human stories and innovation highlights, this is where we share what's shaping the future of clean energy on the continent."
      />
      <JournalsList initialJournals={initialJournals} />
    </div>
  );
}
