import { Link } from "wouter";

export function NotFound() {
  return (
    <div className="content">
      <div className="empty">
        <strong>Seite nicht gefunden.</strong>
        <p style={{ marginTop: 6 }}>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 10, display: "inline-flex" }}>
            Zurück zu Heute
          </Link>
        </p>
      </div>
    </div>
  );
}
