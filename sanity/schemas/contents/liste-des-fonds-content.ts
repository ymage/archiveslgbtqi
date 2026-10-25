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
  name: "liste-des-fonds-content",
  title: "Liste des fonds",
  icon: FolderIcon,
  type: "object",
  fields: [
    defineField({
      name: "titleBlock",
      title: "Titre du lien",
      type: "string",
      description: "Titre de la liste.",
    }),
    defineField({
      name: "category",
      title: "Categorie de la liste",
      type: "string",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "A-D", value: "a-d" },
          { title: "E-H", value: "e-h" },
          { title: "I-M", value: "i-m" },
          { title: "N-Q", value: "n-q" },
          { title: "R-U", value: "r-u" },
          { title: "V-Z", value: "v-z" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    defineField({
      name: "block",
      title: "Block",
      type: "array",
      of: [
        { type: "link" },
        { type: "multi-images" },
        { type: "single-image" },
        { type: "richtext" },
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
