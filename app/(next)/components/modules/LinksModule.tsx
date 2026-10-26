import React from "react";

import TransitionLink from "../ui/TransitionLink";
import Link from "next/link";
import { internalHref, safeHref } from "@/app/(next)/utils/safeHref";

type Props = {
  item: {
    internal: { slug: string };
    external: string;
    mail: string;
    linkLabel: string;
  };
};

export default function LinksModule({ item }: Props) {
  const link = item;
  return (
    <div className="mb-[2rem]">
      <Link
        href={
          link.internal?.slug
            ? internalHref(link.internal.slug)
            : safeHref(link.external || `mailto:${link.mail}`)
        }
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noopener noreferrer" : undefined}
        className="linkButton"
      >
        {link.linkLabel}
      </Link>
    </div>
  );
}
