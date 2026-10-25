"use client";
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { HomepageQueryResult } from "@/sanity.types";
import clsx from "clsx";

import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

import HeaderTransitionLink from "../../header/HeaderTransitionLink";

type Props = {
  heroes: HomepageQueryResult;
};

export default function HeroDesktop({ heroes }: Props) {
  const [currentHero, setCurrentHero] = useState(1);

  const containerRefs = useRef<HTMLDivElement[]>([]);
  const boxRefs = useRef<HTMLAnchorElement[]>([]);
  const imageRefs = useRef<HTMLImageElement[]>([]);

  gsap.registerPlugin(Observer);

  useGSAP(() => {
    gsap.to(containerRefs.current, {
      width: (index) => (index === currentHero ? "100%" : "3rem"),
      duration: 0.15,
      ease: "power4.inOut",
    });
    gsap.to(boxRefs.current, {
      opacity: (index) => (index === currentHero ? 1 : 0),
      duration: 0.25,
      delay: 0.25,
    });
  }, [heroes, currentHero]);

  // 👇🏽 auto slide
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentHero((prevHero) => (prevHero + 1) % heroes?.hero?.length!);
  //   }, 20000);

  //   return () => clearInterval(interval);
  // }, [heroes]);

  useEffect(() => {
    if (heroes && heroes.hero && heroes.hero.length > 0) {
      const interval = setInterval(() => {
        setCurrentHero((prevHero) => (prevHero + 1) % heroes?.hero?.length!);
      }, 20000);

      return () => clearInterval(interval);
    }
  }, [heroes]);

  // console.log("currentHero: ", currentHero);

  return (
    <div className="relative hidden max-h-[calc(100vh-6rem)] min-h-[calc(100vh-6rem)] min-w-[100vw] lg:flex">
      {heroes?.hero?.map((hero, index) => (
        <div
          key={index}
          ref={(el) => {
            containerRefs.current[index] = el!;
          }}
          className={clsx(
            "relative h-full max-h-[calc(100dvh-5rem)] w-full overflow-hidden transition-all duration-[.75s] ease-in-out lg:max-h-[calc(100vh-6rem)]",
            currentHero === index ? "!cursor-auto" : "",
            currentHero === 0 && index === 1 && "cursor-w-resize",
            currentHero === 0 && index === 2 && "cursor-w-resize",
            currentHero === 1 && index === 0 && "cursor-e-resize",
            currentHero === 1 && index === 2 && "cursor-w-resize",
            currentHero === 2 && index === 0 && "cursor-e-resize",
            currentHero === 2 && index === 1 && "cursor-e-resize",
          )}
          onClick={() => setCurrentHero(index)}
        >
          <div
            className={clsx(
              "absolute inset-0 top-0 h-full w-full bg-pink-arch transition-opacity duration-300 ease-tamisee",
              currentHero === index
                ? "opacity-0"
                : "z-10 opacity-0 mix-blend-multiply hover:opacity-100",
            )}
          />
          <div className="overflow-hidden">
            <HeaderTransitionLink
              ref={(el) => {
                boxRefs.current[index] = el!;
              }}
              href={
                hero?.cta?.ctaLink?._type === "pages"
                  ? `/${hero.cta?.ctaLink?.slug || ""}`
                  : hero?.cta?.ctaLink?._type === "events"
                    ? `/agenda/${hero.cta?.ctaLink?.slug || ""}`
                    : hero?.cta?.ctaLink?._type === "blogs"
                      ? `/blog/${hero.cta?.ctaLink?.slug || ""}`
                      : "#"
              }
              className={clsx(
                "absolute bottom-[3rem] left-[2rem] z-20 flex max-h-[15rem] min-h-[15rem] w-[80%] min-w-[80%] max-w-[80%] flex-col items-start space-y-[.5rem] bg-black p-[2rem] text-white transition-[opacity,colors] duration-300 ease-tamisee hover:text-pink-arch",
                currentHero === index ? "block" : "hidden",
              )}
            >
              <h1 className="heroTitle transition-none will-change-transform">
                {hero.title}
              </h1>

              <p className="heroParagraph transition-none will-change-transform">
                {hero.paragraph}
              </p>
              <div className="heroCta absolute bottom-0 right-0 translate-y-[99%] bg-black px-[1.25rem] pb-[.75rem]">
                {hero.cta?.ctaLabel} [+]
              </div>
            </HeaderTransitionLink>
          </div>

          {hero.image && (
            <>
              <Image
                ref={(el) => {
                  if (el) {
                    imageRefs.current[index] = el;
                  }
                }}
                src={
                  hero.image.imageUrl || "https://via.placeholder.com/1920x1080"
                }
                alt={hero.image.alt || ""}
                width={currentHero === index ? 960 : 480}
                height={currentHero === index ? 540 : 270}
                priority
                className={clsx(
                  "h-full min-h-[calc(100vh-6rem)] w-full object-cover object-center",
                  currentHero === index ? "grayscale-0" : "grayscale",
                )}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}
