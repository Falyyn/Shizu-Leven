📦 Product Requirements Document (PRD)

Nama Proyek: AI-Powered Electronic & IoT Inventory Manager, Nama Aplikasi: “Shizu Leven”, Versi Dokumen: 1.0.0 Tanggal: 11 Juli 2026
Platform: Web Application (SPA - Single Page Application)

1. 📝 Executive Summary

Aplikasi ini adalah sistem manajemen inventaris privat berbasis web yang dirancang khusus untuk mengelola komponen elektronik, IoT, alat kerja, dan bahan mekanik. Menggunakan arsitektur hybrid, aplikasi ini menjadikan Google Sheets sebagai database utama agar data tetap mudah diakses secara manual, sementara antarmuka web (React) dan sistem backend (Laravel) memberikan pengalaman pengguna yang modern, cepat, dan dilengkapi kecerdasan buatan (Gemini AI) untuk pencarian dan asisten proyek.

2. 🎯 Objectives & Goals

Efisiensi Pencarian: Mengurangi waktu pencarian komponen fisik melalui fitur Universal Search yang memindai spesifikasi, lokasi, dan kondisi.

Akurasi Data: Memisahkan kuantitas (angka) dan satuan (teks) agar sistem dapat melakukan perhitungan analitik stok secara otomatis.

Bantuan Cerdas: Mengintegrasikan AI yang memahami stok pengguna saat ini untuk merekomendasikan komponen dalam pembuatan sebuah proyek/alat.

Keamanan: Melindungi data aset pribadi dengan sistem autentikasi yang solid.

3. 🏗️ System Architecture & Tech Stack

Sistem ini menggunakan arsitektur Headless / Decoupled:

Frontend (UI/UX): React.js (Vite)

Styling: Tailwind CSS.

Icons: Lucide React.

Charts: Recharts atau Chart.js.

State Management: Zustand atau React Context.

Backend (API Server): Laravel 11.x (PHP)

Auth: Laravel Sanctum.

Integration: Google Sheets API (menggunakan Service Account Key), Google Gemini API.

Database (Dual-Architecture):

System DB: SQLite / MySQL (Hanya menyimpan tabel users dan personal_access_tokens).

Data DB: Google Sheets (Menyimpan tabel Inventaris, Master_Kategori, Master_Lokasi).

4. 🗃️ Database Schema (Google Sheets)

Struktur ini HARUS dipatuhi oleh Backend saat membaca/menulis data:

Tab 1: Inventaris

Kolom

Tipe Data

Deskripsi

ID_Barang

String

Kode unik, ex: COMP-001 (Auto-increment format).

Nama_Spesifikasi

String

Nama alat/komponen.

Kategori

String

Validasi dari Tab Master_Kategori.

Jumlah

Integer

Hanya angka absolut.

Satuan

String

ex: pcs, set, meter, gulung.

Kondisi

String

Status baku: Normal, Drop, Rusak, Sebagian Drop, dll.

Lokasi

String

Validasi dari Tab Master_Lokasi (ex: Box, Laci).

Terakhir_Update

Date

Format YYYY-MM-DD.

Catatan

Text

Penjelasan fungsi atau detail kerusakan.

Tab 2 & 3: Master Data

Master_Kategori: ID_Kategori, Nama_Kategori.

Master_Lokasi: ID_Lokasi, Nama_Lokasi.

5. 🎨 UI/UX & Design System

Aplikasi menggunakan gaya Modern Light Mode Bento Grid (Soft Minimalism).

Latar Belakang Layar: Abu-abu sangat terang (Off-white / bg-slate-50).

Komponen Kartu (Bento Grid): Putih murni (bg-white), highly rounded corners (rounded-3xl), bayangan difusi lembut.

Navigasi: Floating Dark Sidebar di sebelah kiri (melayang, tidak menempel tepi layar, warna bg-zinc-900).

Aksen Warna Grafik/Elemen: Pastel ungu (Lavender), Hijau zamrud (Normal/Success), Merah/Rose (Rusak/Danger).

6. 🚀 Core Features (Functional Requirements)

A. Authentication & Security

Aplikasi tertutup sepenuhnya oleh Halaman Login.

Pengguna login menggunakan Email dan Password.

Backend (Laravel Sanctum) memvalidasi kredensial dan mengembalikan Bearer Token.

B. Dashboard & Analytics (Halaman /dashboard)

Top Overview Cards: Menampilkan angka Total Barang, Total Kategori, dan Total Aset Rusak.

Bar Chart (Distribusi Kategori): Menampilkan Top 5 kategori dengan stok terbanyak (Kabel, Modul, dll).

Donut Chart (Kesehatan Inventaris): Persentase barang Normal vs Rusak/Drop.

Recent Activity: Tabel kecil berisi 5 baris data yang memiliki nilai Terakhir_Update paling baru.

C. Inventory Data Table (Halaman /inventory)

Tabel raksasa tanpa border vertikal, desain bersih.

Universal Search (PENTING): Sebuah search bar yang mengimplementasikan pencarian ke SEMUA KOLOM. Jika user mengetik "Box 18650 Rusak", sistem akan mencari kecocokan pada kolom Lokasi, Nama, dan Kondisi secara bersamaan (real-time filtering di frontend).

Visual Badges: Kolom "Kondisi" harus dirender sebagai label berwarna (bukan sekadar teks biasa).

D. CRUD Operations (via Floating Modal)

Create / Update: Saat tombol "+ Tambah" atau "Edit" diklik, muncul Modal Overlay.

Form Validation: Input Jumlah harus divalidasi sebagai angka. Kategori & Lokasi dirender sebagai Dropdown yang mengambil data dari Master Data Sheets.

Delete: Konfirmasi penghapusan sebelum mengeksekusi API delete.

E. AI Inventory Assistant (RAG with Google Gemini)

Trigger: Floating button di pojok kanan bawah yang memunculkan Slide-out Drawer (Panel Chat).

Mekanisme Backend (RAG - Retrieval-Augmented Generation):

User mengetik prompt (contoh: "Komponen apa yang cocok untuk bikin alat ukur suhu ruangan?").

React mengirim prompt ke Laravel.

Laravel mengambil json dump dari inventaris Google Sheets.

Laravel mengirim System Prompt ke API Gemini: "Kamu adalah asisten teknis. Ini database komponen pengguna: 

$$JSON$$

. Jawab pertanyaan berikut berdasarkan stok yang ada, sebutkan lokasinya. Pertanyaan: 

$$Prompt User$$

".

Jawaban Gemini dikembalikan ke React dan ditampilkan di UI Chat.

7. 🔌 API Endpoints Structure (Laravel Backend)

Base URL: /api/v1

Method

Endpoint

Fungsi

Keterangan

POST

/auth/login

Login user

Auth menggunakan DB lokal.

POST

/auth/logout

Logout user

Revoke Token.

GET

/dashboard/stats

Ambil data analitik

Return total, chart data, recent.

GET

/inventory

Ambil semua data

Read tab Inventaris.

POST

/inventory

Tambah komponen

Append row ke Sheets.

PUT

/inventory/{id}

Edit komponen

Update row spesifik di Sheets.

DELETE

/inventory/{id}

Hapus komponen

Hapus baris di Sheets.

GET

/master-data

Ambil Kategori & Lokasi

Untuk keperluan Dropdown form.

POST

/ai/chat

Chatbot AI

Komunikasi dengan API Gemini.

8. 🛠️ Implementation Phases (Peta Jalan Eksekusi)

Instalasi Laravel 13.

Konfigurasi Google Cloud Console (Service Account, Google Sheets API).

Pembuatan Controller Laravel untuk CRUD dari dan ke Google Sheets.

Pengujian API menggunakan Postman.

Setup React, Vite, dan Tailwind CSS.

Implementasi struktur Bento Grid dan Floating Sidebar.

Pembuatan halaman Login dan autentikasi token.

Integrasi API tabel inventaris dan Universal Search.

Pembuatan Modal form Tambah, Edit, dan Hapus (CRUD selesai).

Implementasi Recharts/Chart.js di Dashboard.

Mendapatkan API Key Google Gemini (Google AI Studio).

Pembuatan fungsi penggabungan Prompt dan JSON Data di Laravel.

Pembuatan Chat UI (Slide-out Drawer) di React.

Testing dan optimasi prompt AI.
