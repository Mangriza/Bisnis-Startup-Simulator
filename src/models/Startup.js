// src/models/Startup.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Kita buat skema kecil untuk produk di dalam startup
const productSubSchema = new Schema({
  productName: { type: String, required: true },
  level: { type: Number, default: 1 }, // <-- TAMBAHKAN LEVEL
  revenuePerDay: { type: Number, default: 0 }
});

const startupSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startupName: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Aplikasi Mobile', 'Toko Online', 'Game Studio'],
  },
  cash: {
    type: Number,
    default: 10000,
  },
  popularity: {
    type: Number,
    default: 10,
  },
  team: {
    developer: { type: Number, default: 1 },
    marketer: { type: Number, default: 0 },
    designer: { type: Number, default: 0 },
  },
  // --- PERUBAHAN DI SINI ---
  researchProgress: { // Untuk melacak progres riset saat ini
    type: Number,
    default: 0
  },
  products: [productSubSchema], // Menggunakan skema kecil yang kita buat di atas
  // --------------------------
  day: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  activeCampaign: {
    daysLeft: { type: Number, default: 0 },
    revenueBonus: { type: Number, default: 0 }
},
 unlockedTechs: [{
        type: String // Kita akan simpan key-nya, misal: "basic_rendering"
    }],

day: { type: Number, default: 1 },
});

module.exports = mongoose.model('Startup', startupSchema);