// File: js/ui_manager.js (FINAL & PERBAIKAN LENGKAP)

class UIManager {
  constructor() {
    this.screens = {
      loading: document.getElementById("loading-screen"),
      start: document.getElementById("start-screen"),
      game: document.getElementById("game-screen"),
      levelComplete: document.getElementById("level-complete-screen"),
    };

    this.levelIndicator = document.getElementById("level-indicator");
    this.scoreIndicator = document.getElementById("score-indicator");
    this.progressBar = document.getElementById("progress-bar");
    this.instructionText = document.getElementById("instruction-text");
    this.gameContent = document.getElementById("game-content");
    this.userInputArea = document.getElementById("user-input-area");
    this.feedbackOverlay = document.getElementById("modal-overlay");

    this.activeScreen = this.screens.loading;
    this.onNextLevelCallback = null;
    this.nextLevelBtn = document.getElementById("next-level-btn");

    if (this.nextLevelBtn) {
      this.nextLevelBtn.addEventListener("click", () => {
        if (this.onNextLevelCallback) {
          this.onNextLevelCallback();
        }
      });
    }
  }

  showScreen(screenId) {
    if (this.activeScreen) {
      this.activeScreen.classList.remove("active");
    }
    const newScreen = this.screens[screenId];
    if (newScreen) {
      newScreen.classList.add("active");
      this.activeScreen = newScreen;
    } else {
      console.error(
        `Error: Layar dengan ID "${screenId}" tidak dikelola oleh UIManager.`
      );
    }
  }

  updateLevelIndicator(text) {
    if (this.levelIndicator) this.levelIndicator.textContent = text;
  }

  updateScoreIndicator(score) {
    if (this.scoreIndicator) this.scoreIndicator.textContent = `Skor: ${score}`;
  }

  updateProgressBar(current, max) {
    if (this.progressBar) {
      const percentage = max > 0 ? (current / max) * 100 : 0;
      this.progressBar.style.width = `${percentage}%`;
    }
  }

  drawInstruction(text) {
    if (this.instructionText) this.instructionText.innerHTML = text;
  }

  drawChallenge(htmlContent) {
    if (this.gameContent) this.gameContent.innerHTML = htmlContent;
  }

  drawUserInput(htmlContent) {
    if (this.userInputArea) {
      this.userInputArea.innerHTML = htmlContent;
    }
  }

  displayFeedback(isCorrect, onContinue) {
    const feedbackClass = isCorrect ? "feedback-correct" : "feedback-wrong";
    const title = isCorrect ? "🎉 Benar! 🎉" : "❌ Coba Lagi! ❌";
    const buttonText = "Lanjut";

    const feedbackHTML = `
      <div class="feedback-modal ${feedbackClass}">
        <div class="feedback-content">
          <h2 class="feedback-title">${title}</h2>
          <button id="feedback-continue-btn" class="btn btn-primary">${buttonText}</button>
        </div>
      </div>
    `;

    if (this.feedbackOverlay) {
      this.feedbackOverlay.innerHTML = feedbackHTML;
      this.feedbackOverlay.classList.add("active", "feedback-mode");

      document
        .getElementById("feedback-continue-btn")
        .addEventListener("click", () => {
          this.hideFeedback();
          onContinue();
        });
    }
  }

  hideFeedback() {
    if (this.feedbackOverlay) {
      this.feedbackOverlay.innerHTML = "";
      this.feedbackOverlay.classList.remove("active", "feedback-mode");
    }
  }

  showLevelCompleteScreen(
    score,
    stars,
    correctAnswers,
    wrongAnswers,
    onNextLevelCallback
  ) {
    const scoreEl = document.getElementById("level-score");
    if (scoreEl) scoreEl.textContent = score;

    const correctEl = document.getElementById("correct-count");
    if (correctEl) correctEl.textContent = correctAnswers;

    const wrongEl = document.getElementById("wrong-count");
    if (wrongEl) wrongEl.textContent = wrongAnswers;

    const starsContainer = document.getElementById("result-stars-container");
    if (starsContainer) {
      starsContainer.innerHTML = "";
      for (let i = 1; i <= 3; i++) {
        const star = document.createElement("img");
        star.src = "assets/images/ui/star-svgrepo-com.svg";
        star.alt = "Bintang";
        star.className = `result-star ${i <= stars ? "active" : ""}`;
        starsContainer.appendChild(star);
      }
    }

    this.onNextLevelCallback = onNextLevelCallback;
    this.showScreen("levelComplete");
  }

  triggerScreenShake() {
    const gameScreen = this.screens.game;
    if (gameScreen) {
      gameScreen.classList.add("shake-feedback");
      setTimeout(() => {
        gameScreen.classList.remove("shake-feedback");
      }, 500);
    }
  }

  showNotification(message, duration = 2000, type = "default") {
    const notificationArea = document.getElementById("notification-area");
    if (!notificationArea) return;

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.classList.add(type);
    notification.innerHTML = message;

    notificationArea.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      notification.addEventListener("transitionend", () => {
        if (notification.parentElement) {
          notification.parentElement.removeChild(notification);
        }
      });
    }, duration);
  }
}
