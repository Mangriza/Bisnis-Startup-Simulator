// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Ambil token dari header request
  const token = req.header('x-auth-token');

  // 2. Cek jika tidak ada token
  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Tidak ada token.' });
  }

  // 3. Verifikasi token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Jika token valid, 'decoded' akan berisi payload (yang kita isi dengan user.id)
    // Kita sisipkan informasi user ke dalam object request agar bisa dipakai di route selanjutnya
    req.user = decoded.user;
    next(); // Lanjutkan ke fungsi/controller berikutnya
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid.' });
  }
};