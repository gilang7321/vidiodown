# VideoDown Cyberpunk — Online Ready

VideoDown adalah web app Express + Python `yt-dlp` untuk memproses URL video yang dapat diakses publik. Project ini sudah disiapkan untuk deployment Docker (misalnya Render).

## Fitur
- URL video → informasi/thumbnail
- Pilihan kualitas
- Download melalui backend yt-dlp
- TikTok dapat bekerja jika dukungan yt-dlp/curl_cffi tersedia
- FFmpeg tersedia di container untuk penggabungan video + audio
- Frontend dan API memakai domain yang sama
- Health check: `/api/health`

## Jalankan di Windows

```powershell
python -m pip install -U yt-dlp curl_cffi
npm install
npm start
```

Buka `http://localhost:3000`.

## Deploy online dengan Render

1. Upload folder `projects/videodown` ke repository GitHub terpisah, misalnya `videodown-cyberpunk`.
2. Di Render pilih **New → Web Service** lalu hubungkan repository tersebut.
3. Pilih runtime **Docker**. Render akan memakai `Dockerfile` yang sudah tersedia.
4. Setelah deploy selesai, Render memberikan alamat `https://...onrender.com`.
5. Tes `https://...onrender.com/api/health`.
6. Ganti URL pada tombol VideoDown di `../index.html` dari `https://GANTI-DENGAN-URL-RENDER-VIDEODOWN.onrender.com` menjadi URL Render milikmu.
7. Commit dan push portfolio ke GitHub Pages.

### Catatan Render
- Web service harus menjalankan server pada `0.0.0.0`; server sudah disiapkan demikian.
- Port dibaca dari `process.env.PORT`; default lokal adalah 3000.
- Container memasang Python, yt-dlp, curl_cffi, dan FFmpeg otomatis.
- Paket gratis Render dapat tidur setelah tidak digunakan; request pertama setelah tidur dapat lebih lambat.

## Batas penggunaan
Gunakan untuk URL dan konten yang kamu miliki atau berhak mengunduhnya. Project ini tidak menghapus watermark dari video pihak lain. Dukungan platform dapat berubah mengikuti perubahan situs dan yt-dlp.
