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
  lottieSrc: string;
};

const services: Service[] = [
  {
    title: "Breathing Exercises",
    description: "Master various breathing techniques to reduce stress and anxiety",
    icon: Wind,
    benefits: ["Reduce stress and anxiety", "Improve focus and concentration", "Enhance sleep quality"],
    path: "/services/breathing",
    lottieSrc: "https://lottie.host/2f09368f-f934-4195-8ea3-e69b2b66a929/Rmlz6FMeP6.lottie",
  },
  {
    title: "Meditation Sessions",
    description: "Guided meditation sessions for inner peace and mindfulness",
    icon: Brain,
    benefits: ["Practice mindfulness", "Find inner peace", "Develop emotional balance"],
    path: "/services/meditation",
    lottieSrc: "https://lottie.host/48c4fb5e-9760-4dda-833a-a93d2798baf1/ryH1W2AHdx.lottie",
  },
  {
    title: "Know Your Horoscope",
    description: "Learn to control and monitor your heart rate for better health",
    icon: Heart,
    benefits: ["Monitor stress levels", "Improve cardiovascular health", "Better emotional regulation"],
    path: "/services/heart-rate",
    lottieSrc: "https://lottie.host/0137f268-134b-436c-a056-617de7654c2c/kUDmIOBdqc.lottie",
  },
  {
    title: "Your Gemstones",
    description: "Take guided mental journeys for relaxation and self-discovery",
    icon: Compass,
    benefits: ["Deep relaxation", "Self-discovery", "Mental clarity"],
    path: "/services/journeys",
    lottieSrc: "https://lottie.host/48c4fb5e-9760-4dda-833a-a93d2798baf1/ryH1W2AHdx.lottie",
  },
  {
    title: "Mood Tracking",
    description: "Track and understand your emotional patterns",
    icon: Smile,
    benefits: ["Emotional awareness", "Pattern recognition", "Better self-understanding"],
    path: "/services/mood",
    lottieSrc: "https://lottie.host/2f09368f-f934-4195-8ea3-e69b2b66a929/Rmlz6FMeP6.lottie",
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
        translateX: `-${(services.length - 1) * 11}vw`,
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => `+=${(services.length - 1) * window.innerWidth * 0.15}`,
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
    <section className="overflow-hidden text-white bg-gradient-to-br from-purple-800 via-purple-950 to-purple-900">
      <div ref={triggerRef}>
        <div
          ref={sectionRef}
          className="relative flex h-screen items-center gap-8 px-8"
        >
          {services.map((service) => (
            <Link href={service.path} key={service.title}>
              <div className="relative h-[450px] w-[400px] flex-shrink-0 rounded-2xl bg-gradient-to-br from-purple-400 via-purple-500 to-purple-400 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
                {/* Lottie Animation */}
                <div className="relative w-full h-1/2">
                  <DotLottieReact
                    src={service.lottieSrc}
                    loop
                    autoplay
                    className="absolute inset-0"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 p-6 flex flex-col justify-end text-white">
                  <div className="flex items-center mb-6">
                    <service.icon className="w-10 h-10 text-white" />
                    <h3 className="ml-4 text-xl font-bold">{service.title}</h3>
                  </div>
                  <p className="text-sm opacity-90 mb-4">{service.description}</p>
                  <ul className="text-xs space-y-1 list-disc ml-4">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="text-white">
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
