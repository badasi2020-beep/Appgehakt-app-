import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, CalendarCheck, CheckCircle2, ListChecks, Settings } from "lucide-react";

const links = [
  { href: "/", label: "Heute", icon: CalendarCheck },
  { href: "/pool", label: "Pool", icon: CheckCircle2 },
  { href: "/dinge", label: "Dinge", icon: ListChecks },
  { href: "/verlauf", label: "Verlauf", icon: BookOpen },
  { href: "/einstellungen", label: "Einstellungen", icon: Settings }
];

// Die Bottom-Nav zeigt bewusst nur die 4 Hauptbereiche - Einstellungen sind seltener nötig und
// deshalb über das Zahnrad in der Topbar erreichbar (auf dem Handy ist die Sidebar ausgeblendet).
export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const currentLabel = links.find((link) => link.href === location)?.label;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand" data-testid="link-brand">
          <span className="brand-mark">
            <CheckCircle2 size={22} />
          </span>
          <span className="brand-name">Abgehakt</span>
        </Link>
        <nav className="nav">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${location === href ? "active" : ""}`}
              data-testid={`link-nav-${label.toLowerCase()}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">Dein persönliches Protokoll</div>
      </aside>
      <main className="main">
        <header className="topbar">
          <span className="topbar-kicker">{currentLabel || "Abgehakt"}</span>
          <Link href="/einstellungen" className="btn btn-ghost btn-icon" data-testid="link-settings-topbar" title="Einstellungen">
            <Settings size={18} />
          </Link>
        </header>
        {children}
        <nav className="mobile-nav">
          {links.slice(0, 4).map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={location === href ? "active" : ""} data-testid={`link-mobile-${label}`}>
              <Icon />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
