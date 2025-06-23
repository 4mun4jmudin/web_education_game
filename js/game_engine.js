// js/game_engine.js

class GameEngine {
    constructor(uiManager) {
        this.ui = uiManager; // Referensi ke UI Manager untuk memperbarui tampilan
        this.currentLevel = 1;
        this.score = 0;
        this.levelData = null;
        this.challenges = [];
        this.currentChallengeIndex = 0;

        // NOTE: Nanti kita akan mendaftarkan semua mode game di sini
        this.gameModes = {}; 
    }
    
    // Fungsi untuk mendaftarkan mode permainan yang tersedia (dari folder game_modes)
    registerGameMode(name, modeObject) {
        this.gameModes[name] = modeObject;
    }

    startLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.currentChallengeIndex = 0;
        
        // Cari data untuk level saat ini dari GAME_DATA
        this.levelData = GAME_DATA.adventureLevels.find(l => l.level === this.currentLevel);

        if (!this.levelData) {
            console.error(`Level ${this.currentLevel} tidak ditemukan!`);
            alert("Selamat! Anda telah menyelesaikan semua level yang ada!");
            this.ui.showScreen('start'); // Kembali ke menu utama jika level habis
            return;
        }

        // Siapkan tantangan untuk level ini
        this.prepareChallenges();

        // Update UI awal untuk level baru
        this.ui.updateLevelIndicator(this.currentLevel);
        this.ui.updateScoreIndicator(this.score);
        this.ui.updateProgressBar(0, this.challenges.length);
        this.ui.showScreen('game');

        // Mulai tantangan pertama
        this.nextChallenge();
    }

    prepareChallenges() {
        const category = this.levelData.category;
        const wordList = [...GAME_DATA.categories[category].words]; // Salin daftar kata
        
        // Acak daftar kata dan ambil sejumlah yang dibutuhkan untuk tantangan
        const shuffledWords = wordList.sort(() => 0.5 - Math.random());
        this.challenges = shuffledWords.slice(0, this.levelData.challenges);
    }

    nextChallenge() {
        // Jika tantangan sudah habis, level selesai
        if (this.currentChallengeIndex >= this.challenges.length) {
            this.completeLevel();
            return;
        }

        const challengeData = this.challenges[this.currentChallengeIndex];
        const gameModeName = this.levelData.gameMode;
        const activeGameMode = this.gameModes[gameModeName];

        if (activeGameMode) {
             // Panggil mode game yang sesuai untuk memulai tantangan
            activeGameMode.start(challengeData, this.submitAnswer.bind(this));
        } else {
            console.error(`Mode game "${gameModeName}" tidak terdaftar!`);
        }
        
        // Update progress bar
        this.ui.updateProgressBar(this.currentChallengeIndex, this.challenges.length);
    }

    // Fungsi ini akan dipanggil oleh mini-game saat pemain menjawab
    submitAnswer(isCorrect) {
        if (isCorrect) {
            this.score += 10; // Tambah 10 poin untuk jawaban benar
            this.ui.updateScoreIndicator(this.score);
            // NOTE: Di sini bisa ditambahkan efek suara atau visual "Benar!"
        } else {
             // NOTE: Di sini bisa ditambahkan efek suara atau visual "Salah!"
        }

        this.currentChallengeIndex++;

        // Lanjut ke tantangan berikutnya setelah jeda singkat
        setTimeout(() => {
            this.nextChallenge();
        }, 1500); // Jeda 1.5 detik
    }

    completeLevel() {
        // Logika sederhana untuk menentukan jumlah bintang
        const totalChallenges = this.challenges.length;
        const correctAnswers = this.score / 10 - (this.currentLevel > 1 ? (this.currentLevel-1) * 5 : 0) ; // perlu penyesuaian skor antar level
        const accuracy = (correctAnswers / totalChallenges);
        let stars = 1;
        if (accuracy > 0.6) stars = 2;
        if (accuracy >= 0.9) stars = 3;

        // Tampilkan layar level selesai melalui UI Manager
        this.ui.showLevelCompleteResults(this.score, stars);
    }
    
    // Pindah ke level selanjutnya
    goToNextLevel() {
        this.startLevel(this.currentLevel + 1);
    }
}
