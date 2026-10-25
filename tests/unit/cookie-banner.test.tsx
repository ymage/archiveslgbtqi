import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import CookieBanner from "@/app/(next)/components/ui/CookieBanner";

beforeEach(() => localStorage.clear());

describe("CookieBanner", () => {
  it("shows on first visit and hides after Ok", async () => {
    render(<CookieBanner />);
    await userEvent.click(await screen.findByRole("button", { name: "Ok" }));
    expect(screen.queryByRole("button", { name: "Ok" })).toBeNull();
    expect(localStorage.getItem("firstVisit")).toBe("true");
  });

  it("stays hidden on later visits", () => {
    localStorage.setItem("firstVisit", "true");
    render(<CookieBanner />);
    expect(screen.queryByRole("button", { name: "Ok" })).toBeNull();
  });
});
