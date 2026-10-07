# SPEKTRA — Paket Halaman Situasi

## Tujuan
Mengembangkan area Situasi dari skeleton menjadi analytical intelligence workspace sesuai Brief 2, tetap di dalam platform SPEKTRA dari brief sebelumnya. Tema dark profesional, aksen biru-cyan tenang, navigasi utama, topbar, dan identitas produk yang sudah ada tetap dipertahankan.

## Struktur halaman
- **Ringkasan Situasi** di `/situasi`: filter periode/platform/wilayah, empat metric utama, ringkasan dan highlight, isu prioritas, tren percakapan, aktor dan narasi dominan, sentimen, wilayah, serta tabel data detail.
- **Eksplorasi Situasi** di `/situasi/eksplorasi`: satu halaman dengan tab Aktor, Narasi, serta Sentimen & Emosi. Setiap tab memuat metric, ringkasan, visual analitis, ranking/cluster, dan tabel detail sesuai data dummy brief.
- **Risiko & Prediksi** di `/situasi/risiko-prediksi`: metric risiko, ringkasan, isu prioritas, matriks risiko, proyeksi 7/14/30 hari, prediksi penyebaran, early warning, pola aktivitas tidak biasa, dan tabel detail risiko.
- Menambahkan sub-navigation Situasi yang konsisten pada ketiga halaman, tanpa mengubah navigasi area utama SPEKTRA.

## Data dan interaksi prototype
- Menggunakan skenario utama **Demonstrasi Nasional** serta isu pendukung, aktor, narasi, wilayah, platform, sentimen, emosi, dan angka dummy persis dari brief.
- Menerapkan alur klik metric/chart/list/tabel → active filter chip → seluruh visual terkait dan tabel ikut terfilter → detail record dapat dibuka → sumber dapat ditelusuri.
- Menyediakan reset filter, pilihan filter lanjutan, drawer detail konten/aktor, tab eksplorasi, serta toggle rentang prediksi.
- Menjaga istilah tetap netral: “indikasi pola aktivitas terkoordinasi”, “diproyeksikan”, dan “berpotensi”; tidak menyatakan dugaan atau prediksi sebagai fakta pasti.

## Arah visual
- Memakai visual yang padat namun mudah dipindai: line chart, ranked horizontal bar/list, distribusi sentimen/emosi, network aktor interaktif, dan matriks risiko.
- Menggunakan token warna dan komponen yang sudah ada; status risiko dan seri chart dibedakan secara terkendali tanpa neon, glow, estetika hacker, atau terlalu banyak peta.
- Menjaga tabel tetap dapat digunakan pada layar kecil melalui tata letak responsif dan area gulir yang jelas.

## Detail teknis
- Memecah area Situasi menjadi route induk dengan tiga route anak agar URL, sub-navigation, dan metadata setiap halaman tetap konsisten.
- Menempatkan data dummy dan logika filter bersama di modul khusus Situasi agar semua visual dan tabel menggunakan sumber data yang sama.
- Memanfaatkan komponen UI dan Recharts yang sudah tersedia; tidak menambah backend, API, crawling, model AI, atau prediksi nyata.
- Mempertahankan seluruh integrasi lama dan data produksi tanpa perubahan.

## Verifikasi
- Memperbarui pengujian route untuk ketiga halaman Situasi dan menambahkan pengujian kecil atas perilaku filter yang menjadi inti brief.
- Memeriksa alur utama dari Ringkasan → pilih isu/tanggal/sentimen → tabel terfilter → buka detail, lalu memeriksa tab Eksplorasi dan toggle Prediksi.
- Memastikan metadata unik tersedia pada setiap halaman serta tampilan desktop dan mobile bebas tumpang tindih atau teks terpotong.

## Batasan POC
- Data seluruhnya lokal dan statis.
- Tidak mencakup autentikasi, API backend, crawling nyata, model AI/prediksi nyata, live alert, ekspor, complex drilldown, atau production error handling.
