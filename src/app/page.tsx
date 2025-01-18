
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import ParticleCanvas from "@/components/ParticleCanvas";


export default function Home() {
  return (
    <>
      
      <main className="relative w-full h-screen overflow-hidden">
        <Navbar/>
      <ParticleCanvas />
    </main>
      
      
    </>
  );
}