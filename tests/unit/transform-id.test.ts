import { describe, expect, it } from "vitest";
import { transformId } from "@/app/(next)/utils/TransforId";

describe("transformId", () => {
  it("lowercases, strips accents and hyphenates spaces", () => {
    expect(transformId("Été Passé")).toBe("ete-passe");
  });
  it("turns ' / ' into a single hyphen", () => {
    expect(transformId("Arts / Culture")).toBe("arts-culture");
  });
});
