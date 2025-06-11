const Startup = require('../models/Startup');
const techTree = require('../data/techTree');


exports.createStartup = async (req, res) => {
    try {
        const existingStartup = await Startup.findOne({ user: req.user.id });
        if (existingStartup) {
            return res.status(400).json({ message: 'Anda sudah memiliki startup.' });
        }
        const { startupName, type } = req.body;
        const newStartup = new Startup({ user: req.user.id, startupName, type });
        const startup = await newStartup.save();
        res.status(201).json(startup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.getMyStartup = async (req, res) => {
    try {
        const startup = await Startup.findOne({ user: req.user.id });
        if (!startup) {
            return res.status(404).json({ message: 'Startup tidak ditemukan. Silakan buat dulu.' });
        }
        res.json(startup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.promoteStartup = async (req, res) => {
    try {
        const startup = await Startup.findOne({ user: req.user.id });
        if (!startup) return res.status(404).json({ message: 'Startup tidak ditemukan.' });
        const promotionCost = 500;
        const popularityGain = 10 * (1 + startup.team.marketer);
        if (startup.cash < promotionCost) {
            return res.status(400).json({ message: 'Uang tidak cukup untuk promosi.' });
        }
        startup.cash -= promotionCost;
        startup.popularity += popularityGain;
        await startup.save();
        res.json({ newState: startup, message: `Promosi berhasil! Popularitas naik +${popularityGain}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.researchProduct = async (req, res) => {
    try {
        const startup = await Startup.findOne({ user: req.user.id });
        if (!startup) return res.status(404).json({ message: 'Startup tidak ditemukan.' });
        const researchCost = 200;
        const progressGain = 10 * startup.team.developer;
        if (startup.cash < researchCost) {
            return res.status(400).json({ message: 'Uang tidak cukup untuk riset.' });
        }
        startup.cash -= researchCost;
        startup.researchProgress += progressGain;
        let message = 'Riset berhasil, progres bertambah!';
        if (startup.researchProgress >= 100) {
            let newProductName;
            const prefixes = { 'Game Studio': ['Epic', 'Cyber', 'Pixel', 'Fantasy', 'Dungeon'], 'Aplikasi Mobile': ['Snap', 'Link', 'Sync', 'Connect', 'Verse'], 'Toko Online': ['Cepat', 'Insta', 'Maju', 'Urban', 'Raja'] };
            const suffixes = { 'Game Studio': ['Saga', 'Quest', 'Arena', 'Chronicles', 'Realms'], 'Aplikasi Mobile': ['Gram', 'Hub', 'Up', 'Net', 'App'], 'Toko Online': ['Mart', 'Shop', 'Store', 'Jaya', 'Express'] };
            const randomPrefix = prefixes[startup.type][Math.floor(Math.random() * prefixes[startup.type].length)];
            const randomSuffix = suffixes[startup.type][Math.floor(Math.random() * suffixes[startup.type].length)];
            newProductName = `${randomPrefix} ${randomSuffix}`;
            const baseRevenue = 150;
            startup.products.push({ productName: newProductName, level: 1, revenuePerDay: baseRevenue });
            startup.researchProgress %= 100;
            message = `Selamat! Anda berhasil menciptakan ${newProductName}!`;
        }
        await startup.save();
        res.json({ startup, message });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.hireTeamMember = async (req, res) => {
    try {
        const { memberType } = req.body;
        if (!memberType || !['developer', 'marketer', 'designer'].includes(memberType)) {
            return res.status(400).json({ message: 'Tipe anggota tim tidak valid.' });
        }
        let hiringCost;
        switch (memberType) {
            case 'developer': hiringCost = 3000; break;
            case 'marketer': hiringCost = 2500; break;
            case 'designer': hiringCost = 2800; break;
        }
        const startup = await Startup.findOne({ user: req.user.id });
        if (!startup) return res.status(404).json({ message: 'Startup tidak ditemukan.' });
        if (startup.cash < hiringCost) {
            return res.status(400).json({ message: `Uang tidak cukup untuk merekrut ${memberType}.` });
        }
        startup.cash -= hiringCost;
        startup.team[memberType] += 1;
        await startup.save();
        res.json({ message: `Selamat! Anda berhasil merekrut seorang ${memberType} baru!`, newState: startup });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.upgradeProduct = async (req, res) => {
    try {
        const startup = await Startup.findOne({ user: req.user.id });
        if (!startup) return res.status(404).json({ message: 'Startup tidak ditemukan.' });
        const product = startup.products.id(req.params.productId);
        if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        const upgradeCost = Math.floor(2000 * Math.pow(1.5, product.level));
        if (startup.cash < upgradeCost) {
            return res.status(400).json({ message: 'Uang tidak cukup untuk upgrade.' });
        }
        startup.cash -= upgradeCost;
        product.level += 1;
        const revenueGain = Math.floor(150 * Math.pow(1.2, product.level));
        product.revenuePerDay += revenueGain;
        await startup.save();
        res.json({ newState: startup });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.nextDay = async (req, res) => {
    try {
        const startup = await Startup.findOne({ user: req.user.id });
        if (!startup) return res.status(404).json({ message: 'Startup tidak ditemukan.' });
        let eventHappened = null;
        const EVENT_CHANCE = 0.25;
        if (Math.random() < EVENT_CHANCE) {
            const possibleEvents = [{ name: 'INVESTOR_TERTARIK' }, { name: 'PRODUK_VIRAL' }, { name: 'KRITIK_PEDAS' }, { name: 'SERVER_DOWN' }];
            const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
            switch (randomEvent.name) {
                case 'INVESTOR_TERTARIK': const cashInjection = 5000; startup.cash += cashInjection; eventHappened = { title: 'Investor Tertarik!', description: `Seorang investor melihat potensimu dan menyuntikkan dana segar sebesar $${cashInjection.toLocaleString()}!` }; break;
                case 'PRODUK_VIRAL': const popularityBoost = 50; startup.popularity += popularityBoost; eventHappened = { title: 'Produk Jadi Viral!', description: `Salah satu produkmu tiba-tiba viral, popularitas meroket +${popularityBoost} poin!` }; break;
                case 'KRITIK_PEDAS': const popularityDrop = 30; startup.popularity = Math.max(0, startup.popularity - popularityDrop); eventHappened = { title: 'Kritik Pedas!', description: `Seorang influencer memberikan review buruk, popularitas turun -${popularityDrop} poin.` }; break;
                case 'SERVER_DOWN': const fixCost = 1500; startup.cash -= fixCost; eventHappened = { title: 'Server Down!', description: `Server kamu mengalami masalah! Kamu terpaksa mengeluarkan $${fixCost.toLocaleString()} untuk biaya perbaikan.` }; break;
            }
        }
        let campaignBonus = 0;
        if (startup.activeCampaign.daysLeft > 0) {
            campaignBonus = startup.activeCampaign.revenueBonus;
            startup.activeCampaign.daysLeft -= 1;
        }
        const totalProductRevenue = startup.products.reduce((acc, product) => acc + product.revenuePerDay, 0);
        const totalRevenue = totalProductRevenue + campaignBonus;
        const totalExpenses = (startup.team.developer * 150) + (startup.team.marketer * 120) + (startup.team.designer * 130);
        const netProfit = totalRevenue - totalExpenses;
        startup.cash += netProfit;
        startup.day += 1;
        if (startup.cash < 0) {
            await startup.save();
            return res.status(400).json({ message: 'GAME OVER! Uang Anda habis.', report: { totalRevenue, totalExpenses, netProfit, campaignBonus }, final_state: startup, event: eventHappened });
        }
        await startup.save();
        res.json({ message: `Hari ke-${startup.day - 1} telah berakhir.`, report: { totalRevenue, totalExpenses, netProfit, campaignBonus }, newState: startup, event: eventHappened });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.runAdCampaign = async (req, res) => {
    try {
        const startup = await Startup.findOne({ user: req.user.id });
        if (startup.team.marketer < 1) return res.status(400).json({ message: 'Anda butuh setidaknya 1 Marketer.' });
        const campaignCost = 4000;
        if (startup.cash < campaignCost) return res.status(400).json({ message: 'Uang tidak cukup untuk kampanye iklan.' });
        startup.cash -= campaignCost;
        startup.activeCampaign.daysLeft = 5;
        startup.activeCampaign.revenueBonus = 1000 * startup.team.marketer;
        await startup.save();
        res.json({ message: `Kampanye Iklan berhasil dijalankan! Bonus pendapatan selama 5 hari.`, newState: startup });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
};

exports.redesignProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const startup = await Startup.findOne({ user: req.user.id });
        if (startup.team.designer < 1) return res.status(400).json({ message: 'Anda butuh setidaknya 1 Designer.' });
        const product = startup.products.id(productId);
        if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        const redesignCost = 3000 * product.level;
        if (startup.cash < redesignCost) return res.status(400).json({ message: 'Uang tidak cukup untuk redesign.' });
        startup.cash -= redesignCost;
        const revenueIncrease = 250 * startup.team.designer;
        product.revenuePerDay += revenueIncrease;
        await startup.save();
        res.json({ message: `${product.productName} berhasil di-redesign!`, newState: startup });
    } catch (err) { console.error(err.message); res.status(500).send('Server Error'); }
};


exports.researchTech = async (req, res) => {
    try {
        const { techId } = req.body;
        const techToUnlock = techTree[techId];
        if (!techToUnlock) {
            return res.status(404).json({ message: "Teknologi tidak ditemukan." });
        }
        const startup = await Startup.findOne({ user: req.user.id });
        if (!startup) return res.status(404).json({ message: 'Startup tidak ditemukan.' });
        if (startup.unlockedTechs.includes(techId)) {
            return res.status(400).json({ message: "Anda sudah memiliki teknologi ini." });
        }
        if (startup.cash < techToUnlock.cost) {
            return res.status(400).json({ message: "Uang tidak cukup untuk riset teknologi ini." });
        }
        for (const prereqId of techToUnlock.prerequisites) {
            if (!startup.unlockedTechs.includes(prereqId)) {
                return res.status(400).json({ message: `Prasyarat belum terpenuhi. Anda butuh: ${techTree[prereqId].name}` });
            }
        }
        startup.cash -= techToUnlock.cost;
        startup.unlockedTechs.push(techId);
        await startup.save();
        res.json({
            message: `Selamat! Anda berhasil membuka teknologi: ${techToUnlock.name}!`,
            newState: startup
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.getTechTree = (req, res) => {
    try {
        res.json(techTree);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
