// js/main.js

// Event listener ini memastikan semua elemen HTML sudah dimuat
// sebelum kita mencoba menjalankan kode JavaScript
window.addEventListener('DOMContentLoaded', () => {

    // Inisialisasi semua komponen utama game
    const ui = new UIManager();
    const engine = new GameEngine(ui);

    /**
     * Inisialisasi Game
     * - Menyiapkan semua event listener untuk tombol-tombol utama.
     * - Menampilkan layar awal setelah loading.
     */
    function init() {
        // --- EVENT LISTENERS UNTUK TOMBOL ---

        // Tombol "Mulai Petualangan" di layar awal
        const startGameBtn = document.getElementById('start-game-btn');
        startGameBtn.addEventListener('click', () => {
            engine.startLevel(1); // Mulai dari level 1
        });

        // Tombol "Lanjut ke Level Berikutnya" di layar level selesai
        const nextLevelBtn = document.getElementById('next-level-btn');
        nextLevelBtn.addEventListener('click', () => {
            engine.goToNextLevel();
        });
        
        // Tombol Pengaturan
        const settingsBtn = document.getElementById('settings-btn');
        settingsBtn.addEventListener('click', () => {
            ui.showScreen('settings');
        });
        
        const closeSettingsBtn = document.getElementById('close-settings-btn');
        closeSettingsBtn.addEventListener('click', () => {
            ui.showScreen('start'); // Kembali ke layar awal dari pengaturan
        });
        
        // Tombol Keluar dari game
        const quitGameBtn = document.getElementById('quit-game-btn');
        quitGameBtn.addEventListener('click', () => {
            // Konfirmasi sebelum keluar
            if (confirm("Apakah kamu yakin ingin keluar dari level ini?")) {
                ui.showScreen('start');
                // Di sini bisa ditambahkan logika untuk mereset skor jika diperlukan
            }
        });

        // --- SIMULASI LOADING ---
        // Tampilkan layar awal setelah 1.5 detik
        setTimeout(() => {
            ui.showScreen('start');
        }, 1500);
    }

    // Panggil fungsi inisialisasi untuk memulai semuanya
    init();

});
