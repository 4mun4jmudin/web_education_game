// File: js/ui_manager.js

class UIManager {
  constructor() {
    this.screens = {
      loading: document.getElementById("loading-screen"),
      start: document.getElementById("start-screen"),
      modeSelection: document.getElementById("mode-selection-screen"),
      game: document.getElementById("game-screen"),
      levelComplete: document.getElementById("level-complete-screen"),
      settings: document.getElementById("settings-screen"),
      achievements: document.getElementById("achievements-screen"),
    };

    this.levelIndicator = document.getElementById("level-indicator");
    this.scoreIndicator = document.getElementById("score-indicator");
    this.progressBar = document.getElementById("progress-bar");

    this.instructionText = document.getElementById("instruction-text");
    this.gameContent = document.getElementById("game-content");
    this.userInputArea = document.getElementById("user-input-area");
    this.notificationArea = document.getElementById("notification-area");

    this.sfxCorrect = document.getElementById("sfx-correct");
    this.sfxWrong = document.getElementById("sfx-wrong");

    this.activeScreen = this.screens.loading;
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
      console.error(`Layar dengan ID "${screenId}" tidak ditemukan.`);
    }
  }

  updateLevelIndicator(text) {
    this.levelIndicator.textContent = text;
  }
  updateScoreIndicator(score) {
    this.scoreIndicator.textContent = `Skor: ${score}`;
  }
  updateProgressBar(current, max) {
    this.progressBar.style.width = `${(current / max) * 100}%`;
  }
  drawInstruction(text) {
    this.instructionText.innerHTML = text;
  }
  drawChallenge(htmlContent) {
    this.gameContent.innerHTML = htmlContent;
  }
  drawUserInput(htmlContent) {
    this.userInputArea.innerHTML = htmlContent;
  }

  showLevelCompleteScreen(score, stars, onNextLevelCallback) {
    document.getElementById("level-score").textContent = score;

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

    this.showScreen("levelComplete");

    const nextLevelBtn = document.getElementById("next-level-btn");
    const newBtn = nextLevelBtn.cloneNode(true);
    nextLevelBtn.parentNode.replaceChild(newBtn, nextLevelBtn);
    newBtn.addEventListener("click", onNextLevelCallback, { once: true });
  }

  showFeedback(isCorrect) {
    const gameScreen = this.screens.game;
    const feedbackClass = isCorrect ? "correct-feedback" : "wrong-feedback";

    gameScreen.classList.add(feedbackClass);
    setTimeout(() => gameScreen.classList.remove(feedbackClass), 500);

    this.playFeedbackSfx(isCorrect);
  }

  playFeedbackSfx(isCorrect) {
    const soundToPlay = isCorrect ? this.sfxCorrect : this.sfxWrong;
    const sfxToggle = document.getElementById("sfx-toggle");
    if (soundToPlay && sfxToggle && !sfxToggle.checked) {
      soundToPlay.currentTime = 0;
      soundToPlay.play().catch((e) => console.error("Gagal memutar SFX:", e));
    }
  }

  showNotification(message, duration = 2000) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = message;
    this.notificationArea.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (
          this.notificationArea &&
          this.notificationArea.contains(notification)
        ) {
          this.notificationArea.removeChild(notification);
        }
      }, 500);
    }, duration);
  }
}
