/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { safeHref } from "@/app/(next)/utils/safeHref";

export default function MyCustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      h4: ({ children }) => (
        <h4 className="font-tanker text-[1.2rem] uppercase tracking-wider">
          {children}
        </h4>
      ),
      h5: ({ children }) => (
        <h5 className="font-tanker text-[1.1rem] uppercase tracking-wider">
          {children}
        </h5>
      ),
      h6: ({ children }) => (
        <h6 className="font-tanker text-[1rem] uppercase tracking-wider">
          {children}
        </h6>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        return (
          <a
            href={safeHref(value?.href)}
            rel="noreferrer noopener"
            target="_blank"
            aria-label="Lien externe"
            className="uppercase text-pink-arch hover:text-black hover:no-underline"
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className={["prose", className].filter(Boolean).join(" ")}>
      <PortableText components={components} value={value} />
    </div>
  );
}
