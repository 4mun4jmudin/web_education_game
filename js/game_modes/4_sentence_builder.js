// File: js/game_modes/4_sentence_builder.js (FINAL & DENGAN EFEK SUARA)

class SentenceBuilderMode {
  constructor(ui, speech) {
    this.ui = ui;
    this.speech = speech;
    this.engine = null;
    this.onSubmit = null;
    this.challengeData = null;
    this.currentAnswer = [];

    // --- PERUBAHAN 1: Inisialisasi efek suara ---
    this.soundEffects = {
      correct: this.createAudio("assets/sounds/correct.mp3"),
      wrong: this.createAudio("assets/sounds/wrong.mp3"),
      pop: this.createAudio("assets/sounds/pop.mp3"), // Suara saat kata diklik
      reset: this.createAudio("assets/sounds/mic-off.mp3"), // Suara untuk reset
    };
  }

  // --- PERUBAHAN 2: Helper function untuk membuat elemen audio ---
  createAudio(src) {
    const audio = new Audio(src);
    audio.volume = 0.6;
    return audio;
  }

  start(challengeData, onSubmitCallback, dynamicInstruction) {
    this.challengeData = challengeData;
    this.onSubmit = onSubmitCallback;
    this.currentAnswer = [];
    const correctAnswer = this.challengeData.en;

    // Pecah kalimat menjadi kata-kata, lalu acak
    const words = correctAnswer.split(" ");
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());

    const instruction =
      dynamicInstruction || "Susun kata-kata ini menjadi kalimat yang benar.";
    this.ui.drawInstruction(instruction);

    const challengeHtml = `
      <div id="answer-area" class="sentence-answer-area" data-placeholder="Kalimat akan muncul di sini..."></div>
      <div id="word-bank" class="sentence-word-bank">
          ${shuffledWords
            .map((word) => {
              return `<button class="btn btn-word-bank">${word}</button>`;
            })
            .join("")}
      </div>
    `;
    this.ui.drawChallenge(challengeHtml);

    const userInputHtml = `
      <div class="sentence-builder-actions">
          <button id="reset-sentence-btn" class="btn btn-secondary">Ulangi</button>
          <button id="submit-sentence-btn" class="btn btn-primary">Periksa</button>
      </div>
    `;
    this.ui.drawUserInput(userInputHtml);

    this.addEventListeners();
    this.updateAnswerArea();
  }

  addEventListeners() {
    document.querySelectorAll(".btn-word-bank").forEach((button) => {
      button.addEventListener("click", (e) => this.moveWordToAnswer(e));
    });
    document
      .getElementById("submit-sentence-btn")
      .addEventListener("click", () => this.checkSentence());
    document
      .getElementById("reset-sentence-btn")
      .addEventListener("click", () => this.resetSentence());
  }

  moveWordToAnswer(event) {
    const button = event.target;
    this.currentAnswer.push(button.textContent);
    button.style.visibility = "hidden"; // Sembunyikan kata yang sudah dipilih
    this.updateAnswerArea();

    // --- PERUBAHAN 3: Mainkan suara saat kata dipilih ---
    this.soundEffects.pop.play();
  }

  resetSentence() {
    this.currentAnswer = [];
    document.querySelectorAll(".btn-word-bank").forEach((button) => {
      button.style.visibility = "visible";
    });
    this.updateAnswerArea();

    // --- PERUBAHAN 4: Mainkan suara saat reset ---
    this.soundEffects.reset.play();
  }

  updateAnswerArea() {
    const answerArea = document.getElementById("answer-area");
    if (this.currentAnswer.length === 0) {
      answerArea.textContent = answerArea.dataset.placeholder;
      answerArea.classList.add("placeholder");
    } else {
      answerArea.textContent = this.currentAnswer.join(" ");
      answerArea.classList.remove("placeholder");
    }
  }

  checkSentence() {
    const userAnswer = this.currentAnswer.join(" ");
    const correctAnswer = this.challengeData.en;
    const isCorrect = userAnswer === correctAnswer;

    // Nonaktifkan semua tombol interaksi
    document
      .querySelectorAll("#game-content button, #user-input-area button")
      .forEach((btn) => (btn.disabled = true));

    // Beri umpan balik visual pada area jawaban
    const answerArea = document.getElementById("answer-area");
    answerArea.classList.add(isCorrect ? "correct" : "incorrect");

    // --- PERUBAHAN 5: Mainkan suara berdasarkan jawaban ---
    if (isCorrect) {
      this.soundEffects.correct.play();
    } else {
      this.soundEffects.wrong.play();
      // Jika salah, tampilkan jawaban yang benar
      this.ui.drawInstruction(
        `Jawaban yang benar: <strong>${correctAnswer}</strong>`
      );
    }

    // Kirim hasil ke game engine
    this.onSubmit(isCorrect, userAnswer);
  }
}
