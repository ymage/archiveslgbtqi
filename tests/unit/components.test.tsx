import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendEmail, toast, refresh, disableDraftMode } = vi.hoisted(() => ({
  sendEmail: vi.fn(),
  toast: { success: vi.fn(), error: vi.fn() },
  refresh: vi.fn(),
  disableDraftMode: vi.fn(),
}));

vi.mock("axios");
vi.mock("sonner", () => ({ toast }));
vi.mock("@/app/(next)/_actions", () => ({ sendEmail }));
vi.mock("../../app/(next)/_actions", () => ({ sendEmail }));
vi.mock("@/app/(next)/actions", () => ({ disableDraftMode }));
vi.mock("../../app/(next)/actions", () => ({ disableDraftMode }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh, push: vi.fn() }),
  usePathname: () => "/",
}));

import FooterNewsletter from "@/app/(next)/components/footer/FooterNewsletter";
import CustomHtml from "@/app/(next)/components/modules/CustomHtml";
import FileModule from "@/app/(next)/components/modules/FileModule";
import BannerAlert from "@/app/(next)/components/ui/BannerAlert";
import DateHourFormat from "@/app/(next)/components/ui/DateHourFormat";
import FormSubmission from "@/app/(next)/components/ui/FormSubmission";
import ContactFormEmail from "@/app/(next)/emails/contact-form-email";

beforeEach(() => {
  sendEmail.mockReset();
  toast.success.mockReset();
  toast.error.mockReset();
  refresh.mockReset();
  disableDraftMode.mockReset();
});

async function fillContactForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nom"), "Ada");
  await user.type(screen.getByLabelText("Adresse email"), "ada@example.org");
  await user.type(screen.getByLabelText("Titre de votre archive"), "Fonds Ada");
  await user.type(screen.getByPlaceholderText("Message"), "Un message assez long");
}

describe("FormSubmission", () => {
  it("submits the form values to sendEmail and resets on success", async () => {
    sendEmail.mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<FormSubmission />);
    await fillContactForm(user);
    await user.click(screen.getByRole("button", { name: "Envoyer" }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(sendEmail.mock.calls[0][0]).toMatchObject({
      name: "Ada",
      email: "ada@example.org",
      title: "Fonds Ada",
      message: "Un message assez long",
    });
    expect(screen.getByLabelText("Nom")).toHaveValue("");
  });

  it("shows field errors and does not call the server when invalid", async () => {
    const user = userEvent.setup();
    render(<FormSubmission />);
    await user.click(screen.getByRole("button", { name: "Envoyer" }));
    expect(await screen.findByText("Le nom est requis.")).toBeInTheDocument();
    expect(screen.getByText("Le titre est requis.")).toBeInTheDocument();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("tells the visitor when they are rate limited", async () => {
    sendEmail.mockResolvedValue({ success: false, rateLimited: true });
    const user = userEvent.setup();
    render(<FormSubmission />);
    await fillContactForm(user);
    await user.click(screen.getByRole("button", { name: "Envoyer" }));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Trop de demandes, réessayez plus tard."),
    );
    expect(screen.getByLabelText("Nom")).toHaveValue("Ada");
  });

  it("shows a generic error on failure and keeps the input", async () => {
    sendEmail.mockResolvedValue({ success: false });
    const user = userEvent.setup();
    render(<FormSubmission />);
    await fillContactForm(user);
    await user.click(screen.getByRole("button", { name: "Envoyer" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(toast.error.mock.calls[0][0]).toMatch(/erreur/);
    expect(screen.getByLabelText("Nom")).toHaveValue("Ada");
  });

  it("ships the honeypot hidden from users", () => {
    const { container } = render(<FormSubmission />);
    const honeypot = container.querySelector('input[name="website"]');
    expect(honeypot).toHaveClass("hidden");
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
  });
});

describe("FooterNewsletter", () => {
  it("posts the email and shows the server message", async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { message: "Merci !" } });
    const user = userEvent.setup();
    render(<FooterNewsletter />);
    await user.type(screen.getByLabelText("email"), "a@b.fr");
    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(await screen.findByText("Merci !")).toBeInTheDocument();
    expect(axios.post).toHaveBeenCalledWith("/api/newsletter", { email: "a@b.fr" });
    expect(screen.getByLabelText("email")).toHaveValue("");
  });

  it("shows the API error message", async () => {
    const err = Object.assign(new Error("x"), {
      isAxiosError: true,
      response: { data: { error: "Trop de demandes, réessayez plus tard." } },
    });
    vi.mocked(axios.post).mockRejectedValue(err);
    vi.mocked(axios.isAxiosError).mockReturnValue(true);
    const user = userEvent.setup();
    render(<FooterNewsletter />);
    await user.type(screen.getByLabelText("email"), "a@b.fr");
    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(await screen.findByText("Trop de demandes, réessayez plus tard.")).toBeInTheDocument();
    expect(screen.getByLabelText("email")).toHaveValue("a@b.fr");
  });

  it("falls back to a generic message on a non-HTTP error", async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error("offline"));
    vi.mocked(axios.isAxiosError).mockReturnValue(false);
    const user = userEvent.setup();
    render(<FooterNewsletter />);
    await user.type(screen.getByLabelText("email"), "a@b.fr");
    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(await screen.findByText(/An error occurred/)).toBeInTheDocument();
  });
});

describe("BannerAlert", () => {
  it("leaves draft mode and refreshes the page", async () => {
    disableDraftMode.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<BannerAlert />);
    expect(screen.getByText(/Previewing drafts/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to published" }));
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce());
    expect(disableDraftMode).toHaveBeenCalledOnce();
  });
});

describe("FileModule", () => {
  const item = { fileUrl: "https://cdn.sanity.io/files/p/d/doc.pdf" };

  it("embeds the PDF on desktop", () => {
    window.innerWidth = 1280;
    const { container } = render(<FileModule item={item} />);
    expect(container.querySelector("iframe")).toHaveAttribute("src", item.fileUrl);
  });

  it("links to the PDF on mobile and follows resizes", () => {
    window.innerWidth = 500;
    const { container } = render(<FileModule item={item} />);
    const a = screen.getByRole("link", { name: "Ouvrir le PDF" });
    expect(a).toHaveAttribute("href", item.fileUrl);
    expect(a.getAttribute("rel")).toContain("noopener");
    act(() => {
      window.innerWidth = 1280;
      window.dispatchEvent(new Event("resize"));
    });
    expect(container.querySelector("iframe")).not.toBeNull();
  });

  it("renders nothing without a file", () => {
    const { container } = render(<FileModule item={{ fileUrl: "" }} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("CustomHtml", () => {
  const files = [{ title: "Transcription", files: [{ asset: { url: "https://cdn.sanity.io/f.pdf" } }] }];

  it("renders the editor HTML and the attached files", () => {
    render(
      <CustomHtml title="t" html="<p id='x'>Bonjour</p>" item={{ isAddFiles: true, fileGroup: files }} />,
    );
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
    const a = screen.getByRole("link", { name: "Lien externe" });
    expect(a).toHaveAttribute("href", "https://cdn.sanity.io/f.pdf");
    expect(a).toHaveAttribute("target", "_blank");
  });

  it("hides the files unless enabled", () => {
    render(<CustomHtml title="t" html="<p>x</p>" item={{ isAddFiles: false, fileGroup: files }} />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("DateHourFormat", () => {
  const iso = "2026-03-07T14:30:00";

  it.each([
    ["fullDate", "7 mars"],
    ["fullDateWithYear", "7 mars 2026"],
    ["shortDate", "07/03"],
    ["shortDateWithYear", "07/03 2026"],
    ["shortHour", "14H"],
    ["default", "7 mars 2026 à 14H"],
  ])("%s", (formatType, expected) => {
    render(<DateHourFormat dateString={iso} formatType={formatType} />);
    const time = screen.getByText(expected);
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("datetime", iso);
  });
});

describe("ContactFormEmail", () => {
  it("renders visitor input as text, never as markup", () => {
    const { container } = render(
      <ContactFormEmail
        name="<img src=x onerror=alert(1)>"
        email="a@b.fr"
        title="t"
        message="<script>alert(1)</script>"
      />,
    );
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container).toHaveTextContent("<script>alert(1)</script>");
  });
});
