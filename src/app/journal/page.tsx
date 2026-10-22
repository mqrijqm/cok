import type { Metadata } from "next";
import JournalIndex from "@/components/page/JournalIndex";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes from the atelier: what white chocolate really is, how tempering works, and how to taste it.",
};

export default function JournalPage() {
  return (
    <>
      <main>
        <JournalIndex />
      </main>
      <Footer />
    </>
  );
}
