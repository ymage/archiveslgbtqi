"use client";
import React from "react";
import clsx from "clsx";

type HambugerButtonProps = {
  onclick?: () => void;
  menu: boolean;
  className?: string;
};

export default function HambugerButton({
  onclick,
  menu,
  className,
}: HambugerButtonProps) {
  return (
    <button aria-label="Menu" onClick={onclick} className={className}>
      <div
        className={clsx(
          "h-[1px] w-[30px] bg-white transition-transform duration-200 ease-tamisee",
          menu ? "translate-y-[9px] rotate-[45deg]" : "",
        )}
      />
      <div
        className={clsx(
          "h-[1px] w-[30px] bg-white transition-transform duration-200 ease-tamisee",
          menu ? "opacity-0" : "",
        )}
      />
      <div
        className={clsx(
          "h-[1px] w-[30px] bg-white transition-transform duration-200 ease-tamisee",
          menu ? "translate-y-[-9px] -rotate-[45deg]" : "",
        )}
      />
    </button>
  );
}
