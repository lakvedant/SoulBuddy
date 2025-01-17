
import { Metadata } from "next";
import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/ui/footer";
import Chatbot from "@/components/Chatbot";


export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      <Chatbot />
      
      <Footer></Footer>
    </>
  );
}