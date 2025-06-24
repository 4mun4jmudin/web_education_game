// File: js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const GEMINI_API_KEY = "AIzaSyDeiTFdZfIp3ekaJEAFLsfXRaU5M5_zyDs";

  const storage = new StorageManager();
  const settings = new SettingsManager();
  const achievements = new AchievementManager();
  const ui = new UIManager();
  const speech = new SpeechHandler(settings);
  const ai = new AIHandler(GEMINI_API_KEY);
  const engine = new GameEngine(
    ui,
    speech,
    ai,
    storage,
    settings,
    achievements
  );

  // ... (registrasi mode game tidak berubah)
  engine.registerGameMode(
    "VocabularyMatch",
    new VocabularyMatchMode(ui, speech)
  );
  engine.registerGameMode("ListenAndType", new ListenAndTypeMode(ui, speech));
  engine.registerGameMode("SpeakTheWord", new SpeakTheWordMode(ui, speech));
  engine.registerGameMode(
    "SentenceBuilder",
    new SentenceBuilderMode(ui, speech)
  );
  engine.registerGameMode("AIStoryTime", new AIStoryTimeMode(ui, speech, ai));

  let selectedCategoryKey = null;

  // ... (deklarasi elemen DOM tidak berubah)
  const categoryContainer = document.getElementById(
    "category-selection-container"
  );
  const quitGameBtn = document.getElementById("quit-game-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const achievementsBtn = document.getElementById("achievements-btn");
  const modalOverlay = document.getElementById("modal-overlay");
  const allModals = document.querySelectorAll(".modal");
  const modeSelectionModal = document.getElementById("mode-selection-modal");
  const settingsModal = document.getElementById("settings-modal");
  const achievementsModal = document.getElementById("achievements-modal");
  const difficultyButtons = document.querySelectorAll(".btn-difficulty");
  const musicToggle = document.getElementById("music-toggle");
  const sfxToggle = document.getElementById("sfx-toggle");
  const ttsToggle = document.getElementById("tts-toggle");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const backgroundMusic = document.getElementById("background-music");

  // ... (fungsi setupCategorySelection tidak berubah)
  function setupCategorySelection() {
    if (!categoryContainer) return;
    categoryContainer.innerHTML = "";
    const categories = GAME_DATA.categories;
    const allProgress = storage.getAllProgress();
    for (const categoryKey in categories) {
      const category = categories[categoryKey];
      const progress = allProgress[categoryKey] || { score: 0, stars: 0 };
      const button = document.createElement("button");
      button.className = "btn btn-category";
      if (progress.score > 0) button.classList.add("completed");

      button.addEventListener("click", () => {
        selectedCategoryKey = categoryKey;
        showModeSelectionModal(categoryKey);
      });

      let starsHtml = '<div class="category-stars">';
      for (let i = 1; i <= 3; i++) {
        const starIcon = `<svg class="star ${
          i <= progress.stars ? "active" : ""
        }" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
        starsHtml += starIcon;
      }
      starsHtml += "</div>";

      let buttonContent = `<span class="category-name">${category.displayName}</span>${starsHtml}`;
      button.innerHTML = buttonContent;
      categoryContainer.appendChild(button);
    }
  }

  function openModal(modalElement) {
    modalOverlay.classList.add("active");
    modalElement.classList.add("active");
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    allModals.forEach((modal) => {
      modal.classList.remove("active");
    });
  }

  // --- FUNGSI INI DIPERBARUI TOTAL ---
  function showModeSelectionModal(categoryKey) {
    const availableModes = engine.getAvailableModesForCategory(categoryKey);
    const modeContainer = document.getElementById("mode-selection-container");
    const topicTitle = document.getElementById("mode-selection-topic");
    const mistakes = storage.getMistakesForCategory(categoryKey);

    modeContainer.innerHTML = "";
    topicTitle.textContent = `Topik: ${GAME_DATA.categories[categoryKey].displayName}`;

    // Tombol Mode Ulasan (hanya muncul jika ada kesalahan)
    if (mistakes.length > 0) {
      const reviewButton = document.createElement("button");
      reviewButton.className = "btn btn-mode review-mode";
      reviewButton.innerHTML = `🧠 Latih Kesalahan Saya <span class="mistake-count">${mistakes.length}</span>`;
      reviewButton.addEventListener("click", () => {
        closeModal();
        engine.startGame(selectedCategoryKey, "REVIEW");
      });
      modeContainer.appendChild(reviewButton);
    }

    // Tombol mode normal
    for (const modeId in availableModes) {
      const button = document.createElement("button");
      button.className = "btn btn-mode";
      button.textContent = availableModes[modeId];
      button.addEventListener("click", () => {
        closeModal();
        engine.startGame(selectedCategoryKey, modeId);
      });
      modeContainer.appendChild(button);
    }

    // Tombol mode campuran
    if (Object.keys(availableModes).length > 1) {
      const randomButton = document.createElement("button");
      randomButton.className = "btn btn-mode btn-secondary";
      randomButton.textContent = "Mode Campuran (Acak)";
      randomButton.addEventListener("click", () => {
        closeModal();
        engine.startGame(selectedCategoryKey, "MIXED");
      });
      modeContainer.appendChild(randomButton);
    }

    openModal(modeSelectionModal);
  }

  // ... (sisa file main.js tidak berubah)
  function showSettingsModal() {
    updateSettingsTogglesUI();
    openModal(settingsModal);
  }

  function showAchievementsModal() {
    const container = document.getElementById("achievements-list-container");
    container.innerHTML = "";
    const allAchievements = achievements.achievements;
    const unlockedAchievements = achievements.unlocked;
    for (const id in allAchievements) {
      const ach = allAchievements[id];
      const isUnlocked = unlockedAchievements.has(id);
      const item = document.createElement("div");
      item.className = `achievement-item ${isUnlocked ? "unlocked" : ""}`;
      item.innerHTML = `
        <div class="achievement-icon">🏆</div>
        <div class="achievement-details">
          <div class="achievement-name">${ach.name}</div>
          <div class="achievement-description">${ach.description}</div>
        </div>
      `;
      container.appendChild(item);
    }
    openModal(achievementsModal);
  }

  function updateSettingsTogglesUI() {
    musicToggle.checked = !settings.settings.musicMuted;
    sfxToggle.checked = !settings.settings.sfxMuted;
    ttsToggle.checked = !settings.settings.ttsMuted;
    darkModeToggle.checked = settings.settings.darkMode;
  }

  function updateDifficultyUI() {
    const currentDifficulty = settings.settings.difficulty;
    difficultyButtons.forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.dataset.difficulty === currentDifficulty
      );
    });
  }

  function handleMusicPlayback() {
    if (!settings.settings.musicMuted) {
      backgroundMusic
        .play()
        .catch((e) =>
          console.warn("Musik latar gagal diputar. Perlu interaksi pengguna.")
        );
    } else {
      backgroundMusic.pause();
    }
  }

  function handleDarkMode() {
    document.body.classList.toggle("dark-mode", settings.settings.darkMode);
  }

  quitGameBtn.addEventListener("click", () => engine.quitGame());
  settingsBtn.addEventListener("click", showSettingsModal);
  achievementsBtn.addEventListener("click", showAchievementsModal);

  modalOverlay.addEventListener("click", closeModal);

  document.querySelectorAll(".modal .btn-secondary").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  musicToggle.addEventListener("change", () =>
    settings.updateSetting("musicMuted", !musicToggle.checked)
  );
  sfxToggle.addEventListener("change", () =>
    settings.updateSetting("sfxMuted", !sfxToggle.checked)
  );
  ttsToggle.addEventListener("change", () =>
    settings.updateSetting("ttsMuted", !ttsToggle.checked)
  );
  darkModeToggle.addEventListener("change", () =>
    settings.updateSetting("darkMode", darkModeToggle.checked)
  );

  difficultyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      settings.updateSetting("difficulty", btn.dataset.difficulty);
    });
  });

  document.addEventListener("settingsChanged", (e) => {
    switch (e.detail.key) {
      case "musicMuted":
        handleMusicPlayback();
        break;
      case "difficulty":
        updateDifficultyUI();
        break;
      case "darkMode":
        handleDarkMode();
        break;
    }
  });

  document.addEventListener("requestCategoryUpdate", setupCategorySelection);

  function initializeGame() {
    setTimeout(() => {
      ui.showScreen("start");
    }, 500);

    setupCategorySelection();
    updateSettingsTogglesUI();
    updateDifficultyUI();
    handleMusicPlayback();
    handleDarkMode();
  }

  initializeGame();
});
