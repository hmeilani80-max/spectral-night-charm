# Revisi Area Situasi SPEKTRA

## Tujuan
Mengubah halaman awal Situasi menjadi pintu masuk untuk dua sumber yang berbeda: temuan otomatis EWS dan topik yang dibuat pengguna. Keduanya tetap membuka satu workspace analisis yang sama, tanpa menggandakan objek data.

## Perubahan utama
- Jadikan `/situasi` sebagai katalog dengan filter umum, ringkasan EWS, kartu Temuan Sistem, dan daftar Topik Pantauan.
- Tambahkan aksi **Pantau Topik Ini** pada temuan EWS. Status temuan berubah menjadi dipantau dan item yang sama tampil sebagai referensi di Topik Pantauan.
- Tambahkan dialog **Buat Topik Pantauan** berisi nama, deskripsi, keyword opsional, dan pilihan platform. Topik baru langsung muncul pada daftar selama sesi POC.
- Tambahkan detail dinamis `/situasi/:slug` yang menampilkan sumber, status, waktu/deteksi, alasan dan indikator EWS, atau metadata pemantauan manual.
- Pertahankan satu set halaman analitik per situasi: Ringkasan, Eksplorasi, serta Risiko & Prediksi. Navigasi dan identitas item aktif konsisten pada ketiganya.

## Data dan interaksi
- Gunakan data lokal sesuai brief: Demonstrasi Nasional, Dugaan Serangan Siber, Stabilitas Harga Pangan, Persepsi terhadap Kebijakan Strategis, dan Isu Keamanan Regional.
- Tidak menambah backend. Pembuatan topik dan perubahan status EWS bersifat prototype dalam sesi aktif.
- Pertahankan visual, filter, tabel, drawer sumber, dan bahasa prediksi netral yang sudah ada.

## Verifikasi
- Uji rute katalog dan detail dinamis.
- Uji alur EWS → Pantau Topik Ini → muncul di Topik Pantauan → buka detail bersama.
- Uji alur buat topik melalui dialog dan periksa tampilan desktop serta mobile.
