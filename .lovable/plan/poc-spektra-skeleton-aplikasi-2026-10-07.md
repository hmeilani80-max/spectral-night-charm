# POC SPEKTRA — Skeleton Aplikasi

## Tujuan
Membangun proof of concept SPEKTRA sebagai satu workspace operasional yang terintegrasi, dengan fokus utama pada Beranda Pimpinan. Tampilan menggunakan dark mode profesional dengan aksen biru–cyan yang redup, kontras jelas, dan tanpa efek neon berlebihan.

## Cakupan

### 1. Kerangka aplikasi
- Membuat sidebar kiri yang dapat diperkecil, berisi identitas SPEKTRA, Beranda, Situasi, Strategi, Aksi, Dampak, Arsip & Pengetahuan, serta Administrasi di bagian bawah.
- Membuat topbar ringkas dengan pencarian global, notifikasi, dan profil pengguna.
- Menyediakan versi layar kecil dengan navigasi yang tetap mudah dibuka dan digunakan.
- Menjaga hierarki visual padat namun rapi, dengan tipografi modern, garis pembatas halus, status berwarna terkontrol, dan animasi seperlunya.

### 2. Beranda Pimpinan
- Menampilkan periode default **7 Hari Terakhir**.
- Membuat Ringkasan Pimpinan berupa satu paragraf dan beberapa sorotan utama.
- Menampilkan empat indikator: Isu Dipantau, Isu Prioritas, Risiko Tinggi, dan Respons Berjalan.
- Membuat bagian Perlu Perhatian dengan isu fiktif yang realistis, tingkat risiko, perkembangan singkat, dan tautan menuju Situasi.
- Membuat Rekomendasi Tindak Lanjut, Respons Berjalan, dan Dampak Terkini dengan data dummy yang saling konsisten.
- Menjaga halaman sebagai briefing eksekutif, tanpa grafik jaringan, tabel mentah, atau filter analitik berlebihan.

### 3. Halaman area lain
- Membuat halaman terpisah untuk Situasi, Strategi, Aksi, Dampak, Arsip & Pengetahuan, dan Administrasi.
- Setiap halaman menampilkan judul, tujuan area, konteks singkat, dan kerangka konten yang sesuai brief tanpa mengembangkan analisis Situasi secara detail.
- Arsip & Pengetahuan mendapat pengalaman pencarian dummy dengan kategori Semua, Situasi, Kajian, Konten, Laporan, dan Dokumen.
- Administrasi hanya menampilkan skeleton Pengguna, Peran & Hak Akses, Sumber Data, dan Konfigurasi Sistem.

### 4. Interaksi prototype
- Navigasi antarlaman dan status menu aktif berfungsi.
- Sidebar dapat diperkecil dan dibuka kembali.
- Pemilih periode, pencarian global, notifikasi, profil, dan pencarian arsip memiliki interaksi prototype sederhana menggunakan data lokal.
- Tombol pada Beranda mengarah ke area yang tepat.
- Seluruh data menggunakan isu, aktor, media, komunitas, dan organisasi fiktif sesuai brief.

### 5. Validasi
- Memberi metadata halaman yang unik dan relevan untuk setiap halaman.
- Memastikan tampilan tidak tumpang tindih pada desktop dan layar kecil.
- Menjalankan pengujian navigasi yang ada dan memeriksa alur utama melalui preview.

## Detail teknis
- Tetap memakai TanStack Start, React, Vite, Tailwind, dan komponen UI yang sudah tersedia.
- Menggunakan route terpisah untuk setiap bagian dan layout bersama untuk shell aplikasi.
- Menempatkan token warna, tipografi, radius, dan bayangan pada sistem desain global; tidak memakai warna langsung di komponen.
- Menggunakan data dummy lokal saja; tidak menambah autentikasi, API, database, ekspor, crawling, atau model prediksi.
- Tidak mengubah integrasi eksternal atau data produksi apa pun.

## Di luar cakupan
- Detail analytical workspace Situasi yang menunggu brief berikutnya.
- Backend, permission flow lengkap, notifikasi produksi, dan integrasi data nyata.