"use client";

import { useRef, useState } from "react";
import PageHero from "./PageHero";
import { useRise } from "./useRise";
import { ATELIER, CONTACT, CONTATTO } from "@/lib/content";

const REASONS = ["A tasting at the atelier", "A box for an occasion", "Weddings & hotels", "Just saying hello"];

const field =
  "w-full rounded-[10px] border-[1.5px] border-magenta bg-transparent px-4 py-3.5 text-[15px] text-magenta outline-none placeholder:text-magenta focus-visible:bg-magenta focus-visible:text-beige focus-visible:placeholder:text-beige";

/** No backend: the form composes an email in the visitor's own mail app. */
export default function ContattoView() {
  const root = useRef<HTMLDivElement>(null);
  const [reason, setReason] = useState(REASONS[0]);
  useRise(root);

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = [`Name: ${d.get("name")}`, `Email: ${d.get("email")}`, `Guests: ${d.get("guests")}`, `Preferred date: ${d.get("date")}`, "", String(d.get("message") ?? "")].join("\n");
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(reason)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div ref={root}>
      <PageHero kicker={CONTATTO.kicker} serif={CONTATTO.serif} lines={CONTATTO.title} intro={CONTATTO.intro} />

      <section data-nav="light" className="grid gap-16 bg-beige px-[var(--gutter)] py-[14vh] text-magenta md:grid-cols-[1fr_1.3fr] [&>*]:min-w-0">
        <div className="space-y-12">
          <div className="rise">
            <p className="label">Email</p>
            <a href={`mailto:${CONTACT.email}`} className="display link-under mt-3 inline-block text-[clamp(30px,3.4vw,56px)] leading-none normal-case">
              {CONTACT.email}
            </a>
          </div>
          <div className="rise">
            <p className="label">Atelier</p>
            <ul className="mt-3 border-b-[1.5px] border-magenta">
              {ATELIER.visit.hours.map(([d, h]) => (
                <li key={d} className="flex justify-between border-t-[1.5px] border-magenta py-3 text-[14px]">
                  <span>{d}</span>
                  <span className="font-bold">{h}</span>
                </li>
              ))}
            </ul>
            <p className="label mt-3">Oltrarno · Firenze</p>
          </div>
          <div className="rise label flex gap-6">
            <a href={CONTACT.instagram} className="link-under">
              Instagram
            </a>
            <a href={CONTACT.pinterest} className="link-under">
              Pinterest
            </a>
          </div>
        </div>

        <form onSubmit={send} className="rise min-w-0 space-y-5">
          <fieldset className="min-w-0">
            <legend className="label mb-4">What is it about?</legend>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={reason === r}
                  onClick={() => setReason(r)}
                  className={`rounded-full border-[1.5px] border-magenta px-4 py-2.5 text-[13px] transition-colors ${reason === r ? "bg-magenta text-beige" : ""}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="label mb-2 block">Name</span>
              <input name="name" required autoComplete="name" className={field} />
            </label>
            <label className="block">
              <span className="label mb-2 block">Email</span>
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="block">
              <span className="label mb-2 block">Guests</span>
              <select name="guests" className={field} defaultValue="2">
                {["1", "2", "3", "4"].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label mb-2 block">Preferred date</span>
              <input name="date" type="date" className={field} />
            </label>
          </div>
          <label className="block">
            <span className="label mb-2 block">Message</span>
            <textarea name="message" rows={5} className={`${field} resize-none`} />
          </label>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="submit" className="btn btn-dark">
              Send <span aria-hidden>→</span>
            </button>
            <span className="text-[12px]">Opens your email app with everything filled in.</span>
          </div>
        </form>
      </section>
    </div>
  );
}
