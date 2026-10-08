# Distribusi Sosial — Brief Final

Ubah Distribusi Sosial menjadi sistem orkestrasi publikasi: pilih konten approved → target → sistem menyiapkan paket publikasi → review → persetujuan → eksekusi otomatis. Data tetap dummy lokal.

## Halaman utama `/aksi/distribusi-sosial`
- Judul, deskripsi baru, CTA "+ Buat Distribusi" (membuka wizard, bukan dialog).
- 5 kartu: Draft, Menunggu Persetujuan, Dijadwalkan, Sedang Berjalan, Selesai.
- Tabel: Nama, Konten (n asset), Platform, Akun, Periode, Status; filter Status, Platform, Tanggal, Konten sumber; klik baris → detail.
- Seed: "Respons Informasi Demonstrasi Nasional" (3 asset, X/IG/TikTok, 12 akun, 9–10 Okt, Menunggu Persetujuan) dan "Klarifikasi Informasi Publik" (1 video, Sedang Berjalan).

## Wizard `/aksi/distribusi-sosial/baru` (4 tahap)
1. Rencana: nama, kartu konten Approved (preview, tipe, versi, status), tujuan (5 opsi), platform (6, dengan saran sesuai tipe asset), arahan tambahan opsional.
2. Target: akun via Group / Label / Platform / individual; kartu akun dengan status Ready/Busy/Unavailable (hanya Ready bisa dipilih); waktu Segera atau Jadwalkan (tanggal mulai–selesai, jam aktif); toggle "Atur waktu posting otomatis"; ringkasan skala (asset, akun, platform, hari, posting).
3. Paket Publikasi: tombol "Siapkan Semua Paket Publikasi" membuat semua unit (asset × akun × platform cocok, waktu dibagi bertahap), caption otomatis per karakter platform dengan variasi antar akun; kartu dengan Edit / Regenerate / Preview; filter Platform, Akun, Asset, Tanggal, Status.
4. Review & Approval: ringkasan, readiness check (✓/⚠, blokir jika ada masalah wajib), 3 preview sampel (X, IG, TikTok) + "Lihat Semua", CTA "Ajukan Persetujuan Distribusi" → status Menunggu Persetujuan, masuk Persetujuan → Distribusi.

## Detail `/aksi/distribusi-sosial/$id` (tab)
- Ringkasan: metadata, status approval & eksekusi, lineage Strategi → Produksi → Approved Content → Distribusi Sosial.
- Paket Publikasi: tabel semua posting, klik untuk asset/caption/jadwal/preview; editable hanya saat Draft / Perlu Perubahan, lalu bisa diajukan ulang.
- Persetujuan: status, approver, waktu, versi, catatan, riwayat keputusan.
- Eksekusi: terkunci sampai Disetujui. Setelah disetujui: Segera → Sedang Berjalan, Terjadwal → Dijadwalkan; tombol simulasi jalankan; ringkasan Scheduled/Published/Failed/Cancelled, tabel Planned vs Actual, Failed dengan alasan + Retry. Tanpa analitik engagement.
- Riwayat: audit trail berwaktu.

## Status
Distribusi: Draft, Menunggu Persetujuan, Perlu Perubahan, Disetujui, Dijadwalkan, Sedang Berjalan, Selesai, Ditolak, Dibatalkan. Posting: Ready, Scheduled, Publishing, Published, Failed, Cancelled.

## Technical details
- `src/features/aksi/data.ts`: perluas tipe `Campaign` (purpose, direction, accounts terstruktur, timing, staggered, posts[], approvals history, history); daftar akun dummy (8 nama brief, diperluas ke 12+ lintas platform dengan group/label/status); fungsi murni `buildPosts`, `captionFor`, `readinessChecks`, `statusAfterApproval`.
- `context.tsx`: aksi createCampaign/updateCampaign/preparePosts/editPost/regeneratePost/submitCampaign/runExecution/retryPost; `decide` Distribusi Sosial memetakan Disetujui → Dijadwalkan/Sedang Berjalan, Minta Revisi → Perlu Perubahan, Tolak → Ditolak. Queue Persetujuan tetap kompatibel.
- Route baru `aksi.distribusi-sosial.baru.tsx`; tulis ulang index dan `$id`; sesuaikan detail Persetujuan untuk menampilkan ringkasan paket.
- Tes Vitest: hanya konten Approved bisa dipilih; akun non-Ready ditolak; jumlah posting 24 untuk skenario dummy; submit diblokir oleh readiness ⚠; eksekusi terkunci sebelum Disetujui; mapping status setelah approval.
