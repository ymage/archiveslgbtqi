import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import * as queries from "@/sanity/lib/queries";

const all = Object.entries(queries).filter(
  (e): e is [string, string] => typeof e[1] === "string" && e[0].endsWith("Query"),
);

const params = { slug: "a", event: "e", minYear: 2000, maxYear: 2100 };

describe("GROQ queries", () => {
  it("exports the expected queries", () => {
    expect(all.map(([name]) => name)).toEqual(
      expect.arrayContaining([
        "settingsQuery",
        "homepageQuery",
        "blogsQuery",
        "lastEventQuery",
        "pagesSlugQuery",
        "pagesContentQuery",
      ]),
    );
  });

  it.each(all)("%s parses", (_, query) => {
    expect(() => parse(query, { params })).not.toThrow();
  });
});

describe("route parameters are bound, not interpolated", () => {
  const dataset = [
    { _id: "1", _type: "pages", title: "Public", slug: { current: "public" } },
    { _id: "2", _type: "pages", title: "Other", slug: { current: "other" } },
  ];
  const run = async (slug: string) =>
    (
      await evaluate(parse(queries.pagesContentQuery, { params: { slug } }), {
        dataset,
        params: { slug },
      })
    ).get();

  it("finds a page by its slug", async () => {
    expect(await run("public")).toMatchObject({ _id: "1" });
  });

  it.each(['" || true || "', "x] | *[_type == 'settings'", "*", "public\" || slug.current == \"other"])(
    "treats %j as a plain string",
    async (slug) => {
      expect(await run(slug)).toBeNull();
    },
  );
});
