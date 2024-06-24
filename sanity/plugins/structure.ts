import { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // Make a singleton of the document with ID header”
      S.documentListItem().id("settings").schemaType("settings"),
      S.documentListItem().id("homepage").schemaType("homepage"),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() == "pages"),
      S.divider(),
      // Add the rest of the document types, but filter out the siteSettings type defined above
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== "homepage" &&
          item.getId() !== "settings" &&
          item.getId() !== "pages" &&
          item.getId() !== "richtext" &&
          item.getId() !== "document-file" &&
          item.getId() !== "single-image" &&
          item.getId() !== "multi-images" &&
          item.getId() !== "customExternalLink" &&
          item.getId() !== "link" &&
          item.getId() !== "lesArchivesVivantes" &&
          item.getId() !== "contact-form" &&
          item.getId() !== "lastEvent" &&
          item.getId() !== "creationArchives",
      ),
      S.documentListItem()
        .id("lesArchivesVivantes")
        .schemaType("lesArchivesVivantes"),
    ]);
