// src/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Fungsi untuk Registrasi User Baru (TIDAK BERUBAH) ---
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tolong isi semua field.' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: 'Registrasi berhasil!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.login = async (req, res) => {
  try {
    // ================== MULAI AREA DEBUG ==================
    console.log('\n--- LOGIN ATTEMPT ---');
    console.log('Waktu:', new Date().toLocaleTimeString());
    console.log('Request Body Diterima:', req.body);
    // ======================================================

    const { email, password } = req.body;

    // Cek apakah user ada
    const user = await User.findOne({ email });

    // ================== LANJUTAN DEBUG ==================
    if (!user) {
      console.log('HASIL: User dengan email ini TIDAK DITEMUKAN di database.');
      console.log('-----------------------\n');
      return res.status(400).json({ message: 'Email atau password salah.' });
    }
    console.log('HASIL: User DITEMUKAN di database.');
    console.log('Password dari Input Pengguna:', password);
    console.log('Password HASH dari DB:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    // ================== FINAL DEBUG ===================
    if (!isMatch) {
      console.log('HASIL: Password TIDAK COCOK setelah dibandingkan bcrypt.');
      console.log('-----------------------\n');
      return res.status(400).json({ message: 'Email atau password salah.' });
    }
    console.log('HASIL: Password COCOK! Login seharusnya berhasil.');
    console.log('-----------------------\n');
    // ================================================

    // Buat token JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error('!!! TERJADI ERROR DI BLOK CATCH !!!', err.message);
    res.status(500).send('Server Error');
  }
};