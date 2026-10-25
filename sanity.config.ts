"use client";
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from "@sanity/vision";
import { frFRLocale } from "@sanity/locale-fr-fr";
import { PluginOptions, defineConfig } from "sanity";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { codeInput } from "@sanity/code-input";
import { media } from "sanity-plugin-media";

import { defineDocuments, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { singletonPlugin } from "@/sanity/plugins/settings";

import { structure } from "./sanity/plugins/structure";

// Singletons
import settings from "./sanity/schemas/singletons/settings";
import homepage from "./sanity/schemas/singletons/homepage";

// Documents
import pages from "./sanity/schemas/documents/pages";
import events from "./sanity/schemas/documents/events";
import blogs from "./sanity/schemas/documents/blogs";

// Content
import content from "./sanity/schemas/contents/content";

// Blocks
import richtext from "./sanity/schemas/block/richtext";
import documentFile from "./sanity/schemas/block/document-file";
import singleImage from "./sanity/schemas/block/single-image";
import multiImages from "./sanity/schemas/block/multi-images";
import link from "./sanity/schemas/block/link";
import contactForm from "./sanity/schemas/block/contact-form";
import lastEvent from "./sanity/schemas/block/last-event";
import creationArchives from "./sanity/schemas/block/creation-archives";
import richtextAndTitle from "./sanity/schemas/block/richtext-title";
import customHtml from "./sanity/schemas/block/custom-html";
import listeDesFondsContent from "./sanity/schemas/contents/liste-des-fonds-content";
import Logo from "./app/(sanity)/components/Logo";

export default defineConfig({
  basePath: studioUrl,
  title: "LGBTQ+ Archives Project",
  projectId,
  dataset,
  icon: Logo as any,
  scheduledPublishing: {
    enabled: false,
  },
  schema: {
    types: [
      // Singletons
      settings,
      homepage,
      // Documents
      pages,
      events,
      blogs,
      // Content
      content,
      // Blocks
      richtext,
      richtextAndTitle,
      documentFile,
      singleImage,
      multiImages,
      link,
      contactForm,
      lastEvent,
      creationArchives,
      customHtml,
      listeDesFondsContent,
    ],
  },
  plugins: [
    frFRLocale(),
    structureTool({
      structure,
    }),
    presentationTool({
      previewUrl: { previewMode: { enable: "/api/draft" } },
    }),
    codeInput(),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([settings.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // media plugin
    media(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    process.env.NODE_ENV === "development" &&
      visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean) as PluginOptions[],
});
