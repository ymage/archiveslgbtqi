"use client";
import React, { useState } from "react";
import clsx from "clsx";

import { PortableTextBlock } from "next-sanity";

import { MyCustomPortableText } from "../ui";

type CreationArchivesModuleProps = {
  intro: PortableTextBlock[];
  archive: {
    title: string;
    description: PortableTextBlock[];
    status: string;
  }[];
};

export default function CreationArchivesModule({
  intro,
  archive,
}: CreationArchivesModuleProps) {
  const [archiveIndex, setArchiveIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (archiveIndex === index) {
      setArchiveIndex(null);
    } else {
      setArchiveIndex(index);
    }
  };
  return (
    <div className="flex min-w-full flex-col gap-[1rem] py-[1rem]">
      <MyCustomPortableText
        value={intro}
        className="richText min-w-full pb-[1.5rem]"
      />
      <ul className="divide-y-[2px] divide-black border-y-[2px] border-black will-change-transform">
        {archive?.map((archiveItem, index) => (
          <button
            key={index}
            aria-label="Boutton des archives"
            onClick={() => handleClick(index)}
            className={clsx(
              "relative flex w-full flex-col items-start justify-start overflow-hidden py-[1rem] text-start transition-[max-height] duration-[.75s] ease-in-out",
              archiveIndex === index
                ? "max-h-[30rem] hover:bg-white hover:text-black lg:max-h-[15rem]"
                : "max-h-[2.15rem] hover:bg-pink-arch hover:text-white lg:max-h-[2.75rem]",
            )}
          >
            <div className="absolute left-0 top-[.4rem] flex w-full items-center justify-between px-[1rem] lg:top-[.5rem]">
              <h3 className="lg:max-w-auto deroulantTitle max-w-[95%] overflow-hidden">
                {archiveItem.title}
              </h3>
              <div className="relative flex translate-y-[-.1rem] items-center lg:gap-[1rem]">
                <span className="hidden font-jetbrains text-[.6rem] uppercase leading-[1rem] tracking-wider lg:block">
                  {archiveItem.status}
                </span>
                <div
                  className={clsx(
                    "text-[.8rem] transition-transform duration-[.5s] ease-tamisee",
                    archiveIndex === index ? "rotate-[135deg]" : "rotate-0",
                  )}
                >
                  +
                </div>
              </div>
            </div>
            <li className="w-full py-[2rem] lg:max-w-[80%] lg:py-[2.5rem]">
              <span className="block pb-[1rem] font-jetbrains text-[.6rem] uppercase leading-[1rem] tracking-wider lg:hidden">
                {archiveItem.status}
              </span>
              <MyCustomPortableText
                value={archiveItem.description}
                className="richText min-w-full"
              />
            </li>
          </button>
        ))}
      </ul>
    </div>
  );
}
