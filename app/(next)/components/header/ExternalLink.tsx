import React from "react";
import { safeHref } from "@/app/(next)/utils/safeHref";

type ExternalLinkProps = {
  link: {
    _key: string;
    externalLinkDetails: {
      title: string | null;
      url: string | null;
    } | null;
  };
};

export default function ExternalLink({ link }: ExternalLinkProps) {
  return (
    <a
      key={link._key}
      href={safeHref(link.externalLinkDetails?.url)}
      target="_blank"
      rel="noreferrer"
      aria-label="Lien externe"
      className="headerItem"
    >
      {link.externalLinkDetails?.title}
    </a>
  );
}
