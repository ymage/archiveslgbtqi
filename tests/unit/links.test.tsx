import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { pathname, push, animatePageOut } = vi.hoisted(() => ({
  pathname: { value: "/" },
  push: vi.fn(),
  animatePageOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
  useRouter: () => ({ push, refresh: vi.fn() }),
}));
vi.mock("@/app/(next)/utils/animations", () => ({ animatePageOut }));
vi.mock("../../app/(next)/utils/animations", () => ({ animatePageOut }));
vi.mock("gsap", () => ({ default: { to: vi.fn() } }));
vi.mock("@gsap/react", () => ({ useGSAP: vi.fn() }));

import ExternalLink from "@/app/(next)/components/header/ExternalLink";
import InternalLink from "@/app/(next)/components/header/InternalLink";
import CTAMarquee from "@/app/(next)/components/homepage/CTAMarquee";
import LinksModule from "@/app/(next)/components/modules/LinksModule";
import MyCustomPortableText from "@/app/(next)/components/ui/MyCustomPortableText";
import TransitionLink from "@/app/(next)/components/ui/TransitionLink";

beforeEach(() => {
  pathname.value = "/";
  push.mockReset();
  animatePageOut.mockReset();
});

const external = (url: string | null) => ({
  _key: "k",
  externalLinkDetails: { title: "Site", url },
});

describe("ExternalLink", () => {
  it("renders an https link that opens in a new tab without opener", () => {
    render(<ExternalLink link={external("https://example.org")} />);
    const a = screen.getByRole("link", { name: "Lien externe" });
    expect(a).toHaveAttribute("href", "https://example.org");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a.getAttribute("rel")).toContain("noreferrer");
  });

  it.each(["javascript:alert(1)", "data:text/html,x"])(
    "neutralises %s",
    (url) => {
      render(<ExternalLink link={external(url)} />);
      expect(screen.getByRole("link")).toHaveAttribute("href", "#");
    },
  );
});

describe("InternalLink", () => {
  const link = (slug: string | null) => ({
    _key: "k",
    internalLinkDetails: { _id: "1", _key: "k", _type: "pages", title: "Agenda", slug },
  });

  it.each(["mobile", "desktop"] as const)("%s: builds a same-origin path", (device) => {
    render(<InternalLink link={link("agenda")} device={device} />);
    expect(screen.getByRole("link", { name: "Agenda" })).toHaveAttribute("href", "/agenda");
  });

  it("never produces a protocol-relative href", () => {
    render(<InternalLink link={link("//evil.com")} device="mobile" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/evil.com");
  });

  it("highlights the current page", () => {
    pathname.value = "/agenda";
    render(<InternalLink link={link("agenda")} device="mobile" />);
    expect(screen.getByRole("link").className).toContain("text-pink-arch");
  });

  it("mobile: calls onclick", async () => {
    const onclick = vi.fn();
    document.addEventListener("click", (e) => e.preventDefault(), { once: true });
    render(<InternalLink link={link("agenda")} device="mobile" onclick={onclick} />);
    await userEvent.click(screen.getByRole("link"));
    expect(onclick).toHaveBeenCalledOnce();
  });

  it("desktop: runs the transition and then pushes the route", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<InternalLink link={link("agenda")} device="desktop" />);
    await userEvent.click(screen.getByRole("link"), { advanceTimers: vi.advanceTimersByTime });
    await vi.advanceTimersByTimeAsync(750);
    expect(push).toHaveBeenCalledWith("/agenda");
    await vi.advanceTimersByTimeAsync(750);
    vi.useRealTimers();
  });
});

describe("LinksModule", () => {
  const base = { internal: { slug: "" }, external: "", mail: "", linkLabel: "Go" };

  it("internal slug: same-origin path, same tab", () => {
    render(<LinksModule item={{ ...base, internal: { slug: "agenda" } }} />);
    const a = screen.getByRole("link", { name: "Go" });
    expect(a).toHaveAttribute("href", "/agenda");
    expect(a).not.toHaveAttribute("target");
  });

  it("external: new tab with noopener", () => {
    render(<LinksModule item={{ ...base, external: "https://example.org" }} />);
    const a = screen.getByRole("link");
    expect(a).toHaveAttribute("href", "https://example.org");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a.getAttribute("rel")).toContain("noopener");
  });

  it("external javascript: url is neutralised", () => {
    render(<LinksModule item={{ ...base, external: "javascript:alert(1)" }} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");
  });

  it("falls back to a mailto link", () => {
    render(<LinksModule item={{ ...base, mail: "a@b.fr" }} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "mailto:a@b.fr");
  });
});

describe("CTAMarquee", () => {
  const marquee = (over: object) =>
    ({ marqueeCTA: { marqueeCTAVisibility: true, marqueeContent: "Venez", marqueeLink: "https://example.org", ...over } }) as never;

  it("renders when visible, with a safe href", () => {
    render(<CTAMarquee marquee={marquee({})} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://example.org");
    expect(screen.getAllByText("Venez")).toHaveLength(6);
  });

  it("neutralises a javascript: link", () => {
    render(<CTAMarquee marquee={marquee({ marqueeLink: "javascript:alert(1)" })} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");
  });

  it("renders nothing when hidden", () => {
    const { container } = render(<CTAMarquee marquee={marquee({ marqueeCTAVisibility: false })} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("MyCustomPortableText", () => {
  const withLink = (href: string) =>
    [
      {
        _type: "block",
        _key: "b",
        style: "normal",
        markDefs: [{ _key: "m", _type: "link", href }],
        children: [{ _type: "span", _key: "s", text: "ici", marks: ["m"] }],
      },
    ] as never;

  it("renders links with a safe href and opener protection", () => {
    render(<MyCustomPortableText value={withLink("https://example.org")} />);
    const a = screen.getByRole("link");
    expect(a).toHaveAttribute("href", "https://example.org");
    expect(a).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("neutralises a javascript: link mark", () => {
    render(<MyCustomPortableText value={withLink("javascript:alert(1)")} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");
  });
});

describe("TransitionLink", () => {
  it("animates to another page instead of a plain navigation", async () => {
    render(<TransitionLink href="/blog">Blog</TransitionLink>);
    await userEvent.click(screen.getByRole("link", { name: "Blog" }));
    expect(animatePageOut).toHaveBeenCalledWith("/blog", expect.anything());
  });

  it("does nothing when already on the page", async () => {
    pathname.value = "/blog";
    render(<TransitionLink href="/blog">Blog</TransitionLink>);
    await userEvent.click(screen.getByRole("link", { name: "Blog" }));
    expect(animatePageOut).not.toHaveBeenCalled();
  });
});
