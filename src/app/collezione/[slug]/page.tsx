import { Fragment, Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditionView from "@/components/page/EditionView";
import Footer from "@/components/Footer";
import FlyingLayer from "@/components/FlyingLayer";
import { whileVisible } from "@/lib/flyZones";
import { EDITION_DETAILS, editionBySlug } from "@/lib/editions";

export function generateStaticParams() {
  return EDITION_DETAILS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collezione/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = editionBySlug(slug);
  if (!e) return {};
  return { title: `${e.name} · ${e.flavour}`, description: `${e.n} ${e.name}: ${e.flavour}. ${e.tagline}` };
}

function Edition({ slug }: { slug: string }) {
  const index = EDITION_DETAILS.findIndex((e) => e.slug === slug);
  if (index < 0) notFound();
  const next = EDITION_DETAILS[(index + 1) % EDITION_DETAILS.length];

  // Keyed by slug so moving between editions rebuilds every animation.
  return (
    <Fragment key={slug}>
      <main>
        <EditionView e={EDITION_DETAILS[index]} index={index} next={next} />
      </main>
      <Footer />
      <FlyingLayer zones={[whileVisible("#ed-hero"), whileVisible("#contatto")]} />
    </Fragment>
  );
}

// The slug-dependent part streams inside Suspense; known slugs are prerendered anyway.
export default function EditionPage({ params }: PageProps<"/collezione/[slug]">) {
  return (
    <Suspense fallback={<main className="min-h-[100svh] bg-magenta" />}>
      {params.then(({ slug }) => (
        <Edition slug={slug} />
      ))}
    </Suspense>
  );
}
