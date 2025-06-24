// File: js/game_modes/2_listen_and_type.js (Final)

class ListenAndTypeMode {
  constructor(ui, speech) {
    this.ui = ui;
    this.speech = speech;
    this.engine = null;
    this.onSubmit = null;
    this.challengeData = null;
  }

  start(challengeData, onSubmitCallback, dynamicInstruction) {
    this.challengeData = challengeData;
    this.onSubmit = onSubmitCallback;
    const correctAnswer = this.challengeData.en.toLowerCase();

    const instruction = dynamicInstruction || "Listen and type what you hear.";
    this.ui.drawInstruction(instruction);
    this.ui.drawChallenge(""); // Area tantangan utama dikosongkan

    const userInputHtml = `
            <div class="listen-type-container">
                <button id="play-sound-btn" class="btn-icon" aria-label="Dengarkan kata">🔊</button>
                <input type="text" id="text-input" class="text-input" placeholder="Ketik jawabanmu..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                <button id="submit-answer-btn" class="btn-primary">Periksa</button>
            </div>
        `;
    this.ui.drawUserInput(userInputHtml);

    document.getElementById("play-sound-btn").addEventListener("click", () => {
      this.speech.speak(this.challengeData.en);
    });

    const submitBtn = document.getElementById("submit-answer-btn");
    const textInput = document.getElementById("text-input");

    const checkAnswerHandler = () => this.checkAnswer(correctAnswer);

    submitBtn.addEventListener("click", checkAnswerHandler);
    textInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        checkAnswerHandler();
      }
    });

    // Ucapkan kata dan fokuskan pada input
    setTimeout(() => {
      this.speech.speak(this.challengeData.en);
      textInput.focus();
    }, 300);
  }

  checkAnswer(correctAnswer) {
    const textInput = document.getElementById("text-input");
    const userAnswer = textInput.value.trim(); // Dapatkan jawaban asli pengguna
    const isCorrect = userAnswer.toLowerCase() === correctAnswer;

    // Nonaktifkan input setelah jawaban dikirim
    textInput.disabled = true;
    document.getElementById("submit-answer-btn").disabled = true;

    // Kirim hasil dan jawaban pengguna ke game engine
    this.onSubmit(isCorrect, userAnswer);
  }
}
