// File: js/game_modes/1_vocabulary_match.js (DIPERBAIKI & DISEREDERHANAKAN)

class VocabularyMatchMode {
  constructor(ui, speech) {
    this.ui = ui;
    this.speech = speech;
    this.engine = null;
    this.onSubmit = null;
    this.challengeData = null;

    this.soundEffects = {
      correct: new Audio("assets/sounds/correct.mp3"),
      wrong: new Audio("assets/sounds/wrong.mp3"),
      optionClick: new Audio("assets/sounds/pop.mp3"),
    };
    Object.values(this.soundEffects).forEach(s => s.volume = 0.6);
  }

  async start(
    challengeData,
    onSubmitCallback,
    dynamicInstruction,
    categoryWordList,
    difficulty
  ) {
    this.challengeData = challengeData;
    this.onSubmit = onSubmitCallback;
    const correctAnswer = this.challengeData.en;
    const categoryName = this.engine.levelData.category;

    let wrongOptionCount = 3;
    if (difficulty === "medium") wrongOptionCount = 2;
    else if (difficulty === "hard") wrongOptionCount = 1;

    const wrongOptions = categoryWordList
      .filter((w) => w.en !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, wrongOptionCount)
      .map((w) => w.en);

    const options = [...wrongOptions, correctAnswer].sort(() => 0.5 - Math.random());

    const instruction = dynamicInstruction || "Pilih jawaban yang benar.";
    this.ui.drawInstruction(instruction);

    let challengeHtml;

    // Logika untuk kategori non-gambar (angka, kata kerja)
    if (categoryName === "numbers" || categoryName === "verbs") {
      const displayContent = categoryName === 'numbers' 
        ? `<div class="number-display-box"><span class="number-display">${this.challengeData.id}</span></div>`
        : `<div class="verb-display-box"><span class="verb-display">${this.challengeData.id}</span></div>`;
      
      challengeHtml = `
        <div class="verb-challenge-container">${displayContent}</div>`;
    } 
    // PERBAIKAN UTAMA: Logika untuk kategori gambar (termasuk shapes2D & shapes3D)
    else if (this.challengeData.image) {
      // Langsung bangun path gambar dari properti 'image'
      const imageUrl = `assets/images/${categoryName}/${this.challengeData.image}`;
      
      challengeHtml = `
        <div class="image-challenge-container">
          <img
            src="${imageUrl}"
            alt="${correctAnswer}"
            class="challenge-image"
            onerror="this.src='assets/images/placeholder.png'"
          >
        </div>`;
    } else {
      // Fallback jika tidak ada data yang cocok
      this.ui.drawChallenge("<p>Error: Tipe tantangan tidak valid.</p>");
      setTimeout(() => this.onSubmit(false, "INVALID_CHALLENGE"), 1500);
      return;
    }

    // Gabungkan challenge HTML dengan pilihan jawaban
    const finalHtml = `
      ${challengeHtml}
      <div class="options-grid" style="grid-template-columns: repeat(${options.length > 2 ? 2 : options.length}, 1fr);">
        ${options.map((opt) => `<button class="btn btn-option">${opt}</button>`).join("")}
      </div>`;

    this.ui.drawChallenge(finalHtml);
    this.ui.drawUserInput("");
    this.speech.speak(correctAnswer);

    document.querySelectorAll(".btn-option").forEach((button) => {
      button.addEventListener("click", (e) => this.handleOptionClick(e, correctAnswer));
    });
  }

  handleOptionClick(event, correctAnswer) {
    this.soundEffects.optionClick.play();
    const selectedAnswer = event.target.textContent;
    const isCorrect = selectedAnswer === correctAnswer;
    const allButtons = document.querySelectorAll(".btn-option");

    allButtons.forEach((btn) => (btn.disabled = true));

    event.target.classList.add(isCorrect ? "correct-option" : "incorrect-option");
    if (!isCorrect) {
      allButtons.forEach(btn => {
        if (btn.textContent === correctAnswer) {
          btn.classList.add("correct-option");
        }
      });
    }

    if (isCorrect) {
      this.soundEffects.correct.play();
    } else {
      this.soundEffects.wrong.play();
      this.ui.triggerScreenShake();
    }

    setTimeout(() => this.onSubmit(isCorrect), isCorrect ? 1500 : 2000);
  }
}