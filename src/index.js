// src/index.js

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// --- Import semua file route ---
const authRoutes = require('./routes/authRoutes');
const startupRoutes = require('./routes/startupRoutes');
const cors = require('cors'); // <-- IMPORT CORS DI SINI

// --- Konfigurasi Awal ---
dotenv.config({ path: './.env' });
const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
// Middleware ini penting agar Express bisa membaca JSON dari body request
app.use(cors()); 
app.use(express.json());

// --- KONEKSI KE DATABASE MONGODB ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Berhasil terhubung ke MongoDB Atlas!');
})
.catch((err) => {
  console.error('❌ Gagal terhubung ke MongoDB:', err.message);
  process.exit(1);
});

// --- PENDAFTARAN ROUTES ---
// Route default untuk cek server
app.get('/', (req, res) => {
  res.send('<h1>Selamat Datang di Bisnis Startup Simulator API!</h1>');
});

// Daftarkan semua route aplikasi kita
app.use('/api/auth', authRoutes);
app.use('/api/startup', startupRoutes);


// --- MULAI SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port http://localhost:${PORT}`);
});