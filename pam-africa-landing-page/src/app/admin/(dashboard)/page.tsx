import Link from "next/link";
import { listAllJournals } from "@/lib/journals";
import { listAllProjects } from "@/lib/projects";
import { collectJournalMediaUrls, isSanityCdnUrl } from "@/lib/journalMedia";

export default async function AdminHomePage() {
  let journalCounts = { total: 0, published: 0, drafts: 0 };
  let projectCounts = { total: 0, published: 0, drafts: 0 };
  let recentJournals: Awaited<ReturnType<typeof listAllJournals>> = [];
  let recentProjects: Awaited<ReturnType<typeof listAllProjects>> = [];
  let sanityCdnPosts = 0;
  let error = "";

  try {
    const allJournals = await listAllJournals();
    journalCounts = {
      total: allJournals.length,
      published: allJournals.filter((r) => r.status === "published").length,
      drafts: allJournals.filter((r) => r.status === "draft").length,
    };
    recentJournals = allJournals.slice(0, 6);
    sanityCdnPosts = allJournals.filter((row) =>
      collectJournalMediaUrls(row).some((url) => isSanityCdnUrl(url))
    ).length;
  } catch {
    error = "Could not load journal dashboard data. Please try again or contact support.";
  }

  try {
    const allProjects = await listAllProjects();
    projectCounts = {
      total: allProjects.length,
      published: allProjects.filter((r) => r.status === "published").length,
      drafts: allProjects.filter((r) => r.status === "draft").length,
    };
    recentProjects = allProjects.slice(0, 6);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not load project dashboard data.";
    error = error
      ? `${error} ${message}`
      : `${message} Run supabase/migrations/005_projects.sql if the projects table is missing.`;
  }

  return (
    <div>
      <p className="text-sm text-white/40">Overview</p>
      <h1 className="mt-2 text-4xl">Dashboard</h1>
      <p className="mt-3 max-w-2xl text-white/55">
        Manage journals and projects from one place. Media is stored as URLs in
        the database — usually your Supabase Storage bucket.
      </p>

      {sanityCdnPosts > 0 && (
        <p className="mt-4 max-w-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {sanityCdnPosts} journal post(s) still reference old Sanity CDN links. Edit those journals
          to use Supabase images, or contact support@pamafrica.com to re-sync media.
        </p>
      )}

      {error && (
        <p className="mt-8 border border-white/10 bg-white/5 px-4 py-3 text-sm">{error}</p>
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { label: "Journals published", value: journalCounts.published },
          { label: "Projects published", value: projectCounts.published },
          {
            label: "Total drafts",
            value: journalCounts.drafts + projectCounts.drafts,
          },
        ].map((item) => (
          <div key={item.label} className="border border-white/10 bg-[#131313] p-6">
            <p className="text-sm text-white/45">{item.label}</p>
            <p className="mt-3 text-4xl">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl">Recent journals</h2>
            <p className="mt-1 text-sm text-white/45">Latest updates across draft and published</p>
          </div>
          <Link
            href="/admin/journals"
            className="border border-white/20 px-5 py-2.5 text-sm hover:bg-white/5"
          >
            View all
          </Link>
        </div>

        {recentJournals.length === 0 ? (
          <p className="mt-6 border border-white/10 bg-[#131313] px-4 py-8 text-center text-white/45">
            No journals yet.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto border border-white/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[#131313] text-white/45">
                <tr>
                  <th className="px-4 py-3 font-normal">Cover</th>
                  <th className="px-4 py-3 font-normal">Title</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Category</th>
                  <th className="px-4 py-3 font-normal">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentJournals.map((journal, index) => (
                  <tr key={journal.id} className="border-t border-white/10">
                    <td className="px-4 py-3">
                      {journal.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={journal.cover}
                          alt=""
                          width={80}
                          height={56}
                          className="h-14 w-20 object-cover bg-white/5"
                          loading={index < 4 ? "eager" : "lazy"}
                          fetchPriority={index < 3 ? "high" : "auto"}
                          decoding={index < 4 ? "sync" : "async"}
                        />
                      ) : (
                        <span className="flex h-14 w-20 items-center justify-center bg-white/5 text-xs text-white/30">
                          No cover
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs">{journal.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs ${
                          journal.status === "published"
                            ? "bg-white text-black"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {journal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60">{journal.category}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/journals/${journal.id}`}
                        className="underline underline-offset-4"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl">Recent projects</h2>
            <p className="mt-1 text-sm text-white/45">
              Same create / edit / draft / publish flow as journals
            </p>
          </div>
          <Link
            href="/admin/projects"
            className="border border-white/20 px-5 py-2.5 text-sm hover:bg-white/5"
          >
            View all
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <p className="mt-6 border border-white/10 bg-[#131313] px-4 py-8 text-center text-white/45">
            No projects yet.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto border border-white/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[#131313] text-white/45">
                <tr>
                  <th className="px-4 py-3 font-normal">Cover</th>
                  <th className="px-4 py-3 font-normal">Title</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Type</th>
                  <th className="px-4 py-3 font-normal">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project, index) => (
                  <tr key={project.id} className="border-t border-white/10">
                    <td className="px-4 py-3">
                      {project.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.cover}
                          alt=""
                          width={80}
                          height={56}
                          className="h-14 w-20 object-cover bg-white/5"
                          loading={index < 4 ? "eager" : "lazy"}
                          fetchPriority={index < 3 ? "high" : "auto"}
                          decoding={index < 4 ? "sync" : "async"}
                        />
                      ) : (
                        <span className="flex h-14 w-20 items-center justify-center bg-white/5 text-xs text-white/30">
                          No cover
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs">{project.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs ${
                          project.status === "published"
                            ? "bg-white text-black"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60">{project.type}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="underline underline-offset-4"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/admin/journals/new" className="bg-white px-5 py-3 text-sm text-black">
          New journal
        </Link>
        <Link href="/admin/projects/new" className="bg-white px-5 py-3 text-sm text-black">
          New project
        </Link>
        <Link href="/admin/journals" className="border border-white/20 px-5 py-3 text-sm">
          View all journals
        </Link>
        <Link href="/admin/projects" className="border border-white/20 px-5 py-3 text-sm">
          View all projects
        </Link>
      </div>
    </div>
  );
}
