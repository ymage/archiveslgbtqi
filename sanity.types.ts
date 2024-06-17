/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type Link = {
  _type: "link";
  label?: string;
  type?: "internal" | "external";
  internal?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "pages";
  };
  external?: string;
};

export type SingleImage = {
  _id: string;
  _type: "single-image";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
};

export type DocumentFile = {
  _id: string;
  _type: "document-file";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  file?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.fileAsset";
    };
    _type: "file";
  };
};

export type Richtext = {
  _id: string;
  _type: "richtext";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  text?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
};

export type Pages = {
  _id: string;
  _type: "pages";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  slug?: Slug;
  navigation?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "pages";
  }>;
  content?: Array<
    | {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        _key: string;
        [internalGroqTypeReferenceTo]?: "document-file";
      }
    | {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        _key: string;
        [internalGroqTypeReferenceTo]?: "richtext";
      }
    | {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        _key: string;
        [internalGroqTypeReferenceTo]?: "single-image";
      }
    | ({
        _key: string;
      } & Link)
  >;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type Footer = {
  _id: string;
  _type: "footer";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
};

export type Homepage = {
  _id: string;
  _type: "homepage";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  hero?: {
    heading?: string;
    description?: string;
    image?: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
    };
    ctatext?: string;
  };
  cta?: {
    sections?: Array<{
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      _key: string;
      [internalGroqTypeReferenceTo]?: "pages";
    }>;
  };
};

export type Header = {
  _id: string;
  _type: "header";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  logo?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  links?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "pages";
  }>;
  ogImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
  };
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: ./sanity/lib/queries.ts
// Variable: settingsQuery
// Query: *[_type == "settings"][0]
export type SettingsQueryResult = null;
// Variable: moreStoriesQuery
// Query: *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {    _id,  "status": select(_originalId in path("drafts.**") => "draft", "published"),  "title": coalesce(title, "Untitled"),  "slug": slug.current,  excerpt,  coverImage,  "date": coalesce(date, _updatedAt),  "author": author->{"name": coalesce(name, "Anonymous"), picture},}
export type MoreStoriesQueryResult = Array<never>;
// Variable: postQuery
// Query: *[_type == "post" && slug.current == $slug] [0] {  content,    _id,  "status": select(_originalId in path("drafts.**") => "draft", "published"),  "title": coalesce(title, "Untitled"),  "slug": slug.current,  excerpt,  coverImage,  "date": coalesce(date, _updatedAt),  "author": author->{"name": coalesce(name, "Anonymous"), picture},}
export type PostQueryResult = null;
// Variable: headerQuery
// Query: *[_type == "header"] {  "imageUrl": logo.asset->url,  "url": links[]->{     title,     "slug": slug.current  }}
export type HeaderQueryResult = Array<{
  imageUrl: string | null;
  url: Array<{
    title: string | null;
    slug: string | null;
  }> | null;
}>;
// Variable: footerQuery
// Query: *[_type == "footer"][0] {  title,}
export type FooterQueryResult = {
  title: string | null;
} | null;
// Variable: heroQuery
// Query: *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {  content,    _id,  "status": select(_originalId in path("drafts.**") => "draft", "published"),  "title": coalesce(title, "Untitled"),  "slug": slug.current,  excerpt,  coverImage,  "date": coalesce(date, _updatedAt),  "author": author->{"name": coalesce(name, "Anonymous"), picture},}
export type HeroQueryResult = null;
// Variable: pagesContentQuery
// Query: *[_type == "pages" && slug.current == $pages][0] {  _id,  title,  slug,  "navigation": navigation[]->{    _id,    title,    slug,  },  "content": content[]{    _id,    _ref,    _type,    title,    "richtext": text[],    label,    "imageUrl": image.asset->url,    url,    external,    "internal": internal->{      _id,      _type,      title,      "slug": slug.current,    },  }}
export type PagesContentQueryResult = {
  _id: string;
  title: string | null;
  slug: Slug | null;
  navigation: Array<{
    _id: string;
    title: string | null;
    slug: Slug | null;
  }> | null;
  content: Array<
    | {
        _id: null;
        _ref: null;
        _type: "link";
        title: null;
        richtext: null;
        label: string | null;
        imageUrl: null;
        url: null;
        external: string | null;
        internal: {
          _id: string;
          _type: "pages";
          title: string | null;
          slug: string | null;
        } | null;
      }
    | {
        _id: null;
        _ref: string;
        _type: "reference";
        title: null;
        richtext: null;
        label: null;
        imageUrl: null;
        url: null;
        external: null;
        internal: null;
      }
  > | null;
} | null;
// Variable: homepageQuery
// Query: *[_type == "homepage"] [0] {  hero {    heading,    description,    ctatext,    "imageUrl": image.asset->url,    "url": cta->slug,  },}
export type HomepageQueryResult = {
  hero: {
    heading: string | null;
    description: string | null;
    ctatext: string | null;
    imageUrl: string | null;
    url: null;
  } | null;
} | null;
