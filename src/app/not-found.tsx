import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-cream)]">
      <div className="text-center max-w-md px-8">
        <p className="font-serif text-6xl font-bold text-[var(--accent)] mb-4">
          404
        </p>
        <h1 className="font-serif text-2xl font-bold mb-3">
          Pagina non trovata
        </h1>
        <p className="text-sm text-[var(--muted)] mb-8">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button as="a" href="/" variant="outline" size="lg">
            Torna alla Home
          </Button>
          <Button as="a" href="/prodotti" size="lg">
            Scopri i Prodotti
          </Button>
        </div>
      </div>
    </div>
  );
}
