"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AdminRole } from "@/lib/auth/users";
import {
  FileText,
  FolderKanban,
  Images,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Users,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/journals", label: "Journals", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/team", label: "Team", icon: Users, superOnly: true },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
];

export default function AdminShell({
  email,
  role,
  children,
}: {
  email?: string;
  role?: AdminRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-dvh bg-[#000000] font-[family-name:var(--font-helvetica-now)] text-white">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-white/10 bg-[#131313] px-6 py-8 md:flex md:flex-col">
        <Link href="/admin" className="text-xl font-medium tracking-tight">
          PAM Admin
        </Link>
        <p className="mt-2 text-sm text-white/45">Content CMS</p>
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {nav
            .filter((item) => !item.superOnly || role === "super_admin")
            .map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 pt-4">
          <p className="truncate text-xs text-white/40">{email}</p>
          <button
            type="button"
            onClick={signOut}
            className="mt-3 flex w-full items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#000000]/90 px-4 py-4 backdrop-blur md:hidden">
          <Link href="/admin" className="font-medium">
            PAM Admin
          </Link>
          <button type="button" onClick={signOut} className="text-sm text-white/70">
            Sign out
          </button>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3 md:hidden">
          {nav
            .filter((item) => !item.superOnly || role === "super_admin")
            .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap px-3 py-1.5 text-sm ${
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href))
                  ? "bg-white text-black"
                  : "bg-white/5 text-white/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="px-4 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
