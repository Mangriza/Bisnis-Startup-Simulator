
const techTree = {
    // --- TIER 1: DASAR ---
    basic_rendering: {
        name: "Basic 3D Rendering",
        description: "Membuka kemampuan dasar untuk membuat grafis 3D sederhana.",
        cost: 5000,
        prerequisites: [] 
    },
    basic_marketing: {
        name: "Digital Marketing 101",
        description: "Meningkatkan efektivitas promosi dan kampanye iklan dasar.",
        cost: 4000,
        prerequisites: []
    },
    ui_ux_fundamentals: {
        name: "UI/UX Fundamentals",
        description: "Meningkatkan kualitas desain produk, sedikit meningkatkan pendapatan.",
        cost: 4500,
        prerequisites: []
    },

  
    advanced_graphics: {
        name: "Advanced Graphics Engine",
        description: "Memungkinkan pembuatan produk dengan kualitas visual tinggi, meningkatkan revenue secara signifikan.",
        cost: 15000,
        prerequisites: ['basic_rendering']
    },
    seo_optimization: {
        name: "SEO Optimization",
        description: "Meningkatkan popularitas pasif setiap hari.",
        cost: 12000,
        prerequisites: ['basic_marketing']
    },

    // --- TIER 3: LANJUTAN ---
    multiplayer_engine: {
        name: "Multiplayer Engine",
        description: "Membuka kemampuan membuat produk multiplayer, memberikan lonjakan revenue besar.",
        cost: 30000,
        prerequisites: ['advanced_graphics']
    }
};

module.exports = techTree;
