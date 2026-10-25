/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useRef } from "react";

import Link from "next/link";
import Image from "next/image";

import { HomepageQueryResult } from "@/sanity.types";
import HeaderTransitionLink from "../header/HeaderTransitionLink";

type Props = {
  multiBlocks: HomepageQueryResult;
};

type ScrollButtonProps = {
  to: string;
  targetId: string;
  children: React.ReactNode;
  className?: string;
};

const ScrollButton = ({
  to,
  targetId,
  children,
  className,
}: ScrollButtonProps) => {
  return (
    <Link href={`${to}#${targetId}`} passHref className={className}>
      {children}
    </Link>
  );
};

export default function SecondSection({ multiBlocks }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {multiBlocks?.secondPartVisibility && (
        <div
          ref={containerRef}
          className="mx-auto grid min-h-full max-w-[1440px] grid-cols-1 place-content-center place-items-center gap-[5rem] px-[1rem] py-[4rem] lg:grid-cols-2 lg:px-[3rem]"
        >
          {multiBlocks?.secondPart?.map((block, index) => {
            return (
              <>
                {block.cta?.ctaScrollTo ? (
                  <ScrollButton
                    key={index}
                    to={block.cta?.ctaLink?.slug || ""}
                    targetId={block.cta?.ctaScrollTo || ""}
                    className="group relative flex aspect-square h-max max-h-[80rem] w-full flex-col lg:max-h-[50rem] lg:max-w-[50rem]"
                  >
                    <div className="relative min-h-[75%] min-w-full">
                      <Image
                        src={block.image?.imageUrl || ""}
                        alt={block.image?.alt || ""}
                        width={300}
                        height={300}
                        className="absolute inset-0 z-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 z-0 h-full w-full bg-black/20 transition-[background] duration-300 ease-tamisee group-hover:bg-black/10" />
                      <div className="] absolute bottom-[1rem] left-[1rem]">
                        <h2 className="heroTitle text-white-primary transition-colors duration-300 ease-tamisee group-hover:text-pink-arch">
                          {block.title === "La plateforme d’archives orales" ? (
                            <>
                              La plateforme <br /> d'archives orales
                            </>
                          ) : (
                            block.title
                          )}
                        </h2>
                      </div>
                    </div>
                    <div className="relative flex min-h-[25%] flex-col items-end justify-start text-white transition-colors duration-300 ease-tamisee group-hover:text-pink-arch">
                      <div className="flex-1 bg-black p-[1rem]">
                        <p className="heroParagraph">{block.paragraph}</p>
                      </div>
                      <div className="heroCta absolute bottom-0 right-0 translate-y-[99%] bg-black px-[1.25rem] pb-[.75rem]">
                        {block.cta?.ctaLabel} [+]
                      </div>
                    </div>
                  </ScrollButton>
                ) : (
                  <HeaderTransitionLink
                    key={index}
                    href={block.cta?.ctaLink?.slug || ""}
                    className="group relative flex aspect-square h-max max-h-[80rem] w-full flex-col lg:max-h-[50rem] lg:max-w-[50rem]"
                  >
                    <div className="relative min-h-[75%] min-w-full">
                      <Image
                        src={block.image?.imageUrl || ""}
                        alt={block.image?.alt || ""}
                        width={300}
                        height={300}
                        className="absolute inset-0 z-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 z-0 h-full w-full bg-black/20 transition-[background] duration-300 ease-tamisee group-hover:bg-black/10" />
                      <div className="] absolute bottom-[1rem] left-[1rem]">
                        <h2 className="heroTitle text-white-primary transition-colors duration-300 ease-tamisee group-hover:text-pink-arch">
                          {block.title === "La plateforme d’archives orales" ? (
                            <>
                              La plateforme <br /> d'archives orales
                            </>
                          ) : (
                            block.title
                          )}
                        </h2>
                      </div>
                    </div>
                    <div className="relative flex min-h-[25%] flex-col items-end justify-start text-white transition-colors duration-300 ease-tamisee group-hover:text-pink-arch">
                      <div className="flex-1 bg-black p-[1rem]">
                        <p className="heroParagraph">{block.paragraph}</p>
                      </div>
                      <div className="heroCta absolute bottom-0 right-0 translate-y-[99%] bg-black px-[1.25rem] pb-[.75rem]">
                        {block.cta?.ctaLabel} [+]
                      </div>
                    </div>
                  </HeaderTransitionLink>
                )}
              </>
            );
          })}
        </div>
      )}
    </>
  );
}
