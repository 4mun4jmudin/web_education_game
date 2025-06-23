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

    const instruction =
      dynamicInstruction || "Dengarkan dan ketik apa yang kamu dengar.";
    this.ui.drawInstruction(instruction);
    this.ui.drawChallenge(""); // Area tantangan utama dikosongkan

    const userInputHtml = `
            <div class="listen-type-container">
                <button id="play-sound-btn" class="btn-icon">🔊</button>
                <input type="text" id="text-input" class="text-input" placeholder="Ketik jawabanmu...">
                <button id="submit-answer-btn" class="btn-primary">Periksa</button>
            </div>
        `;
    this.ui.drawUserInput(userInputHtml);

    document.getElementById("play-sound-btn").addEventListener("click", () => {
      this.speech.speak(this.challengeData.en);
    });

    const submitBtn = document.getElementById("submit-answer-btn");
    const textInput = document.getElementById("text-input");

    submitBtn.addEventListener("click", () => this.checkAnswer(correctAnswer));
    textInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.checkAnswer(correctAnswer);
      }
    });

    this.speech.speak(this.challengeData.en);
    textInput.focus();
  }

  checkAnswer(correctAnswer) {
    const textInput = document.getElementById("text-input");
    const userAnswer = textInput.value.trim().toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    textInput.disabled = true;
    document.getElementById("submit-answer-btn").disabled = true;

    this.onSubmit(isCorrect);
  }
}
