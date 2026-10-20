"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { ListeDeFondsQueryResult } from "@/sanity.types";
import clsx from "clsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  content: ListeDeFondsQueryResult;
};

export default function LDFDesktopSidebar({ content }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);

  const handleClickScroll = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
      e.preventDefault();
      setActiveIndex(index);
      const target = e.target as HTMLButtonElement;
      const id = target.textContent || "";
      const element = document.getElementById(id);

      if (element) {
        const yOffset = -143;
        const y =
          element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    [],
  );

  useGSAP(() => {
    buttonsRef.current.forEach((button, index) => {
      const id = button.textContent || "";
      const element = document.getElementById(id);

      if (element) {
        ScrollTrigger.create({
          // markers: true,
          trigger: element,
          start: "-19px center",
          end: "bottom center",
          onEnter: () => setActiveIndex(index),
          onLeaveBack: () => setActiveIndex(index - 1),
        });
      }
    });

    // Refresh ScrollTrigger after setting up all instances
    ScrollTrigger.refresh(true);
  });

  const uniqueCategories: { [key: string]: boolean } = {};
  const filteredContent = content?.contentModule
    ?.filter((item) => {
      if (item.category && !uniqueCategories[item.category]) {
        uniqueCategories[item.category] = true;
        return true;
      }
      return false;
    })
    .sort((a, b) => (a.category || "").localeCompare(b.category || "")); // Sort alphabetically by category

  return (
    <div className="relative hidden lg:block">
      <div className="sticky left-[calc(50%-720px)] top-[145px] ml-[3.5rem] flex w-full min-w-[13.5rem] max-w-[13.5rem] flex-col items-start gap-[1rem]">
        {filteredContent?.map((item, index) => (
          <button
            key={item.category}
            ref={(el) => {
              if (el) buttonsRef.current[index] = el;
            }}
            aria-label="Sidebar button"
            onClick={(e) => handleClickScroll(e, index)}
            className={clsx(
              "sidebarLDFButton whitespace-nowrap text-start",
              index === activeIndex ? "text-pink-arch" : "text-black",
            )}
          >
            {item.category}
          </button>
        ))}
      </div>
    </div>
  );
}
