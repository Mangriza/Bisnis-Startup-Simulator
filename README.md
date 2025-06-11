Bisnis Startup Simulator 🚀
Sebuah game simulasi bisnis (Tycoon) berbasis web di mana Anda membangun startup digital dari nol, bersaing dengan AI, dan membuat keputusan strategis untuk menguasai pasar.

![alt text](<Gambar WhatsApp 2025-06-12 pukul 01.12.27_3fa5d70d.jpg>)


Deskripsi Proyek
"Bisnis Startup Simulator" adalah game simulasi strategis yang menantang pemain untuk menjadi seorang CEO. Anda akan memulai dengan modal terbatas dan sebuah ide, lalu mengembangkannya menjadi perusahaan raksasa. Gameplay berfokus pada manajemen sumber daya, pengembangan produk melalui pohon teknologi, rekrutmen tim, dan menghadapi dinamika pasar seperti event acak dan persaingan ketat. Proyek ini dibangun sepenuhnya menggunakan arsitektur full-stack dengan Node.js di backend dan Vanilla JavaScript di frontend.

Fitur Utama
1. Sistem Login & Register: Akun pemain yang aman dengan authentikasi berbasis token (JWT).
2. Manajemen Startup: Kelola Uang Kas, Popularitas, dan Tim (Developer, Marketer, Designer).
3. Pengembangan Produk: Lakukan riset untuk menciptakan produk baru dengan nama yang dihasilkan secara dinamis.
4. Sistem Level & Upgrade: Tingkatkan level produk untuk menaikkan pendapatan harian.
5. Pohon Teknologi (Tech Tree): Buka teknologi baru untuk mendapatkan kemampuan dan keuntungan strategis.
6. Aksi Tim Spesialis: Gunakan Marketer untuk kampanye iklan atau Designer untuk mendesain ulang produk.
7. Event Acak: Hadapi kejadian tak terduga yang bisa menguntungkan atau merugikan startup Anda.
8. AI Competitor (Konsep): Sistem pesaing "Nexus Corp" yang membuat permainan lebih menantang.
9. UI Modern: Tampilan bersih dan responsif menggunakan CSS Framework Pico.css dan ikon dari Feather Icons.

Tumpukan Teknologi (Tech Stack)
Backend
Runtime: Node.js

Framework: Express.js

Database: MongoDB

ODM (Object Data Modeling): Mongoose

Authentikasi: JSON Web Tokens (JWT) & bcrypt.js

Frontend
Struktur: HTML5 Semantik

Styling: Vanilla CSS & Pico.css Framework

Interaktivitas: Vanilla JavaScript (ES6+)

Visualisasi: Feather Icons

Instalasi & Cara Menjalankan (Lokal)
Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer Anda.

Prasyarat
Node.js (sudah termasuk npm) ter-install.

Git ter-install.

Akun MongoDB Atlas untuk database (tersedia paket gratis).

1. Clone Repositori
git clone https://github.com/NAMA_USER_ANDA/NAMA_REPO_ANDA.git
cd NAMA_REPO_ANDA

2. Setup Backend
Masuk ke folder backend (jika struktur Anda memisahkannya, jika tidak lewati langkah ini).

Install semua dependensi:

npm install

Buat file .env: Salin file .env.example (jika ada) atau buat file baru bernama .env di root folder backend.

Isi file .env dengan variabel yang dibutuhkan:

# Port untuk server backend
PORT=5000

# Connection string dari MongoDB Atlas Anda
MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/database_name"

# Kunci rahasia untuk JWT (isi dengan teks acak yang panjang)
JWT_SECRET="KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN_DAN_PANJANG"

Jalankan server backend:

npm run dev

Server backend Anda sekarang berjalan di http://localhost:5000.

3. Setup Frontend
Install ekstensi "Live Server" di VS Code.

Klik kanan pada file frontend/index.html.

Pilih "Open with Live Server".

Browser akan otomatis terbuka, dan game siap dimainkan!

Kontribusi
Kontribusi, isu, dan permintaan fitur sangat diterima! Jangan ragu untuk membuat fork dari proyek ini dan membuat pull request.

Lisensi
Proyek ini dilisensikan di bawah MIT License. Lihat file LICENSE untuk detailnya.