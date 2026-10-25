"use client";
import React from "react";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { SettingsQueryResult } from "@/sanity.types";

import clsx from "clsx";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import InternalLink from "./InternalLink";
import ExternalLink from "./ExternalLink";

import HeaderTransitionLink from "./HeaderTransitionLink";
import Link from "next/link";
import Logo from "../ui/icon/Logo";

type NavLinkProps = {
  settings: SettingsQueryResult;
};

export default function NavDesktop({ settings }: NavLinkProps) {
  const headerContainerRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    gsap.set(headerContainerRef.current, { y: "-100%" });
    gsap.to(headerContainerRef.current, { y: 0, duration: 1 });
  }); // <-- scope is for selector text (optional)

  return (
    <header
      id="nav-desktop"
      ref={headerContainerRef}
      className="sticky inset-x-0 top-0 z-40 hidden h-header-size-desktop min-w-[100vw] bg-black lg:flex"
    >
      <nav className="sticky inset-x-0 top-0 z-40 mx-auto hidden h-header-size-desktop w-full max-w-[1440px] items-center overflow-hidden bg-black pr-[3rem] text-white lg:flex">
        <HeaderTransitionLink
          href="/"
          className={clsx(
            "absolute inset-y-0 left-[3rem] my-auto flex aspect-square h-header-desktop w-[8rem] select-none items-center justify-center",
            pathname === "/"
              ? "pointer-events-none"
              : "pointer-events-auto transition-opacity duration-300 hover:opacity-100",
          )}
        >
          <Image
            src={
              settings?.header?.logo?.logoImage ||
              "https://via.placeholder.com/100x100"
            }
            alt={settings?.header?.logo?.alt || "Logo"}
            width={50}
            height={50}
            priority
            className="aspect-square h-[110px] w-[110px]"
          />
          <div
            className={clsx(
              "absolute inset-y-0 my-auto aspect-square h-[110px] w-[110px] mix-blend-multiply",
              pathname === "/"
                ? ""
                : "transition-colors duration-200 ease-tamisee hover:bg-pink-arch",
            )}
          ></div>
        </HeaderTransitionLink>

        <div className="ml-arch flex w-full justify-between">
          {/* 👈🏽 LEFT LINKS */}
          <div className="grid grid-flow-col grid-rows-3 gap-x-[3rem]">
            {settings?.header?.links?.map((link) => {
              return (
                <>
                  {link.type?.includes("internal") &&
                    link.linkPosition?.includes("left") && (
                      <InternalLink
                        key={link.internalLinkDetails?._key}
                        link={link as any}
                        device="desktop"
                      />
                    )}
                  {link.type?.includes("external") &&
                    link.linkPosition?.includes("left") && (
                      <ExternalLink key={link._key} link={link as any} />
                    )}
                </>
              );
            })}
          </div>
          {/* 👉🏽 RIGHT LINKS */}
          <div className="grid grid-rows-3 place-items-end gap-[.3rem]">
            {settings?.header?.links?.map((link) => {
              return (
                <>
                  {link.type?.includes("internal") &&
                    link.linkPosition?.includes("right") && (
                      <InternalLink
                        key={link.internalLinkDetails?._key}
                        link={link as any}
                        device="desktop"
                      />
                    )}
                  {link.type?.includes("external") &&
                    link.linkPosition?.includes("right") && (
                      <ExternalLink key={link._key} link={link as any} />
                    )}
                </>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
