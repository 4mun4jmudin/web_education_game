// js/game_modes/1_vocabulary_match.js

class VocabularyMatchMode {
    constructor(ui, gameData, engine) {
        this.ui = ui;
        this.gameData = gameData;
        this.engine = engine; // Referensi ke engine untuk mendapatkan level/kategori saat ini
    }

    start(challengeData, onSubmitCallback) {
        // Ambil kategori dari data level saat ini di engine
        const category = this.engine.levelData.category;
        // Ambil semua kata dari kategori tersebut, kecuali kata yang menjadi jawaban
        const wordPool = this.gameData.categories[category].words.filter(w => w.en !== challengeData.en);
        // Acak dan ambil 3 kata sebagai pilihan yang salah
        const shuffledPool = [...wordPool].sort(() => 0.5 - Math.random());
        const wrongOptions = shuffledPool.slice(0, 3).map(w => w.en);

        // Gabungkan jawaban benar dan salah, lalu acak posisinya
        const options = [...wrongOptions, challengeData.en].sort(() => 0.5 - Math.random());
        
        // Tampilkan angka sebagai teks besar, atau gambar untuk kategori lain
        const imageOrText = challengeData.display 
            ? `<div class="display-text">${challengeData.display}</div>`
            : `<img src="assets/images/placeholder.png" data-src="${challengeData.img}" alt="${challengeData.en}" class="challenge-image" onload="this.src=this.dataset.src" onerror="this.src='assets/images/placeholder.png'">`;

        // Buat HTML untuk tantangan
        const html = `
            <div id="instruction-text" class="instruction">Pilih kata yang benar:</div>
            <div id="game-content">
                <div class="image-container">
                    ${imageOrText}
                </div>
                <div class="options-grid">
                    ${options.map(opt => `<button class="btn-option">${opt}</button>`).join('')}
                </div>
            </div>
        `;
        this.ui.drawChallenge(html);

        // Tambahkan event listener untuk setiap tombol pilihan
        const optionButtons = document.querySelectorAll('.btn-option');
        optionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const selectedAnswer = e.target.textContent;
                const isCorrect = selectedAnswer === challengeData.en;

                // Beri feedback visual pada semua tombol
                optionButtons.forEach(btn => {
                    btn.disabled = true; // Nonaktifkan semua tombol
                    if (btn.textContent === challengeData.en) {
                        btn.classList.add('correct');
                    } else if (btn.textContent === selectedAnswer) {
                        btn.classList.add('incorrect');
                    }
                });

                // Kirim hasil ke game engine
                onSubmitCallback(isCorrect);
            });
        });
    }
}
