// File: js/ui_manager.js

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
    this.notificationArea = document.getElementById("notification-area");

    this.activeScreen = this.screens.loading;

    // --- PERBAIKAN DIMULAI DI SINI ---
    this.onNextLevelCallback = null; // Properti untuk menyimpan fungsi callback
    this.nextLevelBtn = document.getElementById("next-level-btn");

    // Pasang event listener hanya sekali saat UIManager dibuat
    if (this.nextLevelBtn) {
      this.nextLevelBtn.addEventListener("click", () => {
        // Saat diklik, panggil fungsi callback yang tersimpan
        if (this.onNextLevelCallback) {
          this.onNextLevelCallback();
        }
      });
    }
    // --- AKHIR PERBAIKAN ---
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
    if (this.userInputArea) this.userInputArea.innerHTML = htmlContent;
  }

  // --- PERBAIKAN PADA FUNGSI INI ---
  showLevelCompleteScreen(score, stars, onNextLevelCallback) {
    const scoreEl = document.getElementById("level-score");
    if (scoreEl) scoreEl.textContent = score;

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

    // Simpan fungsi callback yang baru ke properti class
    this.onNextLevelCallback = onNextLevelCallback;

    // Hapus logika cloneNode yang rumit dan tidak perlu
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
    if (!this.notificationArea) return;

    const notification = document.createElement("div");
    notification.className = "notification";
    notification.classList.add(type);
    notification.innerHTML = message;

    this.notificationArea.appendChild(notification);

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
