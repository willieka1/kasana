# Audit Vercel KASANA

## Audit awal deployment
- Project awal mencampur Next.js dengan Vite/Vinext/Cloudflare Worker.
- `tsconfig.json` ikut memeriksa scaffolding Cloudflare yang mengimpor `cloudflare:workers`.
- Script runtime sebelumnya tidak konsisten antara development/build/start.
- Konfigurasi deployment kemudian dirapikan agar jalur utama Vercel menggunakan Next.js (`next dev`, `next build`, `next start`) dan `vercel.json` hanya menetapkan framework `nextjs`.

## Update foto program — 27 Agustus 2026
- 12 foto yang diberikan pengguna dimasukkan langsung sebagai aset lokal di `public/program-images/`.
- Foto dikonversi ke WebP agar ukuran lebih ringan untuk deployment tanpa mengubah alur aplikasi.
- Ketergantungan foto program terhadap URL Pexels/eksternal dihapus, sehingga kartu tetap memiliki foto walaupun sumber eksternal tidak tersedia.
- Mapping gambar menggunakan nama program dan negara/cakupan agar lebih relevan.

### Mapping utama
- LPDP → foto LPDP.
- TaiwanICDF / Taiwan Scholarship → foto Taiwan.
- Waseda University Exchange → foto kampus Waseda.
- DAAD EPOS → foto kantor/identitas DAAD.
- DAAD Study Scholarships → foto Jerman.
- Erasmus / Eropa → foto Eropa.
- Chevening, Cambridge, Oxford, Rhodes, Commonwealth → foto mahasiswa internasional di UK.
- MEXT, JASSO, JENESYS, Sakura Science, dan program universitas Jepang → foto Jepang.
- IAESTE, IFMSA research/professional exchange, internship, Global Talent → foto perencanaan/proyek.
- Korea, China, ASEAN, Asia, Singapura, Thailand, Malaysia, Hong Kong → foto mahasiswa Asia.
- Program Amerika/Fulbright/Global UGRAD → foto lingkungan kampus.
- Exchange global lain → foto kelompok mahasiswa internasional.
- Beasiswa lain yang tidak memiliki foto khusus → foto lingkungan kampus/beasiswa.

## Audit setelah update foto
- 12/12 path gambar lokal yang direferensikan di `PROGRAM_VISUALS` tersedia di `public/program-images/`.
- Tidak ada lagi URL `images.pexels.com` atau `images.unsplash.com` pada source `app/` untuk kartu program.
- Data tervalidasi tetap 100 program: 50 exchange + 50 beasiswa.
- Seluruh 100 program berhasil mendapatkan hasil mapping ke file gambar lokal yang tersedia; tidak ada path gambar yang hilang.
- Pemeriksaan sintaks/transpilasi TypeScript/TSX lolos untuk:
  - `app/page.tsx`
  - `app/layout.tsx`
  - `app/program-data.ts`
  - `app/chatgpt-auth.ts`
  - `next.config.ts`
- Struktur deployment Vercel dan alur fitur aplikasi tidak diubah pada update foto ini.

## Catatan build
`node_modules` tidak disertakan di ZIP. Karena itu full `next build` membutuhkan `npm ci`/instalasi dependency terlebih dahulu. Pada deployment Vercel, dependency akan diinstal dari `package-lock.json` sebelum menjalankan `next build`.
