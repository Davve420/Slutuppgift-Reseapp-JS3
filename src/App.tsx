import { ArrowRight, Compass, Plane } from "lucide-react";
import { Link, Route, Routes } from "react-router-dom";
import CountryDetailPage from "./pages/CountryDetailPage";
import CountryListPage from "./pages/CountryListPage";

function SiteHeader() {
  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="page-shell flex h-[4.5rem] items-center justify-between">
        <Link className="brand-link" to="/" aria-label="Världsvän, till startsidan">
          <span className="brand-mark" aria-hidden="true">
            <Plane size={19} strokeWidth={2.4} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            världsvän<span className="text-coral">.</span>
          </span>
        </Link>
        <nav aria-label="Huvudnavigation">
          <Link className="nav-link" to="/">
            <Compass size={17} aria-hidden="true" />
            <span>Upptäck</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NotFoundPage() {
  return (
    <main className="page-shell py-16">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-card">
        <p className="eyebrow">404 · Fel väg?</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">
          Den sidan finns inte
        </h1>
        <Link className="button-primary mt-7" to="/">
          Till startsidan
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Routes>
        <Route path="/" element={<CountryListPage />} />
        <Route path="/country/:code" element={<CountryDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="page-shell py-8 text-center text-xs text-ink/55">
        Världsvän · En reseapp under uppbyggnad
      </footer>
    </div>
  );
}
