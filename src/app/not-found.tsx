import TLink from "@/components/TLink";

export default function NotFound() {
  return (
    <main data-nav="dark" className="flex min-h-[100svh] flex-col justify-end bg-magenta px-[var(--gutter)] pb-10 pt-[120px] text-beige">
      <p className="label mb-auto">404 · Pagina non trovata</p>
      <p className="serif text-[clamp(48px,7vw,130px)] leading-none">this page</p>
      <h1 className="display text-[clamp(90px,22vw,420px)] leading-[0.8] tracking-[-0.07em]">Melted</h1>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <TLink href="/" label="Avorio" className="btn">
          Back to the atelier <span aria-hidden>→</span>
        </TLink>
        <TLink href="/collezione" label="Collezione" className="btn btn-ghost">
          See the collection
        </TLink>
      </div>
    </main>
  );
}
