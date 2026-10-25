"use client";
import { SettingsQueryResult } from "@/sanity.types";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import clsx from "clsx";

import InternalLink from "./InternalLink";
import ExternalLink from "./ExternalLink";
import HambugerButton from "../ui/icon/HambugerButton";

type NavLinkProps = {
  settings: SettingsQueryResult;
};

export default function NavMobile({ settings }: NavLinkProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menu]);

  const handleMenu = () => {
    setMenu(!menu);
  };

  return (
    <>
      <nav className="sticky inset-x-0 top-0 z-40 flex h-[5rem] w-full items-center justify-between bg-black px-[1rem] text-white lg:hidden">
        <Link
          href="/"
          onClick={() => {
            setMenu(false);
          }}
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
            className="aspect-square h-[80px] w-[80px]"
          />
        </Link>
        <HambugerButton
          onclick={handleMenu}
          menu={menu}
          className="z-40 flex flex-col gap-[.5rem] lg:hidden"
        />
      </nav>

      <div
        ref={menuRef}
        className={clsx(
          "fixed inset-0 z-40 mt-[5rem] h-screen w-full flex-col gap-[1rem] overflow-hidden bg-white-primary p-[1rem] transition-transform duration-500 ease-tamisee lg:hidden",
          menu ? "translate-x-0" : "translate-x-[100%]",
        )}
      >
        <nav className="z-50 flex flex-col items-end justify-center gap-[.5rem]">
          {settings?.header?.links &&
            settings.header.links.map((link) => {
              if (link.type === "internal") {
                return (
                  <InternalLink
                    key={link._key}
                    link={link as any}
                    onclick={() => {
                      setMenu(false);
                    }}
                    device="mobile"
                  />
                );
              } else {
                return <ExternalLink key={link._key} link={link as any} />;
              }
            })}
        </nav>
      </div>
    </>
  );
}
