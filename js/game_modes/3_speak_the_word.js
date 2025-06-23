// js/game_modes/3_speak_the_word.js

class SpeakTheWordMode {
    constructor(ui, speechHandler, engine) {
        this.ui = ui;
        this.speech = speechHandler;
        this.engine = engine;
    }

    start(challengeData, onSubmitCallback) {
        const imageOrText = challengeData.display
            ? `<div class="display-text">${challengeData.display}</div>`
            : `<img src="assets/images/placeholder.png" data-src="${challengeData.img}" alt="${challengeData.en}" class="challenge-image" onload="this.src=this.dataset.src" onerror="this.src='assets/images/placeholder.png'">`;

        const html = `
            <div id="instruction-text" class="instruction">Lihat, lalu ucapkan kata berikut:</div>
            <div id="game-content">
                <div class="image-container">
                    ${imageOrText}
                </div>
                <p class="word-to-speak">${challengeData.en}</p>
                <button id="mic-button" class="btn-mic" aria-label="Mulai bicara">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <p id="speech-feedback" class="speech-feedback-text"></p>
            </div>
        `;
        this.ui.drawChallenge(html);

        const micButton = document.getElementById('mic-button');
        const feedbackText = document.getElementById('speech-feedback');

        micButton.addEventListener('click', () => {
            feedbackText.textContent = 'Mendengarkan...';
            micButton.classList.add('listening');
            micButton.disabled = true;

            this.speech.listen(
                (transcript) => { // onResult callback
                    const userAnswer = transcript.trim().toLowerCase();
                    const correctAnswer = challengeData.en.toLowerCase();
                    const isCorrect = userAnswer.includes(correctAnswer);

                    feedbackText.textContent = `Kamu bilang: "${transcript}"`;
                    micButton.classList.remove('listening');
                    
                    onSubmitCallback(isCorrect);
                },
                (error) => { // onError callback
                    console.error("Speech recognition error:", error);
                    feedbackText.textContent = 'Oops, coba lagi!';
                    if (error.error === 'not-allowed' || error.error === 'service-not-allowed') {
                        feedbackText.textContent = 'Izinkan akses mikrofon ya!';
                    }
                    micButton.classList.remove('listening');
                    micButton.disabled = false;
                }
            );
        });
    }
}
