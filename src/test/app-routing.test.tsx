import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it.each(["/", "/situasi", "/situasi/demonstrasi-nasional", "/situasi/demonstrasi-nasional/eksplorasi", "/situasi/demonstrasi-nasional/risiko-prediksi", "/strategi", "/aksi", "/dampak", "/arsip", "/administrasi"])(
    "matches a SPEKTRA page for %s instead of falling back to not found",
    (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

      const matches = router.matchRoutes(path);

      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    },
  );
});

describe("Situation risk profiles", () => {
  it("keeps Demonstrasi Nasional risk metrics scoped to that situation", async () => {
    const { getRiskProfile, systemFindings } = await import("@/features/situasi/data");
    const situation = systemFindings.find((item) => item.slug === "demonstrasi-nasional");
    expect(situation).toBeDefined();
    if (!situation) return;
    const profile = getRiskProfile(situation);
    expect(profile.activeRegions).toBe("6");
    expect(profile.warningCount).toBe("7");
    expect(profile.riskDetails[0]?.indicator).toBe("Aksi meluas ke sejumlah kota");
    expect(profile.riskDetails.some((item) => item.indicator === "Dugaan Serangan Siber")).toBe(false);
  });
});
