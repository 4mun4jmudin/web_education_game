// File: js/game_modes/1_vocabulary_match.js (Final)

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

    // Sesuaikan jumlah pilihan salah berdasarkan tingkat kesulitan
    let wrongOptionCount = 3; // Mudah
    if (difficulty === "medium") {
      wrongOptionCount = 2; // 3 pilihan total
    } else if (difficulty === "hard") {
      wrongOptionCount = 1; // 2 pilihan total (50/50)
    }

    const wrongOptions = categoryWordList
      .filter((w) => w.en !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, wrongOptionCount)
      .map((w) => w.en);

    const options = [...wrongOptions, correctAnswer].sort(
      () => 0.5 - Math.random()
    );

    const instruction =
      dynamicInstruction || `Choose the correct word for the image.`;
    this.ui.drawInstruction(instruction);

    const challengeHtml = `
            <div class="image-challenge-container">
                <img src="assets/images/words/${imageId}.png" alt="${correctAnswer}" class="challenge-image">
            </div>
            <div class="options-grid" style="grid-template-columns: repeat(${
              options.length > 2 ? 2 : options.length
            }, 1fr);">
                ${options
                  .map((opt) => `<button class="btn-option">${opt}</button>`)
                  .join("")}
            </div>
        `;
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
