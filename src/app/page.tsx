import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import FlipTransition from "@/components/FlipTransition";
import MakingOf from "@/components/MakingOf";
import Collection from "@/components/Collection";
import Footer from "@/components/Footer";
import FlyingLayer from "@/components/FlyingLayer";
import { fromTopUntil, whileVisible } from "@/lib/flyZones";

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <Hero />
        <Story />
        <FlipTransition />
        <MakingOf />
        <Collection />
      </main>
      <Footer />
      <FlyingLayer zones={[fromTopUntil("#story"), whileVisible("#contatto")]} />
    </>
  );
}
