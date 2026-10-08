# Aksi / Produksi — Brief Final

Produksi dirombak menjadi sistem produksi konten "AI-first": sedikit input → Generate → Review → Approve. Satu baris Produksi = satu output konten.

## Yang berubah untuk pengguna

**Daftar Produksi**
- Judul "Produksi" + subtext sesuai brief, tombol **+ Buat Produksi**.
- Filter: Tipe (Semua / News / Visual / Video / Audio), Status, Sumber (Strategi / Manual).
- Tabel: Judul, Tipe, Sumber, Status Produksi, Approval, Tujuan. Klik baris membuka workspace output.
- Data contoh: Artikel Demonstrasi Nasional (Approved), Video Penjelasan Situasi (Review), Carousel Informasi Publik (Approved), Audio Ringkasan Situasi (Draft, Manual).

**Buat Produksi (dialog bertahap)**
1. Pilih Sumber: Dari Strategi (brief terisi otomatis: pesan utama, poin pendukung, audience, wilayah, kanal, sumber) atau Manual.
2. Brief ringkas: Judul/Tema, Pesan Utama, Poin/Fakta Pendukung, Arahan Gaya (opsional: Faktual, Tenang, Informatif, Ringkas).
3. Pilih banyak output: News Article, Infografis, Carousel, Video Pendek, Audio/Podcast.
4. **Generate Produksi** → sistem membuat item terpisah (mis. 3 pilihan = 3 item), masing-masing dengan siklus dan approval sendiri. Ada simulasi "Generating…" singkat.

**Workspace per output** (breadcrumb Aksi / Produksi / judul; tab Brief · Produksi · Editorial · Approval · Riwayat; isi tab Produksi berbeda per tipe)
- **News Article:** Judul, Subjudul, Lead, Body, Sumber, Tag — bisa diedit. Mode Edit | Preview (tampilan artikel final). Bantuan AI ringan: Perbaiki Judul, Alternatif Lead, Ringkas, Perjelas, Sesuaikan Tone, Cek Konsistensi. Tabel sumber yang digunakan.
- **Video Pendek:** input Durasi 30/45/60, Format 9:16/16:9, Voice-over, Gaya. Generate Video menampilkan pipeline otomatis (Script → Scene → Visual → Voice-over → Subtitle → Final), lalu pemutar video tiruan + status durasi/rasio/subtitle/VO. Regenerate keseluruhan.
- **Infografis:** satu preview kreatif + Regenerate + edit teks ringan.
- **Carousel:** semua slide tampil sebagai kartu (Headline, Konteks, Fakta, Klarifikasi, Penutup) + Regenerate + edit teks ringan.
- **Audio/Podcast:** durasi, gaya suara; pemutar tiruan + transkrip.
- **Editorial Check otomatis** per tipe (✓ / ⚠), bahasa non-teknis.
- **Approval:** Belum Diajukan → Menunggu Review → Perlu Revisi / Approved. Setelah approved: "Siap digunakan di Distribusi News/Sosial" — bukan publish.
- **Riwayat:** v1 Generated, v2 Edited/Regenerated, v3 Approved.
- **Traceability:** Situasi → Strategi (dengan link) → item ini, atau "Produksi Manual".

**Dampak ke halaman lain**
- Persetujuan menampilkan approval per output (antrean "Pesan Utama" terpisah dihapus).
- Distribusi Sosial hanya memilih aset approved Visual/Video/Audio; Distribusi News hanya News Article approved. Caption per platform tetap dibuat di Distribusi Sosial.
- Data contoh campaign & order disesuaikan agar merujuk ke item Produksi baru.

## Detail teknis
- `src/features/aksi/data.ts`: ganti `ProductionItem` (paket berisi outputs) menjadi item tunggal: `{ id, title, type, family, dest, source, brief{theme,message,points,style}, productionStatus: Draft|Generating|Generated, approval: Belum Diajukan|Menunggu|Perlu Revisi|Disetujui, version, history[], content (union per tipe), checks[] }`. Generator dummy deterministik per tipe (artikel, slide, script, transkrip) dari brief. Aturan: `isEligible` tetap (approved + dest), status produksi dan approval terpisah.
- `context.tsx`: `createProductions(brief, types[])`, `generate(id)` (timeout simulasi), `updateContent`, `assist(id, action)`, `submit(id)`, `decide`; queue dibangun dari item; Campaign/Order memakai `contentIds` = id item Produksi.
- Route: tulis ulang `aksi.produksi.index.tsx` dan `aksi.produksi.$id.tsx` (komponen workspace per tipe di `src/features/aksi/production-workspaces.tsx`); sesuaikan picker di `aksi.distribusi-sosial.*`, `aksi.distribusi-news.*`, dan `aksi.persetujuan.tsx`.
- Brief otomatis dari Strategi memakai handoff/strategi yang ada di `useStrategies`.
- Test: tambah tes aturan — 3 output terpilih menghasilkan 3 item; item approved eligible ke tujuan yang benar; approved konten ≠ approved distribusi. Verifikasi Playwright desktop + mobile.
