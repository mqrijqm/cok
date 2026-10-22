import { Fragment, Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/page/ArticleView";
import Footer from "@/components/Footer";
import { ARTICLES, articleBySlug } from "@/lib/journal";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) return {};
  return { title: a.title, description: a.excerpt };
}

function Article({ slug }: { slug: string }) {
  const index = ARTICLES.findIndex((a) => a.slug === slug);
  if (index < 0) notFound();
  const next = ARTICLES[(index + 1) % ARTICLES.length];

  // Keyed by slug so moving between notes rebuilds every animation.
  return (
    <Fragment key={slug}>
      <main>
        <ArticleView a={ARTICLES[index]} next={next} />
      </main>
      <Footer />
    </Fragment>
  );
}

// The slug-dependent part streams inside Suspense; known slugs are prerendered anyway.
export default function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <Suspense fallback={<main className="min-h-[100svh] bg-beige" />}>
      {params.then(({ slug }) => (
        <Article slug={slug} />
      ))}
    </Suspense>
  );
}
