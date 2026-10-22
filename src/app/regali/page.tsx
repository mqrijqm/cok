import type { Metadata } from "next";
import RegaliView from "@/components/page/RegaliView";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Regali & abbonamento",
  description: "Single editions, the full collection box, monthly subscriptions and gifts for weddings, hotels and brands.",
};

export default function RegaliPage() {
  return (
    <>
      <main>
        <RegaliView />
      </main>
      <Footer />
    </>
  );
}
