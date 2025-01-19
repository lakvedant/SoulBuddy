
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import ParticleCanvas from "@/components/ParticleCanvas";
import HorizontalScroll from "@/components/HorizontalScroll";
import MeditationWalkthrough from "@/components/MeditationWalk";

export default function Home() {
  return (
    <>
      
      <main className="relative w-full h-screen overflow-hidden">
        <Navbar/>
      <ParticleCanvas />
    </main>
      <HorizontalScroll/>
      {/* <Chatbot /> */}
      {/* <MeditationWalkthrough/> */}
      
    </>
  );
}
