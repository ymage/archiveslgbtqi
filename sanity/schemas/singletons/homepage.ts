import CustomStringInputWithLimits from "@/sanity/plugins/CustomStringInputWithLimits";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "homepage",
  title: "Page d'accueil",
  type: "document",
  icon: () => "🏠",
  groups: [
    {
      title: "Caroussel d'images",
      name: "hero",
    },
    {
      title: "Deuxième section",
      name: "secondPart",
    },
    {
      title: "Texte d'introduction",
      name: "introText",
    },
    {
      title: "Prochaines dates",
      name: "upcomingEvents",
    },
    {
      title: "Bandeaux (bas de page)",
      name: "marqueeCTA",
    },
  ],
  fields: [
    // Hero
    defineField({
      name: "hero",
      title: "Caroussel d'images",
      type: "object",
      group: "hero",
      description:
        "Cette section est dédiée aux modules du carousell d'images de la page d'accueil.",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "heroVisibility",
          title: "Afficher sur la page d'accueil",
          type: "boolean",
          description:
            "ℹ️ Désactiver pour ne pas afficher cette section sur la page d'accueil.",
        }),
        defineField({
          name: "hero",
          title: "Block",
          type: "array",
          description: "💡 3 slides maximum",
          validation: (Rule) =>
            Rule.max(3).warning("3 slides maximum").error("3 slides maximum"),
          of: [
            defineArrayMember({
              type: "object",
              preview: {
                select: {
                  title: "title",
                  media: "image.image",
                },
              },
              fields: [
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                }),
                defineField({
                  name: "paragraph",
                  title: "Paragraph",
                  type: "text",
                  validation: (Rule) =>
                    Rule.max(150).warning(
                      "100 caractères maximum, (il sera tronqué)",
                    ),
                  components: {
                    input: CustomStringInputWithLimits,
                  },
                }),
                defineField({
                  name: "image",
                  title: "Image",
                  type: "object",
                  fields: [
                    defineField({
                      name: "image",
                      title: "Image",
                      type: "image",
                    }),
                    defineField({
                      name: "alt",
                      title: "Alt Text",
                      type: "string",
                    }),
                  ],
                }),
                defineField({
                  name: "cta",
                  title: "Call to Action",
                  type: "object",
                  fields: [
                    defineField({
                      name: "ctaLabel",
                      title: "CTA Label",
                      type: "string",
                    }),
                    defineField({
                      name: "ctaLink",
                      title: "CTA Link",
                      type: "reference",
                      to: [{ type: "pages" }],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Second part
    defineField({
      name: "secondPart",
      title: "Deuxième section",
      type: "object",
      description:
        "Cette section est dédiée à la deuxième section de la page d'accueil.",
      group: "secondPart",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "secondPartVisibility",
          title: "Afficher sur la page d'accueil",
          type: "boolean",
          description:
            "ℹ️ Désactiver pour ne pas afficher cette section sur la page d'accueil.",
        }),
        defineField({
          name: "block",
          title: "Block",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              preview: {
                select: {
                  title: "title",
                  media: "image.image",
                },
              },
              fields: [
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                }),
                defineField({
                  name: "paragraph",
                  title: "Paragraph",
                  type: "text",
                }),
                defineField({
                  name: "image",
                  title: "Image",
                  type: "object",
                  fields: [
                    defineField({
                      name: "image",
                      title: "Image",
                      type: "image",
                    }),
                    defineField({
                      name: "alt",
                      title: "Alt Text",
                      type: "string",
                    }),
                  ],
                }),
                defineField({
                  name: "cta",
                  title: "Call to Action",
                  type: "object",
                  fields: [
                    defineField({
                      name: "ctaLabel",
                      title: "CTA Label",
                      type: "string",
                    }),
                    defineField({
                      name: "ctaLink",
                      title: "CTA Link",
                      type: "reference",
                      to: [{ type: "pages" }],
                    }),
                    defineField({
                      name: "ctaScrollTo",
                      title: "CTA Scroll à ➡️",
                      type: "string",
                      description:
                        "L'ID de l'élément à scroller vers (Sans accent, sans espaces et sans majuscule). Ex: 'ateliers-formations', 'creation-d'archives'",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Text d'intro
    defineField({
      name: "introText",
      title: "Texte d'introduction & Newsletter",
      type: "object",
      group: "",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "introTextVisibility",
          title: "Afficher sur la page d'accueil",
          type: "boolean",
          description:
            "ℹ️ Désactiver pour ne pas afficher cette section sur la page d'accueil.",
        }),
        defineField({
          name: "introTextContent",
          title: "Texte d'introduction",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "newsletterTextContent",
          title: "Titre de la newsletter",
          type: "string",
        }),
      ],
    }),
    // Upcoming events
    defineField({
      name: "upcomingEventsSection",
      title: "Prochaines dates",
      type: "object",
      group: "upcomingEvents",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "upcomingEventsSectionVisibility",
          title: "Afficher sur la page d'accueil",
          type: "boolean",
          description:
            "ℹ️ Désactiver pour ne pas afficher cette section sur la page d'accueil.",
        }),
        defineField({
          name: "upcomingEventsTitle",
          title: "Titre de la section 'Prochaines dates'",
          type: "string",
        }),
        defineField({
          name: "upcomingEventsCTA",
          title: "Lien vers l'Agenda",
          type: "object",
          fields: [
            defineField({
              name: "eventsCTATitle",
              title: "Titre du lien vers l'Agenda",
              type: "string",
            }),
            defineField({
              name: "eventsCTA",
              title: "Lien vers l'Agenda",
              type: "reference",
              to: [{ type: "pages" }],
            }),
          ],
        }),
        defineField({
          name: "upcomingEvents",
          title: "Prochaines dates",
          type: "array",
          of: [
            {
              type: "reference",
              options: {
                // 👇🏽 filter out past events
                filter:
                  "(_type == 'events' && dateTime(eventDate.eventStartDate) >= dateTime(now()))",
                filterParams: { now: new Date().toISOString() },
              },
              to: [
                {
                  type: "events",
                },
              ],
            },
          ],
          validation: (Rule) =>
            Rule.max(3)
              .warning("3 événements maximum")
              .error("3 événements maximum"),
        }),
        defineField({
          name: "upcomingEventsCTATitle",
          title: "Titre du lien vers l'Événement",
          type: "string",
        }),
      ],
    }),
    // Marquee CTA
    defineField({
      name: "marqueeCTA",
      title: "Bandeaux (bas de page)",
      type: "object",
      group: "marqueeCTA",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "marqueeCTAVisibility",
          title: "Afficher sur la page d'accueil",
          type: "boolean",
          description:
            "ℹ️ Désactiver pour ne pas afficher cette section sur la page d'accueil.",
        }),
        defineField({
          name: "marqueeContent",
          title: "Contenu du bandeau",
          type: "string",
        }),
        defineField({
          name: "marqueeLink",
          title: "Lien du bandeau",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Page d'accueil",
      };
    },
  },
});
