Nama Produk: Dompetku

Platform: Responsive Web App (Mobile-First)

Tech Stack Utama: Next.js (App Router), Tailwind CSS, shadcn/ui, TypeScript, PostgreSQL (Prisma/Drizzle ORM)

Target Pengguna: Mahasiswa, pekerja muda, freelancer di Indonesia.

Prinsip Utama: Log first, dashboard later. (Login → Catat Transaksi → Simpan dalam hitungan detik).

1. 🎨 Arah Visual & UI/UX
Tema Warna:

Primary: Emerald, Teal, atau Biru Kehijauan (memberi kesan aman/tenang).

Destructive: Merah (untuk pengeluaran, peringatan, hapus).

Mode: Light mode (default), siap untuk Dark mode.

Tipografi: Sans-serif modern (Inter atau Geist).

Format Lokal: Bahasa Indonesia, Mata Uang Rupiah (Rp1.500.000), Tanggal (28 Juli 2026).

Style Komponen:

Card dengan soft radius (misal: rounded-2xl atau rounded-xl).

Whitespace lega (bersih, tidak padat seperti app akuntansi korporat).

Ikonografi sederhana (Lucide Icons direkomendasikan).

Navigasi:

Mobile: Bottom Navigation (Catat, Riwayat, Laporan, Pengaturan).

Desktop: Left Sidebar yang ringkas (Maksimal lebar form di tengah: 640px - 720px).

2. 🗄️ Struktur Database (ERD Referensi)
Berikut adalah rancangan skema database relasional (dapat diimplementasikan dengan Prisma atau Drizzle):

1. User

id (UUID, PK)

name (String)

email (String, Unique)

password_hash (String)

currency (String, default: 'IDR')

timezone (String, default: 'Asia/Jakarta')

created_at (Timestamp)

2. Category

id (UUID, PK)

user_id (UUID, FK ke User, nullable untuk kategori default/sistem)

type (Enum: INCOME, EXPENSE)

group (Enum: NEEDS, WANTS, nullable untuk income)

name (String)

icon (String, nama ikon)

is_active (Boolean, default: true)

3. PaymentMethod

id (UUID, PK)

user_id (UUID, FK ke User, nullable untuk default sistem)

name (String)

type (Enum: CASH, BANK, EWALLET, OTHER)

icon (String)

is_active (Boolean, default: true)

4. Transaction

id (UUID, PK)

user_id (UUID, FK ke User)

title (String)

amount (Decimal/Int)

type (Enum: INCOME, EXPENSE)

category_id (UUID, FK ke Category)

payment_method_id (UUID, FK ke PaymentMethod)

date (DateTime)

note (Text, nullable)

created_at (Timestamp)

5. RoutineIncome

id (UUID, PK)

user_id (UUID, FK ke User)

name (String)

amount (Decimal/Int)

category_id (UUID, FK ke Category)

frequency (Enum: MONTHLY, WEEKLY)

receive_date (Int, contoh: 25 untuk setiap tanggal 25)

start_date (DateTime)

end_date (DateTime, nullable)

is_active (Boolean, default: true)

3. 📁 Rekomendasi Struktur Folder (Next.js App Router)
Struktur disesuaikan agar rapi dan scalable:

Plaintext
arusku/
├── prisma/                  # Skema database ORM (jika pakai Prisma)
│   └── schema.prisma
├── src/
│   ├── app/                 # App Router pages
│   │   ├── (auth)/          # Rute tanpa navigasi utama
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── onboarding/page.tsx
│   │   ├── (main)/          # Rute dengan Bottom Nav / Sidebar
│   │   │   ├── catat/page.tsx      # Default page
│   │   │   ├── riwayat/page.tsx
│   │   │   ├── laporan/page.tsx
│   │   │   └── pengaturan/page.tsx
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable UI components (shadcn/ui masuk sini)
│   │   ├── ui/              # Komponen dasar (Button, Input, dll)
│   │   ├── forms/           # Komponen form spesifik
│   │   └── layouts/         # Sidebar, BottomNav, Topbar
│   ├── lib/                 # Utility functions (formatRupiah, formatDate)
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Global state (Zustand/Context jika ada)
│   └── types/               # TypeScript definitions
├── tailwind.config.ts
└── components.json          # Konfigurasi shadcn
4. 📱 Screen by Screen Requirements
Screen 1 — Login
Elemen: Logo Arusku, Judul "Kelola uangmu tanpa ribet.", Input (Email, Password), Tombol "Masuk" (Primary), Tombol "Masuk dengan Google" (Outline/Secondary), Link "Lupa kata sandi?", Link "Daftar".

Rules: Halaman bersih, tanpa dashboard/grafik di background. Responsive di mobile/desktop.

Screen 2 — Register
Elemen: Input (Nama Lengkap, Email, Password, Konfirmasi Password), Checkbox Syarat & Ketentuan, Tombol "Buat Akun", Tombol "Daftar dengan Google", Link "Kembali ke Login".

Screen 3 — Onboarding (Pengguna Baru)
Langkah 1 (Pemasukan): "Berapa pemasukan rutinmu?" → Form: Nama (default "Gaji"), Nominal, Tanggal terima, Toggle "Catat otomatis". Tombol "Lewati dulu".

Langkah 2 (Metode): "Metode pembayaran sering digunakan?" → Pilihan chip ganda: Tunai, Bank, QRIS, DANA, GoPay, OVO, ShopeePay.

Langkah 3 (Edukasi): Penjelasan singkat pemisahan "Kebutuhan Pokok" vs "Keinginan". Tombol "Mulai Mencatat".

Screen 4 — Halaman Catat (Default Page)
Header: "Hari ini kamu mengeluarkan uang untuk apa?" + Tanggal hari ini.

Segmented Control: Pengeluaran (Default) | Pemasukan.

Quick Categories: Chip di atas nominal (Makan, Bensin, Nongkrong, Apel, Belanja). Otomatis mengisi Kelompok & Kategori jika di-tap.

Form Pengeluaran:

Nama Transaksi: Label "Beli atau bayar apa?", Placeholder "Contoh: makan siang, bensin".

Nominal: Font size BESAR, prefix Rp, auto-format ribuan.

Kelompok (Selectable Cards/Segmented): Kebutuhan Pokok | Keinginan. (Bukan dropdown).

Kategori (Dropdown/Bottom Sheet):

Jika Kebutuhan Pokok: Makan & Minum, Transportasi, Tagihan, Kesehatan, Pendidikan, Kebutuhan Rumah, Kerja, Cicilan Wajib.

Jika Keinginan: Nongkrong, Hiburan, Fashion, Aksesoris, Gadget, Pasangan/Apel, Game, Liburan, Kado.

Metode Pembayaran: Tunai, QRIS, Transfer Bank, e-Wallets.

Tanggal: Default hari ini.

Catatan (Opsional).

Tombol "Simpan Transaksi": Lebar penuh (full-width) di mobile, menempel di bawah (sticky) jika form panjang.

Form Pemasukan (Jika segment diubah):

Nama, Nominal, Kategori (Gaji, Freelance, dll), Tanggal, Catatan.

Toggle "Jadikan pemasukan rutin" (Jika aktif muncul: Frekuensi, Tanggal masuk, dll).

Screen 5 — Success State
Perilaku: Tidak langsung dilempar ke dashboard. Muncul Bottom Sheet / Modal sukses.

Konten: Teks "Transaksi berhasil disimpan", Ringkasan data yang baru dicatat.

Aksi: Tombol "Tambah Lagi" (Primary) atau "Lihat Hari Ini" (Secondary).

Screen 6 — Ringkasan Hari Ini
Elemen: Total Pemasukan (+), Total Pengeluaran (-), Pembagian total Kebutuhan Pokok vs Keinginan hari ini.

List: Daftar transaksi hari ini (Ikon, Nama, Kategori, Waktu, Nominal dengan warna spesifik).

Aksi: Floating Action Button (FAB) atau tombol untuk tambah transaksi.

Screen 7 — Riwayat
Elemen: Search bar, Filter (Bulan/Tahun, Jenis, Pokok/Keinginan, Kategori, Metode Pembayaran).

List: Dikelompokkan per tanggal (Grouped by date).

Aksi: Swipe action / menu 3 titik di mobile untuk Edit/Hapus. Empty state ilustrasi ringan jika kosong.

Screen 8 — Detail dan Edit Transaksi
Elemen: Menampilkan seluruh data transaksi. Tombol "Edit" dan "Hapus" (Destructive).

Perilaku: Edit menggunakan form yang sama dengan Halaman Catat, namun pre-filled. Hapus memunculkan dialog konfirmasi.

Screen 9 — Laporan Bulanan
Elemen: Filter bulan & tahun. Summary cards (Total Pemasukan, Pengeluaran, Sisa uang, Total Kebutuhan, Total Keinginan).

Visualisasi (Chart.js / Recharts):

Donut chart: Kebutuhan Pokok vs Keinginan.

Bar chart: Pengeluaran per kategori.

List: Kategori pengeluaran tertinggi, perbandingan % dengan bulan lalu, Top 5 transaksi terbesar.

Screen 10 — Pemasukan Rutin
List: Nama, Nominal, Tanggal Masuk, Status (Menunggu / Sudah diterima / Terlewat), Toggle Aktif/Nonaktif.

Aksi: Tambah, Edit, Hapus, Konfirmasi penerimaan bulan berjalan.

Screen 11 — Kelola Kategori
Tabs: Kebutuhan Pokok | Keinginan.

Aksi: Tambah kategori, Edit nama/ikon, Pindah kelompok, Nonaktifkan. (Note: Kategori default bawaan sistem tidak bisa dihapus, hanya bisa dinonaktifkan).

Screen 12 — Metode Pembayaran
List: Tunai, Rekening, E-wallet dengan status aktif.

Aksi: Tambah/Edit (Nama, Jenis, Ikon, Status). (Note: MVP belum ada kalkulasi saldo per rekening).

Screen 13 — Profil dan Pengaturan
Elemen: Avatar, Nama, Email. Pilihan Mata Uang & Zona Waktu. Toggle Tema.

Menu Navigasi Tambahan: Link ke -> Pemasukan Rutin, Kelola Kategori, Metode Pembayaran.

Akun: Ganti Password, Logout, Hapus Akun (Destructive).

5. 🧩 Design System & Komponen Spesifik (shadcn/ui guide)
Pastikan AI membuat komponen reusable ini dengan Tailwind:

Inputs: CurrencyInput (custom text input dengan auto-format titik dan prefix Rp), TextInput, Select, DatePicker.

Buttons: Primary (Warna utama), Secondary (Outline/Ghost), Destructive (Merah).

Controls: SegmentedControl (Untuk toggle Pemasukan/Pengeluaran dan Kebutuhan/Keinginan).

Cards: SelectableCard (Card yang memiliki state active/border tebal saat dipilih), TransactionCard (Layout konsisten untuk list).

Chips/Pills: CategoryChip untuk Quick categories di halaman catat.

Feedback: Toast (Notifikasi pojok), BottomSheet (Mobile), Modal/Dialog (Desktop), LoadingSkeleton (saat fetching data), EmptyState (Ilustrasi + Teks).

6. ♿ Accessibility & Responsiveness
Mobile-first rule: Layar max <768px harus memprioritaskan Bottom Navigation dan elemen yang bisa disentuh dengan nyaman (Tap area minimal 44x44px). Bottom sheet untuk dropdown/pilihan yang panjang.

Desktop/Tablet rule: Sidebar di kiri, Form tetap terpusat di tengah dengan maksimal lebar max-w-2xl agar tidak memanjang dan merusak UX.

A11y: Label input wajib ada (bisa secara visual atau aria-label), contrast ratio minimal 4.5:1 untuk teks, peringatan error field muncul di bawah input (berwarna merah), dan form harus bisa dinavigasi via tombol Tab keyboard.