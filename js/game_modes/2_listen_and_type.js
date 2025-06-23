// js/game_modes/2_listen_and_type.js

class ListenAndTypeMode {
    constructor(ui, speechHandler) {
        this.ui = ui;
        this.speech = speechHandler;
    }

    start(challengeData, onSubmitCallback) {
        const html = `
            <div id="instruction-text" class="instruction">Dengarkan, lalu ketik apa yang kamu dengar!</div>
            <div id="game-content">
                <button id="play-sound-btn" class="btn-play-sound" aria-label="Putar suara">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
                <div id="user-input-area" class="input-area">
                    <input type="text" id="text-input" placeholder="Ketik di sini..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                    <button id="submit-answer-btn" class="btn-primary">Periksa</button>
                </div>
            </div>
        `;
        this.ui.drawChallenge(html);
        
        const playSoundBtn = document.getElementById('play-sound-btn');
        const textInput = document.getElementById('text-input');
        const submitBtn = document.getElementById('submit-answer-btn');

        const playSound = () => {
            this.speech.speak(challengeData.en);
        };
        
        setTimeout(playSound, 500); // Otomatis putar suara saat tantangan dimulai

        playSoundBtn.addEventListener('click', playSound);

        const checkAnswer = () => {
            const userAnswer = textInput.value.trim().toLowerCase();
            const correctAnswer = challengeData.en.toLowerCase();
            const isCorrect = userAnswer === correctAnswer;
            
            textInput.disabled = true;
            submitBtn.disabled = true;
            textInput.classList.add(isCorrect ? 'correct' : 'incorrect');

            if (!isCorrect) {
                const correctAnswerDiv = document.createElement('div');
                correctAnswerDiv.className = 'correct-answer-text';
                correctAnswerDiv.textContent = `Jawaban: ${challengeData.en}`;
                document.getElementById('user-input-area').appendChild(correctAnswerDiv);
            }

            onSubmitCallback(isCorrect);
        };

        submitBtn.addEventListener('click', checkAnswer);
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
        textInput.focus();
    }
}
