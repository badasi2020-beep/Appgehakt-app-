import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, CheckCircle2, ListChecks } from "lucide-react";

const links = [
  { href: "/", label: "Heute", icon: CheckCircle2 },
  { href: "/dinge", label: "Dinge", icon: ListChecks },
  { href: "/verlauf", label: "Verlauf", icon: BookOpen }
];

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
        </header>
        {children}
        <nav className="mobile-nav">
          {links.map(({ href, label, icon: Icon }) => (
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
