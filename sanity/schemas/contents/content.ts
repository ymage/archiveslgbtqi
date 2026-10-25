import { FolderIcon } from "@sanity/icons/Folder";
import { defineField, defineType } from "sanity";

/**
 * This file is the schema definition for a pages.
 *
 * Here you'll be able to edit the different fields that appear when you 
 * create or edit a post in the studio.
 * 
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

*/

export default defineType({
  name: "content",
  title: "Block de contenu",
  icon: FolderIcon,
  type: "object",
  fields: [
    defineField({
      name: "isLink",
      title: "ℹ️ Àjouter un lien dans la barre de nagivation",
      type: "boolean",
    }),
    defineField({
      name: "titleBlock",
      title: "Titre du lien",
      type: "string",
      description: "👉 Titre du lien dans la barre de navigation.",
      hidden: ({ parent }) => !parent?.isLink,
    }),
    defineField({
      name: "block",
      title: "Block",
      type: "array",
      of: [
        { type: "contact-form" },
        { type: "creationArchives" },
        { type: "custom-html" },
        { type: "document-file" },
        { type: "lastEvent" },
        { type: "link" },
        { type: "multi-images" },
        { type: "single-image" },
        { type: "richtext" },
        { type: "richTextAndTitle" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "titleBlock",
    },
    prepare: ({ title }) => ({
      title: title || "Block",
    }),
  },
});
