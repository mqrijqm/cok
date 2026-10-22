import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import FlipTransition from "@/components/FlipTransition";
import MakingOf from "@/components/MakingOf";
import Collection from "@/components/Collection";
import Footer from "@/components/Footer";
import FlyingLayer from "@/components/FlyingLayer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <Story />
        <FlipTransition />
        <MakingOf />
        <Collection />
      </main>
      <Footer />
      <FlyingLayer />
    </>
  );
}
