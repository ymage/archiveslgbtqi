import React from "react";

import { notFound } from "next/navigation";

import { sanityFetch } from "@/sanity/lib/fetch";
import {
  HomepageQueryResult,
  LastEventQueryResult,
  PagesContentQueryResult,
  PageSlugsResult,
} from "@/sanity.types";
import { lastEventQuery, pagesContentQuery } from "@/sanity/lib/queries";
import { groq } from "next-sanity";
import clsx from "clsx";

import {
  EventsModule,
  LinksModule,
  SingleImageModule,
  MultiImagesModule,
  RichTextModule,
  CreationArchivesModule,
  RichTextAndTitleModule,
  CustomHtml,
  FileModule
} from "../components/modules";

import { DesktopSidebar } from "../components/all-pages";
import { FormSubmission } from "../components/ui";
import { transformId } from "../utils/TransforId";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const pageSlugs = groq`*[_type == "pages"]{slug}`;

export async function generateStaticParams() {
  const params = await sanityFetch<PageSlugsResult>({
    query: pageSlugs,
    perspective: "published",
    stega: false,
  });

  return params.map(({ slug }) => ({ slug: slug?.current }));
}

export default async function Page(props: Props) {
  const params = await props.params;
  const [content, lastEvent] = await Promise.all([
    sanityFetch<PagesContentQueryResult>({
      query: pagesContentQuery,
      params: {
        slug: params.slug,
      },
    }),

    sanityFetch<LastEventQueryResult>({
      query: lastEventQuery,
    }),
  ]);

  if (!content?._id) {
    return notFound();
  }

  //console.log("Pages Content:", content);

  return (
    <div className="relative mx-auto flex min-h-[65svh] w-auto max-w-[1440px] p-[1rem] lg:min-h-[70vh] lg:p-0">
      <DesktopSidebar content={content} />
      <div className="flex w-full flex-col overflow-hidden pt-[2rem] lg:pt-[3rem]">
        <h1 className="font-tanker text-[3rem] uppercase leading-[2.5rem] tracking-wide lg:text-[4.5rem] lg:leading-[3.7rem]">
          {content.title}
        </h1>
        <div className="mt-[.5rem] flex flex-col gap-[1rem]">
          {content.contentModulde?.map((item, index) => (
            // start of each section
            <div
              key={item._key}
              id={transformId(item.titleBlock || "")}
              className={clsx(
                "relative flex flex-col gap-[2rem] will-change-contents lg:pr-[10rem]",
                index !== (content?.contentModulde?.length ?? 0) - 1 &&
                  "pb-[5rem]",
              )}
            >
              <h2 className="pageTitle">{item.titleBlock || ""}</h2>

              <div className="flex flex-col gap-[.5rem]">
                {item.contenBlock?.map((block, index) => (
                  <div key={block._key}>
                    {block._type === "richtext" && (
                      <RichTextModule item={block} />
                    )}
                    {block._type === "richTextAndTitle" && (
                      <RichTextAndTitleModule item={block as any} />
                    )}
                    {block._type === "single-image" && (
                      <SingleImageModule
                        imageUrl={block.imageUrl || ""}
                        imageTitle={block.imageTitle || ""}
                        credits={block.credits || ""}
                      />
                    )}
                    {block._type === "multi-images" && (
                      <MultiImagesModule item={block as any} />
                    )}

                    {block._type === "creationArchives" && (
                      <CreationArchivesModule
                        intro={block.creationArchivesTitle as any}
                        archive={block.creationArchivesArchive as any}
                      />
                    )}
                    {block._type === "custom-html" && (
                      <CustomHtml
                        title={block.codeTitle || ""}
                        html={block.customHtml?.code as any}
                        item={block as any}
                      />
                    )}
                    {block._type === "link" && (
                      <LinksModule item={block as any} />
                    )}
                    {block._type === "lastEvent" && (
                      <EventsModule
                        events={lastEvent}
                        title={block.lastEventLabel || ""}
                        link={block.goToAllEvents || ""}
                      />
                    )}
                    {block._type === "contact-form" && <FormSubmission />}
                    {block._type === "document-file" && <FileModule item={block as any}/>} 
                  </div>
                ))}
              </div>

              {/* // 👇🏽 Separator (hide if it's the last element) */}
              {index !== (content?.contentModulde?.length ?? 0) - 1 && (
                <div className="absolute bottom-0 left-0 h-[3px] w-full bg-black lg:w-[calc(100%-3rem)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
