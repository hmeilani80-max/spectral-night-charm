# Master Revision SINTESA — 15 revisi lintas modul

Tanpa redesign, tanpa ganti warna/nama menu, tanpa menghapus fitur. Semua data dummy mengikuti skenario Demonstrasi Nasional / Respons Informasi Demonstrasi Nasional. Simulasi diberi label jelas.

## Urutan pengerjaan (per gelombang)

**Gelombang 1 — Situasi (Revisi 1, 2, 3, 4, 13)**
- Eksplorasi > Narasi: section "Analisis Pola Manipulasi Informasi" (4 kategori: 186/94/312/57, tren, platform dominan, narasi terkait, contoh). Klik kategori membuka tabel konten dasar dengan alasan terdeteksi dan link sumber. Label "Indikasi Pola", tanpa klaim niat. Ditambah timeline narasi naik/turun.
- Eksplorasi > Aktor: klik aktor (network, tabel, cluster) membuka Detail Akun (panel samping lebar) dengan header + 4 tab: Ringkasan, Riwayat Unggahan, Pola Interaksi & Relasi (peta relasi sederhana), Perubahan Perilaku (contoh @forum_mahasiswa 42→76, 1.850→3.240, 420→260) + AI insight netral. Contoh akun di X, Instagram, TikTok, Facebook.
- Eksplorasi > Sentimen: toggle Unggahan | Komentar. Komentar: 8.420 total, 18/29/53%, tren, emosi, platform, tabel komentar; klik membuka posting induk + konteks. Catatan bahwa metrik terpisah dari unggahan.
- Klik grafik/elemen memfilter tabel terkait dan mempertahankan konteks situasi.
- EWS: level Rendah/Sedang/Tinggi/Kritis, waktu pertama terdeteksi, pemicu, status penanganan, penanggung jawab (Demonstrasi Nasional: Tinggi, Dalam Pemantauan, 3 Okt 2026).
- Ikon lonceng di topbar: panel notifikasi untuk EWS Tinggi/Kritis (nama, level, waktu, alasan, tombol Lihat Situasi) + mockup ponsel kecil "Notifikasi Mobile" (simulasi).
- Risiko & Prediksi: "Riwayat Peringatan & Penanganan" (timeline 3–9 Okt, status operasional), tombol Lihat Strategi Terkait dan Lihat Perubahan di Dampak.

**Gelombang 2 — Arsip & data internal (Revisi 5)**
- Tombol jadi "+ Tambah Data / Dokumen" dengan 3 pilihan; form Laporan Lapangan minimal (owner otomatis), AI ringkasan/ekstraksi/tag/situasi relevan (simulasi).
- Detail data internal: "Verifikasi & Keterkaitan Sumber" (didukung / berbeda / belum terverifikasi; contoh Laporan Lapangan — Demonstrasi Jakarta 3/1/1), tiap temuan membuka sumber.
- Situasi > Ringkasan: section "Data Internal Terkait". Strategi > Kajian & Sumber: kategori "Data Internal / Laporan Lapangan".

**Gelombang 3 — Administrasi & Distribusi (Revisi 6, 7, 9, 14)**
- Submenu baru "Pengelolaan Akun Sosial" di bawah Administrasi (`/administrasi/akun-sosial`): summary, tabel 6 platform, detail akun, grup, label, hak akses (Viewer/Operator/Pengelola Akun/Administrator) dan matriks kewenangan; simulasi koneksi.
- Akun dari halaman ini menjadi sumber pilihan akun di Distribusi Sosial > Target (memindahkan daftar akun ke satu sumber bersama).
- Distribusi Sosial > Target: "Rekomendasi Jadwal Publikasi" per platform (X 09–11, IG 11–13, TikTok 17–20, FB 10–12, YT 18–21, Threads 12–14), CTA "Gunakan Jadwal Rekomendasi", bisa diubah, label estimasi simulasi. Menggantikan rekomendasi jendela umum sebelumnya.
- Distribusi News > Adaptasi & Jadwal: "Rekomendasi Jadwal Tayang per Wilayah" dengan zona WIB/WITA/WIT, "Terapkan Rekomendasi ke Semua Kanal"; jadwal ikut order dan terlihat di view Pengelola Kanal beserta deadline. Tidak auto-publish.
- Produksi > Detail: section "Rencana Publikasi" diturunkan dari distribusi Sosial/News yang memakai konten; kosong → "Belum memiliki rencana publikasi".

**Gelombang 4 — Strategi, Dampak, Beranda (Revisi 8, 10, 11, 12)**
- Strategi > Rekomendasi & Rencana: "Paket Bahan Tanggapan" (3 pilihan pesan, talking points, fakta pendukung, FAQ, Juru Bicara dengan status "Belum Ditetapkan", edit ringan), aksi Generate Ulang, Lihat Sumber, Teruskan ke Produksi (prefill form Produksi), Simpan ke Arsip.
- Dampak Sosial: Views, Interactions, Shares, Watch Time (video), Published Posts per platform & per konten. News: Published Articles, Verified URLs, Website Visits, Page Views; "Data Tidak Tersedia" bila kosong; drilldown ke konten/URL; tidak ada total gabungan.
- Generate Laporan: periode Harian/Mingguan/Bulanan/Per Situasi, format Document/Spreadsheet/Presentation/PDF, "Jadwalkan Laporan Otomatis" + daftar "Laporan Terjadwal" (3 contoh). Laporan yang dihasilkan tercatat di Arsip.
- Beranda: perkuat 5 section dashboard pimpinan (Ringkasan Situasi, Perlu Perhatian, Tren Jangka Pendek, Respons Berjalan, Rekomendasi Tindak Lanjut), semua card dapat diklik, tanpa tabel mentah/network.

## Keterhubungan (Revisi 15)
Arsip → Situasi → Kajian; Aktor → Detail Akun; Notifikasi → EWS → Strategi; Bahan Tanggapan → Produksi; Akun Sosial → Distribusi Sosial; Distribusi → Rencana Publikasi Produksi; Laporan → Arsip.

## Catatan teknis
- Data baru di modul fitur yang ada: `features/situasi` (pola manipulasi, akun, komentar, EWS level/riwayat), `features/arsip` (laporan lapangan, verifikasi; laporan Dampak didorong ke state arsip via provider), `features/aksi/sosial.ts` (akun bersama + jadwal per platform, fungsi murni), `features/aksi/data.ts` (jadwal wilayah News, rencana publikasi turunan), `features/strategi` (paket bahan), `features/dampak` (metrik kanal, laporan terjadwal).
- Arsip butuh provider di `__root` agar laporan Dampak dan laporan lapangan muncul lintas halaman (masih in-memory).
- Route baru: `administrasi.tsx` jadi layout + `administrasi.index.tsx` + `administrasi.akun-sosial.tsx`; sidebar diberi submenu.
- Tes baru untuk aturan: angka pola manipulasi, perubahan perilaku akun, sentimen komentar, jadwal rekomendasi per platform/wilayah, rencana publikasi turunan, tidak ada total gabungan Social/News. Playwright cek tiap alur utama.
- Catat keputusan struktur baru di AGENTS.md; roadmap.md diperbarui per gelombang.
