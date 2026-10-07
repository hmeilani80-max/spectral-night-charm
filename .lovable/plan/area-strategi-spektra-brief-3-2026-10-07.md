# Area Strategi SPEKTRA (BRIEF 3)

Mengubah halaman Strategi dari skeleton menjadi workspace keputusan & perencanaan, terhubung dengan Situasi dan Aksi. Data tetap dummy lokal.

## Struktur
```text
/strategi            Daftar Strategi + "+ Buat Strategi"
/strategi/$slug      Detail Strategi (3 tab: Ringkasan, Kajian & Sumber, Rekomendasi & Rencana)
/aksi                menerima task dari "Lanjutkan ke Aksi"
```

## 1. Daftar Strategi
- Tabel: Strategi, Sumber, Situasi, Status, Terakhir Diperbarui (3 contoh dari brief).
- Status: Draf, Dalam Penyusunan, Siap Dilaksanakan, Diteruskan ke Aksi.

## 2. Buat Strategi (dialog bertahap)
- Langkah 1: dua pilihan — "Pilih dari Situasi" / "Buat Strategi Baru".
- Opsi A: daftar EWS + Topik Pantauan (nama, level risiko, sumber). Memilih situasi langsung membuat strategi dengan konteks otomatis, tanpa mengetik ulang.
- Opsi B: form Judul, Konteks, Tujuan Komunikasi, Target Audiens, Wilayah/Kanal/Referensi (opsional), tombol "Analisis Konteks"; sumber = Input Manual.

## 3. Detail Strategi
- Header: breadcrumb Strategi / nama, Sumber (Situasi → nama situasi, dapat diklik), Status, tombol "← Semua Strategi" dan "← Kembali ke Situasi".
- Ringkasan: metric konteks (Risiko Tinggi, +63%, X/TikTok/News, Jakarta & Bandung, 46% negatif, narasi dominan, +428 aktor), ringkasan + highlight, Tujuan Strategi yang bisa diedit, Fokus Utama, tautan "Lihat Data Situasi".
- Kajian & Sumber: ringkasan kajian; tiga kolom Fakta Terverifikasi / Klaim Berkembang / Belum Terverifikasi; tabel Sumber Pendukung; 4 Insight Strategis.
- Rekomendasi & Rencana: alur logika ringkas, Arah Strategi, label tipe strategi (News-led / Social-led / Integrated) dari platform dominan, Pendekatan Kanal per platform, Simulasi 3 skenario (pilih pendekatan; label "Direkomendasikan berdasarkan Situasi" tetap bisa diganti), Rekomendasi Utama, Action Plan berupa task yang mengikuti platform dominan.
- CTA "Lanjutkan ke Aksi": status menjadi "Diteruskan ke Aksi", lalu membuka Aksi dengan task yang terbawa.

## 4. Aksi (minimal)
- Menampilkan rencana "Pelaksanaan Respons Informasi <situasi>" beserta daftar task dari strategi, plus tautan kembali ke strategi. Tanpa fitur pengerjaan.

## Detail teknis
- Modul baru `src/features/strategi/` (data, context, components); provider strategi dipasang di `__root` agar konteks terbawa Situasi → Strategi → Aksi.
- Generator rekomendasi/task dummy berdasarkan `platforms` & profil risiko situasi (memakai `getRiskProfile`).
- `SituationProvider` dipindah ke root supaya Strategi bisa membaca EWS/Topik (tetap satu sumber data).
- Route baru: `strategi.tsx` (layout), `strategi.index.tsx`, `strategi.$slug.tsx`; head metadata per rute.
- Tambah tes: strategi dari Demonstrasi Nasional menghasilkan tipe Integrated dan task (Artikel Utama, 3 X posts, video vertikal, carousel); rute strategi render.
- Verifikasi Playwright desktop & mobile; update roadmap.md dan AGENTS.md.
