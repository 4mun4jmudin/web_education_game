class VocabularyMatchMode {
  constructor(ui, speech) {
    this.ui = ui;
    this.speech = speech;
    this.engine = null;
    this.onSubmit = null;
    this.challengeData = null;
  }

  start(
    challengeData,
    onSubmitCallback,
    dynamicInstruction,
    categoryWordList,
    difficulty
  ) {
    this.challengeData = challengeData;
    this.onSubmit = onSubmitCallback;
    const correctAnswer = this.challengeData.en;
    const imageId = this.challengeData.id;
    const categoryName = this.engine.levelData.category;

    let wrongOptionCount = 3;
    if (difficulty === "medium") {
      wrongOptionCount = 2;
    } else if (difficulty === "hard") {
      wrongOptionCount = 1;
    }

    const wrongOptions = categoryWordList
      .filter((w) => w.en !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, wrongOptionCount)
      .map((w) => w.en);

    const options = [...wrongOptions, correctAnswer].sort(
      () => 0.5 - Math.random()
    );

    const instruction = dynamicInstruction || `Pilih gambar yang sesuai.`;
    this.ui.drawInstruction(instruction);

    // --- PERBAIKAN UTAMA DIMULAI DI SINI ---
    // Definisikan path gambar dasar tanpa ekstensi
    const imageBasePath = `assets/images/${categoryName}/${imageId}`;

    const challengeHtml = `
      <div class="image-challenge-container">
        <img 
          src="${imageBasePath}.png" 
          alt="${correctAnswer}" 
          class="challenge-image"
          onerror="
            // Jika .png gagal, coba .jpg
            this.onerror=null; 
            this.src='${imageBasePath}.jpg';
            // Jika .jpg juga gagal, coba .jpeg
            this.onerror=function(){
              this.onerror=null;
              this.src='${imageBasePath}.jpeg';
              // Jika semua gagal, tampilkan gambar placeholder atau sembunyikan
              this.onerror=function(){
                this.onerror=null;
                this.src='assets/images/placeholder.png'; // Sediakan gambar placeholder
              };
            };
          "
        >
      </div>
      <div class="options-grid" style="grid-template-columns: repeat(${
        options.length > 2 ? 2 : options.length
      }, 1fr);">
        ${options
          .map((opt) => `<button class="btn btn-option">${opt}</button>`)
          .join("")}
      </div>
    `;
    // --- AKHIR PERBAIKAN ---

    this.ui.drawChallenge(challengeHtml);
    this.ui.drawUserInput("");

    this.speech.speak(correctAnswer);

    document.querySelectorAll(".btn-option").forEach((button) => {
      button.addEventListener("click", (e) =>
        this.handleOptionClick(e, correctAnswer)
      );
    });
  }

  handleOptionClick(event, correctAnswer) {
    const selectedAnswer = event.target.textContent;
    const isCorrect = selectedAnswer === correctAnswer;

    document
      .querySelectorAll(".btn-option")
      .forEach((btn) => (btn.disabled = true));

    this.onSubmit(isCorrect);
  }
}
