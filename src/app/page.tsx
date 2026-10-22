import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Atelier from "@/components/Atelier";
import Craft from "@/components/Craft";
import Showcase from "@/components/Showcase";
import Collection from "@/components/Collection";
import Ritual from "@/components/Ritual";
import Subscription from "@/components/Subscription";
import Muse from "@/components/Muse";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <Atelier />
        <Craft />
        <Showcase />
        <Collection />
        <Ritual />
        <Subscription />
        <Muse />
      </main>
      <Footer />
    </>
  );
}
