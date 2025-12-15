# QR Code Generator

Generator QR code sederhana buat convert teks atau URL jadi QR code, terus bisa langsung download sebagai PNG.

## Fitur

- Input teks atau URL
- Generate QR code langsung ke canvas
- Download hasil sebagai file PNG
- Shortcut keyboard: **Ctrl/⌘ + Enter** untuk generate
- UI responsif, bisa dipake di mobile juga

## Cara Pakai

Pastikan Node.js sudah terinstall di komputer kamu.

```bash
npm install
npm run dev
```

Nanti bakal muncul link di terminal (biasanya `http://localhost:5173`), buka aja di browser.

## Build untuk Deploy

Kalau mau deploy ke hosting atau GitHub Pages:

```bash
npm run build
npm run preview
```

File hasil build ada di folder `dist/`, bisa langsung di-upload.

## Struktur Project

- `index.html` — file HTML utama
- `src/main.js` — logic untuk generate dan download QR
- `src/style.css` — styling

## Tech Stack

- **Vite** — buat dev server dan build
- **qrcode** — library untuk generate QR code
- Vanilla JavaScript — tanpa framework, pure JS

Kalau ada yang kurang jelas atau mau ditambahin fitur, silakan buat issue atau PR aja.


