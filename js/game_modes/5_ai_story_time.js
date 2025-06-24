class AIStoryTimeMode {
  constructor(ui, speech, ai) {
    this.ui = ui;
    this.speech = speech;
    this.ai = ai;
    this.engine = null;
    this.onSubmit = null;
  }

  async start(
    challengeData,
    onSubmitCallback,
    dynamicInstruction,
    categoryWordList,
    difficulty
  ) {
    this.onSubmit = onSubmitCallback;
    this.ui.drawChallenge(
      '<div class="spinner"></div><p>AI sedang membuat cerita...</p>'
    );
    this.ui.drawUserInput("");

    const categoryName = this.engine.levelData.category;
    const storyData = await this.ai.generateStoryChallenge(
      categoryName,
      categoryWordList
    );

    // --- MEKANISME FALLBACK (CADANGAN) ---
    if (
      !storyData ||
      !storyData.story ||
      !storyData.question ||
      !storyData.options
    ) {
      console.warn(
        "AI Story gagal, beralih ke mode cadangan (VocabularyMatch)."
      );

      this.ui.drawInstruction(
        "Oops, ada sedikit gangguan! Kita main tebak gambar saja ya!"
      );

      const fallbackMode = this.engine.gameModes["VocabularyMatch"];
      if (fallbackMode && fallbackMode !== this) {
        setTimeout(() => {
          fallbackMode.start(
            challengeData,
            this.onSubmit,
            "Tebak gambar ini ya!",
            categoryWordList,
            difficulty
          );
        }, 1500);
      } else {
        this.ui.drawChallenge("<p>Oops, mode permainan gagal dimuat.</p>");
        setTimeout(() => this.onSubmit(false, "FALLBACK_ERROR"), 2000);
      }
      return;
    }
    // --- AKHIR MEKANISME FALLBACK ---

    const challengeHtml = `
        <div class="story-container">
          <p class="story-text">${storyData.story}</p>
          <button id="read-story-btn" class="btn btn-icon">🔊</button>
        </div>
        <p class="story-question">${storyData.question}</p>
        <div class="options-grid">
          ${storyData.options
            .map((opt) => `<button class="btn btn-option">${opt}</button>`)
            .join("")}
        </div>
      `;

    this.ui.drawInstruction("Baca ceritanya, lalu jawab pertanyaannya!");
    this.ui.drawChallenge(challengeHtml);

    document.getElementById("read-story-btn").addEventListener("click", () => {
      this.speech.speak(storyData.story);
    });

    document.querySelectorAll(".btn-option").forEach((button) => {
      button.addEventListener("click", (e) =>
        this.handleOptionClick(e, storyData.correctAnswer)
      );
    });
  }

  handleOptionClick(event, correctAnswer) {
    const selectedAnswer = event.target.textContent;
    const isCorrect =
      selectedAnswer.toLowerCase() === correctAnswer.toLowerCase();

    document
      .querySelectorAll(".btn-option")
      .forEach((btn) => (btn.disabled = true));
    this.onSubmit(isCorrect, selectedAnswer);
  }
}
