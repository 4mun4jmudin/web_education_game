// File: js/ui_manager.js (Versi Final yang Sudah Diperbaiki)

class UIManager {
    constructor() {
        this.screens = {
            loading: document.getElementById('loading-screen'),
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen'),
            levelComplete: document.getElementById('level-complete-screen'),
            settings: document.getElementById('settings-screen'),
        };

        this.levelIndicator = document.getElementById('level-indicator');
        this.scoreIndicator = document.getElementById('score-indicator');
        this.progressBar = document.getElementById('progress-bar');
        
        this.instructionText = document.getElementById('instruction-text');
        this.gameContent = document.getElementById('game-content');
        this.userInputArea = document.getElementById('user-input-area');

        // ==========================================================
        // ▼▼▼ BARIS INI DIPERBAIKI ▼▼▼
        // Sebelumnya: this.activeScreen = null;
        // Sekarang kita langsung set ke layar loading yang memang aktif saat pertama kali.
        this.activeScreen = this.screens.loading;
        // ==========================================================
    }

    showScreen(screenId) {
        if (this.activeScreen) {
            this.activeScreen.classList.remove('active');
        }
        const newScreen = this.screens[screenId];
        if (newScreen) {
            newScreen.classList.add('active');
            this.activeScreen = newScreen;
        } else {
            console.error(`Layar dengan ID "${screenId}" tidak ditemukan.`);
        }
    }

    updateLevelIndicator(text) { this.levelIndicator.textContent = text; }
    updateScoreIndicator(score) { this.scoreIndicator.textContent = `Skor: ${score}`; }
    updateProgressBar(current, max) { this.progressBar.style.width = `${(current / max) * 100}%`; }
    drawInstruction(text) { this.instructionText.innerHTML = text; }
    drawChallenge(htmlContent) { this.gameContent.innerHTML = htmlContent; }
    drawUserInput(htmlContent) { this.userInputArea.innerHTML = htmlContent; }

    showLevelCompleteScreen(score, onNextLevelCallback) {
        document.getElementById('level-score').textContent = score;
        this.showScreen('levelComplete');

        const nextLevelBtn = document.getElementById('next-level-btn');
        const newBtn = nextLevelBtn.cloneNode(true);
        nextLevelBtn.parentNode.replaceChild(newBtn, nextLevelBtn);
        newBtn.addEventListener('click', onNextLevelCallback, { once: true });
    }

    showFeedback(isCorrect) {
        const gameScreen = this.screens.game;
        const feedbackClass = isCorrect ? 'correct-feedback' : 'wrong-feedback';
        
        gameScreen.classList.add(feedbackClass);
        setTimeout(() => {
            gameScreen.classList.remove(feedbackClass);
        }, 500); // Durasi feedback
    }
}