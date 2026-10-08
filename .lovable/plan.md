# Aksi / Persetujuan — Brief Final

Persetujuan menjadi "decision inbox": review → keputusan → jika perlu revisi, kembali ke service asal. Tidak ada editor di halaman ini.

## Yang berubah untuk pengguna

**Halaman utama (Aksi / Persetujuan)**
- Kartu ringkas: Menunggu Review, Persetujuan Konten, Persetujuan Distribusi, Perlu Revisi.
- Tab: Semua | Konten | Distribusi. Filter tambahan: Status, Jenis, Service asal, Pengaju, Tanggal (Hari ini / 7 hari).
- Tabel: Item, Jenis (mis. "Konten · News", "Distribusi · Sosial"), Sumber, Pengaju, Diajukan ("12 menit lalu"), Status. Klik baris membuka detail. Tombol keputusan cepat di tabel dihapus — keputusan diambil di detail.
- Status disederhanakan: Menunggu Review, Perlu Revisi, Disetujui, Ditolak.

**Detail Persetujuan Konten** (Aksi / Persetujuan / judul)
- Metadata: Jenis, Sumber, Sumber Strategi, Pengaju, Waktu pengajuan, Versi, Approver (role: Supervisor).
- Preview hanya-baca sesuai tipe: artikel lengkap dengan foto, pemutar video + durasi/subtitle/VO, infografis final, semua slide carousel, pemutar audio + transkrip.
- Konteks: Pesan Utama, Fakta/Sumber pendukung, Automated Editorial Check (✓/⚠).
- Keputusan: Setujui / Minta Revisi / Tolak (catatan wajib untuk revisi/tolak). Setelah disetujui: "Siap digunakan di Distribusi News/Sosial — belum dipublikasikan".
- Link "Buka di Produksi".

**Detail Persetujuan Distribusi Sosial**
- Campaign, konten (dengan status approved), platform, jumlah akun, jadwal, pola distribusi, volume per platform, content matrix ringkas.
- CTA: Setujui Distribusi / Minta Perubahan / Tolak. Link "Buka di Distribusi Sosial". Tombol publish di Distribusi Sosial tetap nonaktif sampai disetujui.

**Detail Persetujuan Distribusi News**
- Order, artikel + status approval konten, target "16 dari 39 kanal" (1 nasional + 15 wilayah), jadwal, aturan adaptasi.
- CTA sama. Order baru bisa dikirim ke kanal setelah disetujui.

**Riwayat Keputusan** (semua detail)
- Timeline: waktu, pelaku, keputusan, versi, catatan. Riwayat lama tidak hilang; jika konten approved diedit/diregenerate menjadi versi baru, persetujuan lama tidak berlaku dan item perlu diajukan ulang (tercatat "v3 menunggu").

**Data contoh** (melanjutkan skenario Demonstrasi Nasional)
- Artikel Informasi Demonstrasi Nasional — v2, 4 lolos 1 peringatan, Menunggu Review.
- Video Penjelasan Demonstrasi — v1, Menunggu Review.
- Carousel Informasi Demonstrasi — v2, Perlu Revisi.
- Campaign Respons Demonstrasi Nasional — X/Instagram/TikTok, 18 akun, Menunggu Review.
- Publikasi Artikel Demonstrasi — 16 dari 39 kanal, Menunggu Review.
- Riwayat contoh sesuai brief (revisi lalu disetujui, minta perubahan jadwal TikTok, dst).

## Detail teknis
- `src/features/aksi/data.ts`: tambah `ApprovalRecord { at, actor, decision, version?, note? }`, field `submittedBy`, `submittedAt`, `approvals: ApprovalRecord[]` pada ProductionItem/Campaign/NewsOrder; tambah field campaign (jadwal, pola, volume per platform) dan order (jadwal, adaptasi). Label UI "Menunggu Review" dipetakan dari status `Menunggu`. Seed diperbarui sesuai daftar di atas.
- `context.tsx`: `submit*`/`decide` menambahkan record ke `approvals` (actor "Supervisor"); QueueItem mendapat `submittedBy`, `submittedAt`, `subtype`. Edit/regenerate pada item Disetujui sudah membatalkan approval — tambah record "Approval v{n} tidak berlaku".
- Route baru `src/routes/aksi.persetujuan.$kind.$id.tsx` (kind: konten | sosial | news); `aksi.persetujuan.tsx` jadi layout dengan `<Outlet/>` + `aksi.persetujuan.index.tsx` untuk inbox. Head metadata per route.
- Preview hanya-baca diambil dari komponen preview yang sudah ada di `production-workspaces.tsx` (diekspor tanpa kontrol edit).
- Test: approval mencatat riwayat per versi; edit setelah approved mengembalikan status ke belum disetujui tanpa menghapus riwayat; campaign/order tidak bisa dieksekusi tanpa approval distribusi. Verifikasi Playwright desktop + mobile.
