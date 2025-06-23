// File: js/game_modes/1_vocabulary_match.js

class VocabularyMatchMode {
  constructor(ui, speech, gameData) {
    this.ui = ui;
    this.speech = speech;
    this.gameData = gameData;
    this.engine = null; // Di-set oleh GameEngine saat registrasi
    this.onSubmit = null;
    this.challengeData = null;
  }

  start(challengeData, onSubmitCallback, dynamicInstruction) {
    // Menerima instruksi dinamis
    this.challengeData = challengeData;
    this.onSubmit = onSubmitCallback;
    const correctAnswer = this.challengeData.en;
    const imageId = this.challengeData.id;

    // Ambil 3 pilihan salah dari kategori yang sama
    const categoryWords =
      this.gameData.categories[this.engine.levelData.category].words;
    const wrongOptions = categoryWords
      .filter((w) => w.en !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((w) => w.en);

    const options = [...wrongOptions, correctAnswer].sort(
      () => 0.5 - Math.random()
    );

    // Gunakan instruksi dari AI, atau gunakan default jika AI gagal/kosong
    const instruction =
      dynamicInstruction || `Choose the correct word for the image.`;
    this.ui.drawInstruction(instruction);

    const challengeHtml = `
            <div class="image-challenge-container">
                <img src="assets/images/words/${imageId}.png" alt="${correctAnswer}" class="challenge-image">
            </div>
            <div class="options-grid">
                ${options
                  .map((opt) => `<button class="btn-option">${opt}</button>`)
                  .join("")}
            </div>
        `;
    this.ui.drawChallenge(challengeHtml);
    this.ui.drawUserInput(""); // Pastikan area input bawah kosong

    // Mainkan suara kata sebagai petunjuk
    this.speech.speak(correctAnswer);

    // Tambahkan event listener ke setiap tombol pilihan
    document.querySelectorAll(".btn-option").forEach((button) => {
      button.addEventListener("click", (e) =>
        this.handleOptionClick(e, correctAnswer)
      );
    });
  }

  handleOptionClick(event, correctAnswer) {
    const selectedAnswer = event.target.textContent;
    const isCorrect = selectedAnswer === correctAnswer;

    // Nonaktifkan semua tombol untuk mencegah klik ganda
    document
      .querySelectorAll(".btn-option")
      .forEach((btn) => (btn.disabled = true));

    // Kirim hasil ke GameEngine
    this.onSubmit(isCorrect);
  }
}
