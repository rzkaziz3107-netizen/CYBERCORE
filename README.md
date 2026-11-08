# CHEAT SLOT 2026 — Dashboard Starter

Dashboard demo untuk manajemen profil pengguna dan monitoring konfigurasi. Aplikasi ini **tidak** mengakses, memodifikasi, memprediksi, atau memengaruhi RNG, peluang, saldo, maupun hasil permainan.

## Persyaratan
- Node.js 20 atau lebih baru
- VS Code

## Menjalankan di Windows
1. Ekstrak ZIP dan buka folder `CHEAT-SLOT-2026` di VS Code.
2. Buka Terminal > New Terminal.
3. Jalankan:
   ```bash
   npm install
   npm run install:all
   ```
4. Salin `server/.env.example` menjadi `server/.env`. Ubah `JWT_SECRET` dan `ADMIN_PASSWORD`.
5. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
6. Buka `http://localhost:5173` di browser.

Login admin awal sesuai `.env.example`: `admin` / `GantiPasswordAdmin123!` (ubah sebelum digunakan di internet).

## Fitur
- Login admin dan pengguna menggunakan User ID + password.
- Admin dapat membuat, mengubah, menonaktifkan, dan menghapus akun.
- Setiap User ID memiliki nama, game profile, status, dan catatan masing-masing.
- Dashboard pengguna otomatis menampilkan profil sesuai akun yang login.
- Tiga tema: Matrix, Cyberpunk, Underground.
- Password disimpan sebagai hash bcrypt; sesi memakai JWT.

## Catatan penyimpanan
Versi starter ini menyimpan data di `server/data.json` agar mudah dijalankan lokal. Untuk produksi multi-pengguna, pindahkan penyimpanan ke PostgreSQL, gunakan HTTPS, secret kuat, backup, dan pembatasan percobaan login. Jangan mengandalkan file JSON untuk deployment multi-instance.
