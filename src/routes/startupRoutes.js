const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Impor semua fungsi dari controller
const {
    createStartup,
    getMyStartup,
    promoteStartup,
    researchProduct,
    nextDay,
    hireTeamMember,
    upgradeProduct,
    runAdCampaign,
    redesignProduct,
    researchTech,
    getTechTree
} = require('../controllers/startupController');

// --- Rute Dasar ---
router.post('/', authMiddleware, createStartup);
router.get('/me', authMiddleware, getMyStartup);

// --- Rute Aksi Pemain ---
router.post('/promote', authMiddleware, promoteStartup);
router.post('/research', authMiddleware, researchProduct);
router.post('/nextday', authMiddleware, nextDay);
router.post('/hire', authMiddleware, hireTeamMember);
router.put('/product/:productId/upgrade', authMiddleware, upgradeProduct);

// --- Rute Aksi Baru (Gameplay Dalam) ---
router.post('/campaign', authMiddleware, runAdCampaign);
router.post('/redesign', authMiddleware, redesignProduct);
router.post('/research-tech', authMiddleware, researchTech);


// --- ROUTE PUBLIK UNTUK TECH TREE ---
router.get('/tech-tree', getTechTree);


module.exports = router;
