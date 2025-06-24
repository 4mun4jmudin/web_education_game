class SpeakTheWordMode {
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
        const correctAnswer = this.challengeData.en;

        const instruction = dynamicInstruction || "Press the microphone and say the word:";
        this.ui.drawInstruction(instruction);

        const challengeHtml = `
            <div class="speak-word-container">
                <div class="word-to-speak">${correctAnswer}</div>
                <button id="mic-btn" class="btn-icon btn-mic">🎤</button>
                <p id="recognition-status" class="recognition-status"></p>
            </div>
        `;
        this.ui.drawChallenge(challengeHtml);
        this.ui.drawUserInput('');

        document.getElementById('mic-btn').addEventListener('click', () => this.startRecognition(correctAnswer));
    }

    startRecognition(correctAnswer) {
        const micBtn = document.getElementById('mic-btn');
        const statusText = document.getElementById('recognition-status');

        micBtn.disabled = true;
        micBtn.classList.add('active');
        statusText.textContent = "Mendengarkan...";

        this.speech.recognize(
            (transcript) => {
                statusText.textContent = `Kamu mengucapkan: "${transcript}"`;
                const isCorrect = transcript.trim().toLowerCase() === correctAnswer.toLowerCase();
                this.onSubmit(isCorrect);
            },
            () => {
                micBtn.disabled = false;
                micBtn.classList.remove('active');
            },
            (error) => {
                statusText.textContent = `Tidak terdengar, coba lagi.`;
                 setTimeout(() => {
                    micBtn.disabled = false;
                    micBtn.classList.remove('active');
                    statusText.textContent = "";
                }, 2000);
            }
        );
    }
}