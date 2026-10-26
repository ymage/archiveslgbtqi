"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import clsx from "clsx";

import HeaderTransitionLink from "./HeaderTransitionLink";
import { internalHref } from "@/app/(next)/utils/safeHref";

type InternalLinkProps = {
  link: {
    _key: string;
    internalLinkDetails: {
      _id: string;
      _key: string;
      _type: string;
      title: string | null;
      slug: string | null;
    } | null;
  };
  onclick?: () => void;
  device?: "mobile" | "desktop";
};

export default function InternalLink({
  link,
  device,
  onclick,
}: InternalLinkProps) {
  const pathname = usePathname();
  return (
    <>
      {device === "mobile" && (
        <Link
          key={link._key}
          href={internalHref(link.internalLinkDetails?.slug)}
          onClick={onclick}
          className={clsx(
            "headerItem",
            pathname === `/${link.internalLinkDetails?.slug}`
              ? "text-pink-arch"
              : "",
          )}
        >
          {link.internalLinkDetails?.title || ""}
        </Link>
      )}
      {device === "desktop" && (
        <HeaderTransitionLink
          key={link._key}
          href={internalHref(link.internalLinkDetails?.slug)}
          className={clsx(
            "headerItem",
            pathname === `/${link.internalLinkDetails?.slug}`
              ? "text-pink-arch"
              : "",
          )}
        >
          {link.internalLinkDetails?.title || ""}
        </HeaderTransitionLink>
      )}
    </>
  );
}
