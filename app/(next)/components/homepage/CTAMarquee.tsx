import React from "react";
import Link from "next/link";
import { HomepageQueryResult } from "@/sanity.types";
import { safeHref } from "@/app/(next)/utils/safeHref";

type CTAMarqueeProps = {
  marquee: HomepageQueryResult;
};

export default function CTAMarquee({ marquee }: CTAMarqueeProps) {
  return (
    <>
      {marquee?.marqueeCTA?.marqueeCTAVisibility && (
        <Link
          href={safeHref(marquee?.marqueeCTA?.marqueeLink)}
          className="marquee-container group flex h-[40px] w-full items-center bg-pink-arch"
        >
          <div className="marquee mt-[.5rem] whitespace-nowrap font-cityburn text-[1.5rem] leading-[1rem] tracking-wider text-white transition-colors duration-100 ease-tamisee group-hover:text-black">
            {marquee?.marqueeCTA?.marqueeContent}
          </div>
          <div className="marquee mt-[.5rem] whitespace-nowrap font-cityburn text-[1.5rem] leading-[1rem] tracking-wider text-white transition-colors duration-100 ease-tamisee group-hover:text-black">
            {marquee?.marqueeCTA?.marqueeContent}
          </div>
          <div className="marquee mt-[.5rem] whitespace-nowrap font-cityburn text-[1.5rem] leading-[1rem] tracking-wider text-white transition-colors duration-100 ease-tamisee group-hover:text-black">
            {marquee?.marqueeCTA?.marqueeContent}
          </div>
          <div className="marquee mt-[.5rem] whitespace-nowrap font-cityburn text-[1.5rem] leading-[1rem] tracking-wider text-white transition-colors duration-100 ease-tamisee group-hover:text-black">
            {marquee?.marqueeCTA?.marqueeContent}
          </div>
          <div className="marquee mt-[.5rem] whitespace-nowrap font-cityburn text-[1.5rem] leading-[1rem] tracking-wider text-white transition-colors duration-100 ease-tamisee group-hover:text-black">
            {marquee?.marqueeCTA?.marqueeContent}
          </div>
          <div className="marquee mt-[.5rem] whitespace-nowrap font-cityburn text-[1.5rem] leading-[1rem] tracking-wider text-white transition-colors duration-100 ease-tamisee group-hover:text-black">
            {marquee?.marqueeCTA?.marqueeContent}
          </div>
        </Link>
      )}
    </>
  );
}
