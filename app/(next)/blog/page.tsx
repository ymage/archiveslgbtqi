import React from "react";

import Image from "next/image";

import { sanityFetch } from "@/sanity/lib/fetch";
import { blogsQuery } from "@/sanity/lib/queries";
import { BlogsQueryResult } from "@/sanity.types";

import { DateHourFormat, MyCustomPortableText } from "../components/ui";
import { PortableTextBlock } from "next-sanity";
import { BlogDesktopSidebar } from "../components/blog";

export default async function Page() {
  const [blogs] = await Promise.all([
    sanityFetch<BlogsQueryResult>({
      query: blogsQuery,
      params: {
        maxYear: new Date().getFullYear(),
        minYear: new Date().getFullYear() - 4, // 5 years of blogs
      },
    }),
  ]);

  // console.log("Blogs:", blogs);

  return (
    <div className="relative mx-auto mt-[3rem] min-h-screen pb-[1rem] lg:max-w-[1440px]">
      <BlogDesktopSidebar blog={blogs} />
      <div className="flex flex-col gap-[5rem] px-[1rem] lg:ml-arch lg:pr-[3rem]">
        {blogs.map((blog) => (
          <div
            id={blog.year?.toString()}
            key={blog._id}
            className="flex flex-col justify-between border-t-[3px] border-black pb-[3rem]"
          >
            <h2 className="blogTitle">{blog.title}</h2>
            <span className="blogSubTitle py-[.75rem]">{blog.subTitle}</span>
            <span className="blogAuthor">{blog.author}</span>
            <DateHourFormat
              dateString={blog.date || ""}
              className="blogDate pb-[2.5rem]"
            />
            {blog.contentBlock?.map((block, index) => {
              if ("richText" in block) {
                return (
                  <MyCustomPortableText
                    key={index}
                    value={block.richText as PortableTextBlock[]}
                    className="blogParagraph"
                  />
                );
              }
              if ("singleImage" in block) {
                return (
                  <Image
                    key={index}
                    src={block.singleImage.imageUrl || ""}
                    alt={block.singleImage.alt || ""}
                    width={1000}
                    height={1000}
                  />
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
