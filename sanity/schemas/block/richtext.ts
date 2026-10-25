import { TextIcon } from "@sanity/icons/Text";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "richtext",
  title: "Texte",
  icon: () => "📝",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
  ],
});
