import { useState, type ReactNode } from "react";
import { Route, Switch, Router as WouterRouter, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { ErrorBoundary } from "./components/error-boundary";
import { Layout } from "./components/Layout";
import { HeutePage } from "./pages/HeutePage";
import { PoolPage } from "./pages/PoolPage";
import { DingePage } from "./pages/DingePage";
import { HistoryPage } from "./pages/HistoryPage";
import { NotFound } from "./pages/NotFound";
import { useStore } from "./store";

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  const { store, update } = useStore();
  const [notice, setNotice] = useState("");

  const notify = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2400);
  };

  return (
    <Layout>
      <Switch>
        <Route path="/">
          <HeutePage store={store} update={update} />
        </Route>
        <Route path="/pool">
          <PoolPage store={store} update={update} />
        </Route>
        <Route path="/dinge">
          <DingePage store={store} update={update} notify={notify} />
        </Route>
        <Route path="/verlauf">
          <HistoryPage store={store} update={update} />
        </Route>
        <Route component={NotFound} />
      </Switch>
      {notice && (
        <div className="toast-note" role="status" data-testid="status-toast">
          {notice}
        </div>
      )}
    </Layout>
  );
}

// Hash-basiertes Routing: funktioniert unabhängig davon, unter welchem Pfad die App
// gerade läuft (eigene Domain, Vorschau-Artefakt, ...).
export default function App() {
  return (
    <WouterRouter hook={useHashLocation}>
      <RoutedErrorBoundary>
        <Router />
      </RoutedErrorBoundary>
    </WouterRouter>
  );
}
