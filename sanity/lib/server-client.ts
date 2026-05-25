import { createClient } from "next-sanity";
import http from "http";
import https from "https";
import CacheableLookup from "cacheable-lookup";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

const cacheable = new CacheableLookup();
cacheable.install(http.globalAgent);
cacheable.install(https.globalAgent);

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    studioUrl,
    logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === "title") {
        return true;
      }

      return props.filterDefault(props);
    },
  },
});
