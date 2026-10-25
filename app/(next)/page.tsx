import { HomepageQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homepageQuery } from "@/sanity/lib/queries";

import { Homepage } from "./components/homepage";

export default async function Page() {
  const [homePage] = await Promise.all([
    sanityFetch<HomepageQueryResult>({ query: homepageQuery }),
  ]);

  return (
    <div className="relative min-h-[100svh] overflow-hidden scroll-auto">
      <Homepage homePage={homePage} />
    </div>
  );
}
