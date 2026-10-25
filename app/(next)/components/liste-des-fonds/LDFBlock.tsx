"use client";
import React, { useState } from "react";
import { ListeDeFondsQueryResult } from "@/sanity.types";
import clsx from "clsx";
import {
  LinksModule,
  MultiImagesModule,
  RichTextModule,
  SingleImageModule,
} from "../modules";

type LDFBlockProps = {
  list: ListeDeFondsQueryResult;
};

export default function LDFBlock({ list }: LDFBlockProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [listIndex, setListIndex] = useState<number | null>(null);
  let lastCategory = "";

  const handleClick = (category: string, index: number) => {
    if (activeCategory === category) {
      setListIndex(listIndex === index ? null : index);
    } else {
      setActiveCategory(category);
      setListIndex(index);
    }
  };

  const renderContent = (contentModule: any, categoryRange: string) => {
    return contentModule?.map(
      (
        item: {
          category:
            | string
            | number
            | bigint
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | null
            | undefined;
          titleBlock:
            | string
            | number
            | bigint
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | React.ReactPortal
            | Iterable<React.ReactNode>
            | null
            | undefined;
          contenBlock: {
            _key?: any;
            _type: any;
            imageUrl?: any;
            imageTitle?: any;
            credits?: any;
            richtext?: any;
          }[];
        },
        index: number | null,
      ) => {
        const showCategory = item.category !== lastCategory;
        lastCategory = String(item.category) || "";

        return (
          <div
            key={`${item.category}-${index}`}
            className="flex flex-col divide-y-[2px] divide-black border-b-[2px] border-black"
          >
            {showCategory && (
              <span
                id={String(item.category) || ""}
                className="pageTitle mt-[3rem] pb-[1rem]"
              >
                {item.category}
              </span>
            )}
            <button
              aria-label="Boutton des Liste des fonds"
              onClick={() => handleClick(categoryRange, index ?? 0)}
              className={clsx(
                "relative flex w-full flex-col items-start justify-start gap-[1rem] overflow-hidden pt-[.3rem] text-start transition-[colors,max-height] duration-[.5s] ease-tamisee hover:bg-pink-arch lg:pb-[1rem] lg:pt-[.55rem]",
                activeCategory === categoryRange && listIndex === index
                  ? "max-h-[70rem] pb-[1rem] hover:bg-white hover:text-black lg:max-h-[100rem]"
                  : "max-h-[2.15rem] hover:bg-pink-arch hover:text-white lg:max-h-[2.75rem]",
              )}
            >
              <div className="flex w-full items-center justify-between gap-[1rem] lg:h-auto lg:px-[1rem]">
                <div className="deroulantTitle flex items-center gap-[2rem]">
                  <h2
                    className={clsx(
                      "overflow-hidden", // Ensure the overflow is hidden to make the scrolling effect visible
                      activeCategory === categoryRange && listIndex === index
                        ? "whitespace-nowrap"
                        : "",
                      typeof item.titleBlock === "string" &&
                        item.titleBlock.length > 40
                        ? "animate-scroll lg:animate-none"
                        : "",
                    )}
                  >
                    <span className="inline-block">{item.titleBlock}</span>
                  </h2>
                </div>
                <div
                  className={clsx(
                    "mb-[.5rem] hidden text-[.8rem] leading-[.5rem] transition-transform duration-[.5s] ease-tamisee lg:block",
                    activeCategory === categoryRange && listIndex === index
                      ? "rotate-[135deg]"
                      : "rotate-0",
                  )}
                >
                  +
                </div>
              </div>
              <div className="flex min-w-full flex-col space-y-[1rem]">
                {item.contenBlock?.map(
                  (block: {
                    _key?: any;
                    _type: any;
                    imageUrl?: any;
                    imageTitle?: any;
                    richtext?: any;
                    credits?: any;
                  }) => (
                    <div key={block._key}>
                      {block._type === "richtext" && (
                        <RichTextModule item={block as any} />
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
                      {block._type === "link" && (
                        <LinksModule item={block as any} />
                      )}
                    </div>
                  ),
                )}
              </div>
            </button>
          </div>
        );
      },
    );
  };

  return (
    <div className="">
      {/* A - D */}
      {renderContent(list?.contentModuleAD, "AD")}
      {/* E - H */}
      {renderContent(list?.contentModuleEH, "EH")}
      {/* I - M */}
      {renderContent(list?.contentModuleIM, "IM")}
      {/* N - Q */}
      {renderContent(list?.contentModuleNQ, "NQ")}
      {/* R - U */}
      {renderContent(list?.contentModuleRU, "RU")}
      {/* V - Z */}
      {renderContent(list?.contentModuleVZ, "VZ")}
    </div>
  );
}
