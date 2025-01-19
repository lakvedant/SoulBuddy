"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wind, Brain, Heart, Compass, Smile } from "lucide-react";
import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Register ScrollTrigger with GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Service = {
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  benefits: string[];
  path: string;
};

const services: Service[] = [
  {
    title: "Breathing Exercises",
    description: "Master various breathing techniques to reduce stress and anxiety",
    icon: Wind,
    benefits: ["Reduce stress and anxiety", "Improve focus and concentration", "Enhance sleep quality"],
    path: "/services/breathing",
  },
  {
    title: "Meditation Sessions",
    description: "Guided meditation sessions for inner peace and mindfulness",
    icon: Brain,
    benefits: ["Practice mindfulness", "Find inner peace", "Develop emotional balance"],
    path: "/services/meditation",
  },
  {
    title: "Heart Rate Training",
    description: "Learn to control and monitor your heart rate for better health",
    icon: Heart,
    benefits: ["Monitor stress levels", "Improve cardiovascular health", "Better emotional regulation"],
    path: "/services/heart-rate",
  },
  {
    title: "Guided Journeys",
    description: "Take guided mental journeys for relaxation and self-discovery",
    icon: Compass,
    benefits: ["Deep relaxation", "Self-discovery", "Mental clarity"],
    path: "/services/journeys",
  },
  {
    title: "Mood Tracking",
    description: "Track and understand your emotional patterns",
    icon: Smile,
    benefits: ["Emotional awareness", "Pattern recognition", "Better self-understanding"],
    path: "/services/mood",
  },
];

export default function HorizontalScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      {
        translateX: 0,
      },
      {
        translateX: `-${(services.length - 1) * 100}vw`,
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => `+=${(services.length - 1) * window.innerWidth*0.2}`,
          scrub: 0.6,
          pin: true,
        },
      }
    );

    return () => {
      pin.kill();
    };
  }, []);

  return (
    <section className="overflow-hidden text-white bg-gradient-to-br from-purple-800  via-purple-950 to-purple-900">
      <div ref={triggerRef}>
        <div
          ref={sectionRef}
          className="relative flex h-screen items-center gap-8 px-8"
        >
          {services.map((service) => (
            <Link href={service.path} key={service.title}>
              <div
                className="relative h-[450px] w-[400px] flex-shrink-0 rounded-2xl bg-gradient-to-br from-purple-400 via-purple-500 to-purple-400 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
              >
                {/* Lottie Animation */}
                <div>
                  <DotLottieReact
                    src="https://lottie.host/48c4fb5e-9760-4dda-833a-a93d2798baf1/ryH1W2AHdx.lottie"
                    loop
                    autoplay
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 p-6 flex flex-col justify-end text-white">
                  <div className="flex items-center mb-10">
                    <service.icon className="w-12 h-12 text-white" />
                    <h3 className="ml-4 text-2xl font-bold">{service.title}</h3>
                  </div>
                  <p className="text-sm opacity-90 mb-8">{service.description}</p>
                  <ul className="text-xs space-y-1 list-disc ml-4">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-white">
                        <span className="mr-2">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
