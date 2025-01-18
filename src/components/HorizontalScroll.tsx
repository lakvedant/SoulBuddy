"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Register ScrollTrigger with GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Card {
  id: number;
  title: string;
  description: string;
  image: string;
}

const cards: Card[] = [
  {
    id: 1,
    title: "Nature's Beauty",
    description: "Explore the wonders of nature",
    image: "/images/hero.svg",
  },
  {
    id: 2,
    title: "Mountain Vista",
    description: "Majestic mountain landscapes",
    image: "/images/hero.svg",
  },
  {
    id: 3,
    title: "Forest Dreams",
    description: "Deep in the mystical forest",
    image: "/images/hero.svg",
  },
  {
    id: 4,
    title: "Ocean Waves",
    description: "Serene ocean views",
    image: "/images/hero.svg",
  },
  {
    id: 5,
    title: "Desert Sands",
    description: "Endless desert horizons",
    image: "/images/hero.svg",
  },
  {
    id: 6,
    title: "Sunset Glory",
    description: "Beautiful sunset moments",
    image: "/images/hero.svg",
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
        translateX: "-300vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "2000 top",
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
    <section className="overflow-hidden">
      <div ref={triggerRef}>
        <div
          ref={sectionRef}
          className="relative flex h-screen items-center gap-8 px-8"
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative h-[450px] w-[400px] flex-shrink-0 rounded-2xl bg-white shadow-xl overflow-hidden group"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60">
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                  <p className="text-sm opacity-90">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
