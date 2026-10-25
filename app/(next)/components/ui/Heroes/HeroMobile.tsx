"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HomepageQueryResult } from "@/sanity.types";

type Props = {
  heroes: HomepageQueryResult;
};

export default function HeroDesktop({ heroes }: Props) {
  return (
    <div className="relative flex w-full lg:hidden">
      <div className="relative flex min-w-full snap-y snap-mandatory flex-col overflow-y-auto overflow-x-hidden">
        {heroes?.hero?.map((hero, index) => (
          <div
            key={index}
            className="relative h-full min-h-[100svh] min-w-[100vw] snap-start scroll-auto"
          >
            <div className="group absolute inset-x-0 top-[1rem] flex flex-col items-end px-[1rem] text-white opacity-100 transition-all duration-500 ease-tamisee">
              <div className="min-h-[10rem] min-w-full space-y-[.5rem] bg-black p-[2rem]">
                <h1 className="heroTitle">{hero.title}</h1>
                <p className="heroParagraph">{hero.paragraph}</p>
              </div>

              <div className="relative w-fit translate-y-[-25%] overflow-hidden bg-black pb-[.5rem] transition-all duration-200 ease-tamisee">
                <Link
                  href={
                    hero?.cta?.ctaLink?._type === "pages"
                      ? `/${hero.cta?.ctaLink?.slug || ""}`
                      : hero?.cta?.ctaLink?._type === "events"
                        ? `/agenda/${hero.cta?.ctaLink?.slug || ""}`
                        : hero?.cta?.ctaLink?._type === "blogs"
                          ? `/blog/${hero.cta?.ctaLink?.slug || ""}`
                          : "#"
                  }
                  className="heroCta relative z-10 h-full w-full px-[2rem]"
                >
                  {hero.cta?.ctaLabel} [+]
                </Link>
              </div>
            </div>

            {hero.image && (
              <Image
                src={
                  hero.image.imageUrl || "https://via.placeholder.com/1920x1080"
                }
                alt={hero.image.alt || ""}
                width={350}
                height={350}
                priority={true}
                loading="eager"
                className="h-full min-h-full w-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
