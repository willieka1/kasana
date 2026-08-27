# KASANA - Exchange & Beasiswa

Website direktori program exchange, student mobility, dan beasiswa. Project ini sudah disiapkan agar bisa dibuka di VS Code lokal Windows.

## Cara menjalankan di Windows

1. Extract ZIP ke folder biasa, disarankan di luar OneDrive.

   Contoh:

   ```txt
   C:\Projects\KASANA-Windows
   ```

2. Buka PowerShell di folder project yang berisi `package.json`.

3. Install dependency.

   ```powershell
   npm install
   ```

4. Jalankan website.

   ```powershell
   npm run dev -- --port 3000
   ```

5. Buka browser.

   ```txt
   http://localhost:3000
   ```

## Struktur file penting

```txt
app/
  page.tsx          Halaman utama website
  design.css        Styling utama
  program-data.ts   Data exchange dan beasiswa

public/
  kasana-logo.png
  course-template/  Ilustrasi bawaan desain
  partner-logos/    Logo penyelenggara
```

## Cara mengganti logo penyelenggara

Masukkan gambar secara manual ke:

```txt
public\partner-logos
```

Lalu panggil dari `app/page.tsx` pada bagian `PARTNER_LOGOS`.

Contoh:

```tsx
const PARTNER_LOGOS = [
  { src: "/partner-logos/lpdp.png", alt: "LPDP", width: 678, height: 452 },
];
```

Catatan penting:

- Gunakan path yang diawali `/partner-logos/...`
- Jangan gunakan path lokal seperti `C:/Users/asus/...`
- Samakan nama file di folder `public/partner-logos` dengan nama file di `src`
- Untuk logo/gambar statis, project ini memakai `<img>` biasa agar aman di VS Code lokal dan tidak memicu error image optimizer/fetch

## Cara edit data program

Edit file:

```txt
app\program-data.ts
```

Data exchange ada di:

```ts
exchangePrograms
```

Data beasiswa ada di:

```ts
scholarshipPrograms
```

## Kalau muncul error install

Jika `npm install` error karena OneDrive/permission, pindahkan folder project ke luar OneDrive, misalnya:

```txt
C:\Projects\KASANA-Windows
```

Jika muncul error `ENOTFOUND registry.npmjs.org`, berarti koneksi internet/DNS belum bisa mengakses npm registry. Coba gunakan hotspot atau jaringan lain, lalu jalankan ulang:

```powershell
npm install
```

Jika `npm install` belum sukses, jangan jalankan `npm run dev` dulu karena `vite` belum tersedia.
