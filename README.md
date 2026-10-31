# Praktikum Effect, Custom Hook, dan Router

Aplikasi katalog produk dan daftar favorit memakai React, React Router 7, dan Vite.
Aplikasi berjalan di sisi klien saja (tanpa backend dan tanpa API).

## Cara menjalankan

Buka terminal di folder `praktikum-Modul-07` (yang ada `package.json`), lalu:

```bash
npm ci
npm run dev
```

Buka alamat yang muncul di terminal (biasanya http://localhost:5173).
`node_modules` tidak ikut dikumpulkan, jadi `npm ci` perlu dijalankan dulu (butuh internet).
Kalau PowerShell memblokir `npm.ps1`, pakai Command Prompt atau `npm.cmd`.

Pemeriksaan sebelum dikumpulkan:

```bash
npm run lint
npm run build
npm run preview
```

## Versi lingkungan

- Node.js 22.12 atau lebih baru (file `.nvmrc` berisi 22)
- Versi dependency yang terkunci di `package-lock.json`:
  React 19.3.1, React DOM 19.3.1, React Router 7.18.4, Vite 7.3.7,
  @vitejs/plugin-react 5.2.0, ESLint 9.39.5
- Versi Node dan npm di komputer saya: (isi hasil `node --version` dan `npm --version`)

## Halaman (route)

| URL | Halaman |
|---|---|
| `/` | Beranda |
| `/products` | Katalog (bisa `?q=Buku`, `?category=Aksesori`, atau keduanya) |
| `/products/1` | Detail produk (ID 1 sampai 4) |
| `/favorites` | Daftar favorit + tombol Hapus semua favorit |
| `/about` | Tentang aplikasi |
| URL lain | Halaman tidak ditemukan |

## Struktur file

- `src/main.jsx`: titik masuk, memasang StrictMode, BrowserRouter, dan FavoritesProvider.
- `src/App.jsx`: data produk, navigasi, route, semua halaman, dan hook `usePageTitle`.
- `src/hooks/usePersistentFavorites.js`: state favorit + Effect penyimpanan ke localStorage.
- `src/hooks/useFavorites.js`: membaca state favorit dari Context.
- `src/context/FavoritesContext.js` dan `FavoritesProvider.jsx`: Context dan Provider (pemilik state).
- `src/style.css`: tampilan.

Di modul, hook dan provider ada dalam satu file `favorites.jsx`. Saya pisahkan ke folder
`hooks` dan `context` supaya aturan Fast Refresh di ESLint tidak memberi peringatan.
Cara kerjanya sama.

## Tugas mandiri yang sudah dikerjakan

1. Kategori produk dan filter `?category=` (parameter `q` dan `category` saling dipertahankan).
2. Tombol **Hapus semua favorit** di halaman favorit.
3. Halaman **Tentang** dengan judul tab lewat `usePageTitle`.
4. Penjelasan hook tidak berbagi state otomatis ada di laporan; Provider sebagai pemilik state
   ada di `src/context/FavoritesProvider.jsx`.
5. Pengujian 14 kasus ada di laporan.

Tampilan dibuat sendiri (Lapak Praktikum, gaya neo-brutalist dengan sidebar, kartu produk, responsif) hanya dengan CSS,
tanpa library tambahan.

## Catatan

- Favorit disimpan di localStorage dengan key `praktikum-favorites-v1`. Mengganti host atau port
  berarti origin berbeda, jadi datanya juga berbeda. Untuk mengulang dari nol, hapus key itu
  lewat Developer Tools lalu reload.
- Sinkronisasi favorit antartab tidak dibuat (itu pengayaan opsional).
- `BrowserRouter` butuh server yang mengarahkan semua route ke `index.html` kalau di-deploy.
  Di Vite dev dan preview ini sudah ditangani otomatis.
