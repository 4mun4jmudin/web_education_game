// File: js/game_modes/2_listen_and_type.js (VERSI OPTIMISASI)

class ListenAndTypeMode {
  constructor(ui, speech) {
    this.ui = ui;
    this.speech = speech;
    this.engine = null;
    this.onSubmit = null;
    this.challengeData = null;
    this.isAnswered = false;
    this.isCorrect = false;
    this.userAnswer = "";
    this.textInput = null;
    this.submitBtn = null;

    // Inisialisasi efek suara
    this.soundEffects = {
      correct: this.createAudio("assets/sounds/correct.mp3"),
      wrong: this.createAudio("assets/sounds/wrong.mp3"),
      pop: this.createAudio("assets/sounds/pop.mp3"),
    };
  }

  createAudio(src) {
    const audio = new Audio(src);
    audio.volume = 0.6;
    return audio;
  }

  start(challengeData, onSubmitCallback, dynamicInstruction) {
    this.isAnswered = false;
    this.isCorrect = false;
    this.userAnswer = "";
    this.challengeData = challengeData;
    this.onSubmit = onSubmitCallback;
    const correctAnswer = this.challengeData.en;

    this.ui.drawInstruction(
      dynamicInstruction ||
        `Dengarkan baik-baik, lalu ketik kata yang kamu dengar!`
    );

    const challengeHtml = `
      <div class="listen-type-container">
        <button id="listen-btn" class="btn btn-icon btn-primary">🔊</button>
      </div>
    `;

    const userInputHtml = `
      <div class="listen-type-container">
        <input type="text" id="text-input" class="text-input" placeholder="Ketik di sini..." 
               autocomplete="off" autocorrect="off" spellcheck="false">
        <button id="submit-answer-btn" class="btn btn-primary">Cek</button>
      </div>
    `;

    this.ui.drawChallenge(challengeHtml);
    this.ui.drawUserInput(userInputHtml);

    this.textInput = document.getElementById("text-input");
    this.submitBtn = document.getElementById("submit-answer-btn");
    const listenBtn = document.getElementById("listen-btn");

    // Event listeners
    listenBtn.addEventListener("click", () => {
      this.soundEffects.pop.play();
      this.speech.speak(correctAnswer);
      this.textInput.focus();
    });

    this.textInput.addEventListener("blur", () => {
      if (!this.isAnswered) this.textInput.focus();
    });

    // Satu fungsi handler untuk semua interaksi
    const handleSubmit = () => {
      if (this.isAnswered) {
        this.onSubmit(this.isCorrect, this.userAnswer);
        return;
      }

      this.userAnswer = this.textInput.value.trim();

      if (!this.userAnswer) {
        this.ui.showNotification(
          "Harap isi jawaban terlebih dahulu!",
          2000,
          "wrong"
        );
        this.soundEffects.wrong.play();
        this.textInput.focus();
        return;
      }

      this.processAnswer(correctAnswer);
    };

    this.submitBtn.addEventListener("click", handleSubmit);
    this.textInput.addEventListener(
      "keyup",
      (e) => e.key === "Enter" && handleSubmit()
    );
    this.textInput.focus();
  }

  processAnswer(correctAnswer) {
    this.isCorrect =
      this.userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    this.isAnswered = true;

    // Update UI
    this.textInput.disabled = true;
    this.textInput.classList.add(this.isCorrect ? "correct" : "incorrect");
    this.submitBtn.textContent = "Lanjut";
    this.submitBtn.classList.add(
      this.isCorrect ? "btn-correct" : "btn-incorrect"
    );

    // Berikan feedback
    if (this.isCorrect) {
      this.soundEffects.correct.play();
      this.ui.showNotification(
        `<div class="feedback-content">
          <span class="feedback-icon">🎉</span>
          <span class="feedback-text">Jawaban Benar! +5 Poin</span>
        </div>`,
        2000,
        "correct"
      );
    } else {
      this.soundEffects.wrong.play();
      this.ui.triggerScreenShake();
      this.ui.showNotification(
        `<div class="feedback-content">
          <span class="feedback-icon">😕</span>
          <span class="feedback-text">Jawaban benar: <strong>${correctAnswer}</strong></span>
        </div>`,
        3000,
        "wrong"
      );
      this.ui.drawInstruction(
        `Jawaban yang benar: <strong>${correctAnswer}</strong>`
      );
    }
  }
}
