import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it.each(["/", "/situasi", "/situasi/demonstrasi-nasional", "/situasi/demonstrasi-nasional/eksplorasi", "/situasi/demonstrasi-nasional/risiko-prediksi", "/strategi", "/strategi/respons-informasi-demonstrasi-nasional", "/aksi/produksi", "/aksi/produksi/PRD-021", "/aksi/persetujuan", "/aksi/distribusi-sosial", "/aksi/distribusi-sosial/CMP-014", "/aksi/distribusi-news", "/aksi/distribusi-news/DN-012", "/dampak", "/arsip", "/administrasi"])(
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

describe("Strategy recommendations", () => {
  it("derives an Integrated plan for Demonstrasi Nasional (X, TikTok, News)", async () => {
    const { getChannelApproach, getActionPlan } = await import("@/features/strategi/data");
    const platforms = ["X", "TikTok", "News"];
    expect(getChannelApproach(platforms)).toBe("Integrated");
    const tasks = getActionPlan(platforms);
    expect(tasks.map((t) => t.title)).toEqual(["Artikel Utama", "Rapid Update", "Video Penjelasan", "Visual Summary"]);
    expect(tasks[1]?.count).toBe("3 post");
  });
  it("uses News-led and Social-led when only one channel family dominates", async () => {
    const { getChannelApproach } = await import("@/features/strategi/data");
    expect(getChannelApproach(["News"])).toBe("News-led");
    expect(getChannelApproach(["TikTok", "Instagram"])).toBe("Social-led");
  });
});

describe("Aksi approval gates", () => {
  it("blocks derived content until the Pesan Utama is approved", async () => {
    const { canProduceOutputs } = await import("@/features/aksi/data");
    expect(canProduceOutputs({ messageApproval: "Menunggu" })).toBe(false);
    expect(canProduceOutputs({ messageApproval: "Disetujui" })).toBe(true);
  });
  it("only lets approved, eligible content into each distribution", async () => {
    const { isEligible } = await import("@/features/aksi/data");
    expect(isEligible({ approval: "Disetujui", dest: ["News"] }, "News")).toBe(true);
    expect(isEligible({ approval: "Disetujui", dest: ["News"] }, "Sosial")).toBe(false);
    expect(isEligible({ approval: "Menunggu", dest: ["Sosial"] }, "Sosial")).toBe(false);
  });
  it("requires distribution approval before execution", async () => {
    const { distributionReadiness } = await import("@/features/aksi/data");
    expect(distributionReadiness("Disetujui", "Menunggu")).toBe("Menunggu Approval Distribusi");
    expect(distributionReadiness("Disetujui", "Disetujui")).toBe("Siap Eksekusi");
    expect(distributionReadiness(null, "Disetujui")).toBe("Belum dapat didistribusikan");
  });
  it("has 38 regional channels plus 1 national channel", async () => {
    const { NEWS_CHANNELS, REGIONAL_CHANNELS } = await import("@/features/aksi/data");
    expect(REGIONAL_CHANNELS).toHaveLength(38);
    expect(NEWS_CHANNELS).toHaveLength(39);
  });
});
