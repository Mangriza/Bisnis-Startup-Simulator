    // app.js - Versi Debug "Anti-Crash"

    const API_BASE_URL = 'http://localhost:5000/api';

    // --- STATE APLIKASI ---
    let TECH_TREE_DATA = {};

    /**
     * Merender daftar teknologi berdasarkan data dari server dan kemajuan pemain.
     * @param {string[]} unlockedTechs - Array berisi ID teknologi yang sudah dimiliki.
     */
    function renderTechTree(unlockedTechs = []) {
        const techTreeContainer = document.getElementById('tech-tree-container');
        if (!techTreeContainer) return;

        techTreeContainer.innerHTML = '';
        if (Object.keys(TECH_TREE_DATA).length === 0) {
            techTreeContainer.innerHTML = '<p>Gagal memuat data pohon teknologi.</p>';
            return;
        };

        Object.entries(TECH_TREE_DATA).forEach(([techId, tech]) => {
            let status = 'locked';
            let buttonText = `Riset ($${tech.cost.toLocaleString()})`;
            let buttonDisabled = 'disabled';

            if (unlockedTechs.includes(techId)) {
                status = 'unlocked';
                buttonText = 'Dimiliki';
            } else {
                const prereqsMet = tech.prerequisites.every(prereq => unlockedTechs.includes(prereq));
                if (prereqsMet) {
                    status = 'available';
                    buttonDisabled = '';
                }
            }
            
            const techCard = document.createElement('article');
            techCard.className = `tech-${status}`;
            techCard.innerHTML = `
                <header><strong>${tech.name}</strong></header>
                <p>${tech.description}</p>
                <footer><button class="research-tech-btn" data-id="${techId}" ${buttonDisabled}>${buttonText}</button></footer>
            `;
            techTreeContainer.appendChild(techCard);
        });
    }

    /**
     * Mengupdate semua elemen di UI Dashboard dengan data terbaru.
     * @param {object} data - Objek data yang diterima dari API.
     */
    function updateDashboardUI(data) {
        const startup = data.newState || data.startup || data;
        if (!startup) return;

        document.getElementById('startup-name').innerText = startup.startupName;
        document.getElementById('cash-value').innerText = `$${startup.cash.toLocaleString()}`;
        document.getElementById('popularity-value').innerText = startup.popularity;
        document.getElementById('day-value').innerText = startup.day;
        document.getElementById('dev-count').innerText = startup.team.developer;
        document.getElementById('marketer-count').innerText = startup.team.marketer;
        document.getElementById('designer-count').innerText = startup.team.designer;
        
        document.getElementById('research-progress-bar').value = startup.researchProgress || 0;
        document.getElementById('research-progress-text').innerText = `${startup.researchProgress || 0}%`;
        
        const productListDiv = document.getElementById('product-list');
        productListDiv.innerHTML = ''; 
        if (startup.products && startup.products.length > 0) {
            startup.products.forEach(product => {
                const productCard = document.createElement('article');
                productCard.innerHTML = `
                    <header><strong>${product.productName}</strong> (Lv. ${product.level})</header>
                    <p>$${product.revenuePerDay.toLocaleString()}/hari</p>
                    <footer>
                        <div class="grid">
                            <button class="upgrade-btn" data-id="${product._id}">Upgrade ($${Math.floor(2000 * Math.pow(1.5, product.level)).toLocaleString()})</button>
                            <button class="redesign-btn contrast" data-id="${product._id}">Redesain ($${(3000 * product.level).toLocaleString()})</button>
                        </div>
                    </footer>
                `;
                productListDiv.appendChild(productCard);
            });
        } else {
            productListDiv.innerHTML = '<article><p>Anda belum punya produk. Lakukan riset!</p></article>';
        }

        renderTechTree(startup.unlockedTechs);
        feather.replace();
    }

    /**
     * Fungsi generik untuk mengirim request aksi ke API.
     * @param {string} endpoint - URL endpoint API (misal: '/startup/research').
     * @param {string} [method='POST'] - Metode HTTP.
     * @param {object|null} [body=null] - Body request.
     */
    async function performAction(endpoint, method = 'POST', body = null) {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const options = { method, headers: { 'x-auth-token': token } };
            if (body) {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const data = await response.json();
            
            if (!response.ok) {
                alert(`Error: ${data.message}`);
                return;
            }

            updateDashboardUI(data);

            if (data.event) {
                setTimeout(() => {
                    alert(`--- EVENT HARI INI ---\n\n${data.event.title}\n\n${data.event.description}`);
                }, 200);
            }
        } catch (error) {
            console.error(`Error performing action at ${endpoint}:`, error);
            alert('Gagal terhubung ke server.');
        }
    }

    /**
     * Fungsi utama yang berjalan saat aplikasi dimuat.
     */
    async function initializeApp() {
        console.log('[initializeApp] Starting application...');
        
        const token = localStorage.getItem('authToken');
        const sections = {
            login: document.getElementById('login-section'),
            register: document.getElementById('register-section'),
            create: document.getElementById('create-startup-section'),
            dashboard: document.getElementById('dashboard-section')
        };

        // Sembunyikan semua section dulu
        Object.values(sections).forEach(s => s && s.classList.add('hidden'));

        // Coba muat data Tech Tree terlebih dahulu
        try {
            const techTreeResponse = await fetch(`${API_BASE_URL}/startup/tech-tree`);
            if (techTreeResponse.ok) {
                TECH_TREE_DATA = await techTreeResponse.json();
                console.log('[initializeApp] Tech Tree data loaded successfully.');
            } else {
                console.error('[initializeApp] WARNING: Gagal memuat Tech Tree. Status:', techTreeResponse.status);
            }
        } catch (error) {
            console.error('[initializeApp] CRITICAL: Gagal terhubung untuk memuat Tech Tree.', error);
        }
        
        // Logika menampilkan section yang benar
        if (!token) {
            console.log('[initializeApp] No token found. Showing login section.');
            if(sections.login) sections.login.classList.remove('hidden');
            return;
        }

        try {
            const startupResponse = await fetch(`${API_BASE_URL}/startup/me`, { headers: { 'x-auth-token': token } });
            
            if (startupResponse.status === 404) {
                console.log('[initializeApp] Startup not found (404). Showing create startup section.');
                if(sections.create) sections.create.classList.remove('hidden');
                return;
            }
            
            if (!startupResponse.ok) {
                console.log('[initializeApp] Invalid token or server error. Reloading page.');
                localStorage.removeItem('authToken');
                window.location.reload();
                return;
            }

            const startupData = await startupResponse.json();
            console.log('[initializeApp] Startup data found. Showing dashboard.');
            updateDashboardUI(startupData);
            if(sections.dashboard) sections.dashboard.classList.remove('hidden');

        } catch (error) {
            console.error('Error fetching startup data:', error);
            alert('Terjadi kesalahan saat memuat data startup. Kembali ke halaman login.');
            localStorage.removeItem('authToken');
            window.location.reload();
        }
    }


    // ========================================================
    // --- 2. EVENT LISTENERS (Dijalankan setelah DOM siap) ---
    // ========================================================
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM fully loaded. Initializing app and attaching listeners.');
        
        // --- Inisialisasi Aplikasi ---
        initializeApp();

        // --- Penanganan Form ---
        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const body = { email: e.target.email.value, password: e.target.password.value };
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
                });
                const data = await response.json();
                if (!response.ok) {
                    document.getElementById('login-error').innerText = data.message || 'Login gagal.';
                    return;
                }
                localStorage.setItem('authToken', data.token);
                await initializeApp();
            } catch (error) {
                document.getElementById('login-error').innerText = 'Tidak bisa terhubung ke server.';
            }
        });

        document.getElementById('register-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const body = { username: e.target.username.value, email: e.target.email.value, password: e.target.password.value };
            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
                });
                const data = await response.json();
                if (!response.ok) {
                    document.getElementById('register-error').innerText = data.message || 'Registrasi gagal.';
                    return;
                }
                alert('Registrasi berhasil! Silakan login.');
                document.getElementById('show-login-link')?.click();
            } catch (error) {
                document.getElementById('register-error').innerText = 'Tidak bisa terhubung ke server.';
            }
        });

        document.getElementById('create-startup-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const body = {
                startupName: e.target.elements['startup-name-input'].value,
                type: e.target.elements['startup-type-select'].value
            };
            await performAction('/startup', 'POST', body);
            await initializeApp();
        });

        // --- Link Bolak-balik ---
        document.getElementById('show-register-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('register-section').classList.remove('hidden');
        });
        document.getElementById('show-login-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-section').classList.add('hidden');
            document.getElementById('login-section').classList.remove('hidden');
        });

        // --- Tombol Aksi Dashboard ---
        document.getElementById('research-btn')?.addEventListener('click', () => performAction('/startup/research'));
        document.getElementById('promote-btn')?.addEventListener('click', () => performAction('/startup/promote'));
        document.getElementById('nextday-btn')?.addEventListener('click', () => performAction('/startup/nextday'));
        document.getElementById('campaign-btn')?.addEventListener('click', () => performAction('/startup/campaign'));
        document.getElementById('hire-dev-btn')?.addEventListener('click', () => performAction('/startup/hire', 'POST', { memberType: 'developer' }));
        document.getElementById('hire-marketer-btn')?.addEventListener('click', () => performAction('/startup/hire', 'POST', { memberType: 'marketer' }));
        document.getElementById('hire-designer-btn')?.addEventListener('click', () => performAction('/startup/hire', 'POST', { memberType: 'designer' }));

        // --- Tombol dinamis (di dalam list) ---
        document.getElementById('product-list')?.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            const productId = button.getAttribute('data-id');
            if (!productId) return;
            if (button.classList.contains('upgrade-btn')) {
                performAction(`/startup/product/${productId}/upgrade`, 'PUT');
            } else if (button.classList.contains('redesign-btn')) {
                performAction('/startup/redesign', 'POST', { productId });
            }
        });

        document.getElementById('tech-tree-container')?.addEventListener('click', e => {
            const button = e.target.closest('button');
            if (button && button.classList.contains('research-tech-btn')) {
                const techId = button.getAttribute('data-id');
                if (techId) {
                    performAction('/startup/research-tech', 'POST', { techId });
                }
            }
        });
    });
