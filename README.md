# UPJ Katering - E-Commerce Marketplace

Aplikasi marketplace modern yang terintegrasi dengan Google Sheets sebagai database.

## 🚀 Deployment ke Vercel

### Persiapan
1. Fork atau clone repository ini
2. Pastikan semua file sudah sesuai struktur yang benar
3. Buat akun Vercel jika belum ada

### Langkah Deployment
1. Connect repository ke Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`
4. Deploy!

### Environment Variables
Tidak ada environment variables yang diperlukan karena aplikasi menggunakan Google Apps Script sebagai backend.

### Struktur Project
\`\`\`
├── client/                 # Frontend React app
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── dist/              # Build output
├── shared/                # Shared types and schemas
└── vercel.json           # Vercel configuration
\`\`\`

## 🛠 Teknologi
- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **State**: TanStack Query
- **Database**: Google Sheets via Apps Script
- **Hosting**: Vercel

## 📱 Fitur
- ✅ Authentication dengan role-based access
- ✅ Product management untuk seller
- ✅ Shopping experience untuk buyer
- ✅ Order management system
- ✅ Real-time data sync dengan Google Sheets
- ✅ Responsive design
- ✅ Modern UI dengan glass morphism

## 🔗 Google Apps Script
Aplikasi ini menggunakan Google Apps Script sebagai backend API. Pastikan script sudah di-deploy dan URL-nya sudah benar di file `client/src/lib/api.ts`.
\`\`\`

Terakhir, mari kita buat file .gitignore:
