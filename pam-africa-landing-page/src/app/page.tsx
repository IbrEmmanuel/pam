import HomePageClient from "@/app/HomePageClient";
import { listPublishedJournals } from "@/lib/journals";
import { listFeaturedProjects } from "@/lib/projects";

export default async function Page() {
  const [initialJournals, featured] = await Promise.all([
    listPublishedJournals(),
    listFeaturedProjects(),
  ]);

  const featuredProjects = featured.map((project) => ({
    img: project.cover,
    title: project.title,
    type: project.type,
    slug: project.slug,
  }));

  return (
    <HomePageClient
      initialJournals={initialJournals}
      featuredProjects={featuredProjects}
    />
  );
}
