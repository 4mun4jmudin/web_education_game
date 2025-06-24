// File: js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const GEMINI_API_KEY = "AIzaSyCxtPxGJg1tsHcd-M61M3wRVibrLtzE2dU";

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

  let selectedCategoryKey = null;

  const categoryContainer = document.getElementById(
    "category-selection-container"
  );
  const backToTopicsBtn = document.getElementById("back-to-topics-btn");
  const quitGameBtn = document.getElementById("quit-game-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const achievementsBtn = document.getElementById("achievements-btn");
  const backToStartBtn = document.getElementById("back-to-start-btn");
  const closeSettingsBtn = document.getElementById("close-settings-btn");
  const musicToggle = document.getElementById("music-toggle");
  const sfxToggle = document.getElementById("sfx-toggle");
  const ttsToggle = document.getElementById("tts-toggle");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const backgroundMusic = document.getElementById("background-music");
  const difficultyButtons = document.querySelectorAll(".btn-difficulty");

  function setupCategorySelection() {
    if (!categoryContainer) return;
    categoryContainer.innerHTML = "";
    const categories = GAME_DATA.categories;
    const allProgress = storage.getAllProgress();
    for (const categoryKey in categories) {
      const category = categories[categoryKey];
      const progress = allProgress[categoryKey] || { score: 0, stars: 0 };
      const button = document.createElement("button");
      button.className = "btn-category";
      if (progress.score > 0) button.classList.add("completed");
      button.addEventListener("click", () => {
        selectedCategoryKey = categoryKey;
        showModeSelectionScreen(categoryKey);
      });
      let starsHtml = '<div class="category-stars">';
      for (let i = 1; i <= 3; i++) {
        starsHtml += `<img src="assets/images/ui/star-svgrepo-com.svg" class="star ${
          i <= progress.stars ? "active" : ""
        }" alt="Bintang">`;
      }
      starsHtml += "</div>";
      let buttonContent = `<span class="category-name">${category.displayName}</span>${starsHtml}`;
      button.innerHTML = buttonContent;
      categoryContainer.appendChild(button);
    }
  }

  // --- FUNGSI INI DIPERBARUI ---
  function showModeSelectionScreen(categoryKey) {
    const availableModes = engine.getAvailableModesForCategory(categoryKey);
    const modeContainer = document.getElementById("mode-selection-container");
    const topicTitle = document.getElementById("mode-selection-topic");
    modeContainer.innerHTML = "";
    topicTitle.textContent = `Topik: ${GAME_DATA.categories[categoryKey].displayName}`;

    // Buat tombol untuk setiap mode yang tersedia
    for (const modeId in availableModes) {
      const button = document.createElement("button");
      button.className = "btn-mode";
      button.textContent = availableModes[modeId];
      button.addEventListener("click", () => {
        engine.startGame(selectedCategoryKey, modeId);
      });
      modeContainer.appendChild(button);
    }

    // -- DIPERBARUI: Tombol untuk "Mode Campuran" --
    if (Object.keys(availableModes).length > 1) {
      const randomButton = document.createElement("button");
      randomButton.className = "btn-mode btn-secondary";
      randomButton.textContent = "Mode Campuran (Acak)"; // <-- Teks diubah
      randomButton.style.marginTop = "10px";
      randomButton.addEventListener("click", () => {
        // Panggil engine dengan flag 'MIXED' untuk mode campuran
        engine.startGame(selectedCategoryKey, "MIXED"); // <-- Flag diubah
      });
      modeContainer.appendChild(randomButton);
    }
    // -- AKHIR PEMBARUAN --

    ui.showScreen("modeSelection");
  }

  function showAchievementsScreen() {
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
    ui.showScreen("achievements");
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

  backToTopicsBtn.addEventListener("click", () => ui.showScreen("start"));
  quitGameBtn.addEventListener("click", () => engine.quitGame());
  settingsBtn.addEventListener("click", () => {
    updateSettingsTogglesUI();
    ui.showScreen("settings");
  });
  achievementsBtn.addEventListener("click", showAchievementsScreen);
  backToStartBtn.addEventListener("click", () => ui.showScreen("start"));
  closeSettingsBtn.addEventListener("click", () => ui.showScreen("start"));
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
    setupCategorySelection();
    updateSettingsTogglesUI();
    updateDifficultyUI();
    handleMusicPlayback();
    handleDarkMode();
    ui.showScreen("start");
  }

  initializeGame();
});
