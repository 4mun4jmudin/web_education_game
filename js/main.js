// File: js/main.js (VERSI PERBAIKAN FINAL DAN LENGKAP)

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

  // Register game modes
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

  // DOM Elements
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

  // Audio Elements & Controls
  const backgroundMusic = document.getElementById("background-music");
  const musicToggle = document.getElementById("music-toggle");
  const sfxToggle = document.getElementById("sfx-toggle");
  const ttsToggle = document.getElementById("tts-toggle");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const musicVolumeSlider = document.getElementById("music-volume-slider");

  // Audio State Management
  let musicFadeInterval;
  let currentTrackName = ""; // Deklarasi variabel yang sebelumnya hilang
  const musicTracks = {
    menu: "assets/audio/background_music.mp3",
    game: "assets/audio/game_calm_music.mp3",
    victory: "assets/audio/victory_fanfare.mp3",
  };

  // --- AUDIO FUNCTIONS ---

  function playTrack(trackName) {
    if (currentTrackName === trackName || !musicTracks[trackName]) return;

    if (settings.settings.musicMuted) {
      currentTrackName = trackName; // Simpan nama track untuk diputar nanti jika diaktifkan
      return;
    }

    // Fungsi fade out sederhana
    let fadeOut = setInterval(() => {
      if (backgroundMusic.volume > 0.1) {
        backgroundMusic.volume -= 0.1;
      } else {
        clearInterval(fadeOut);

        // Ganti track dan mulai mainkan
        backgroundMusic.src = musicTracks[trackName];
        backgroundMusic.loop = trackName !== "victory";
        currentTrackName = trackName;

        backgroundMusic
          .play()
          .then(() => {
            // Fungsi fade in sederhana
            let targetVolume = settings.settings.musicVolume;
            backgroundMusic.volume = 0;
            let fadeIn = setInterval(() => {
              if (backgroundMusic.volume < targetVolume) {
                backgroundMusic.volume = Math.min(
                  targetVolume,
                  backgroundMusic.volume + 0.1
                );
              } else {
                clearInterval(fadeIn);
              }
            }, 100);
          })
          .catch((e) => console.warn("Gagal memutar musik:", e));
      }
    }, 100);
  }

  function duckMusic(duration = 500, targetVolume = 0.1) {
    if (settings.settings.musicMuted) return;
    clearInterval(musicFadeInterval);
    const initialVolume = backgroundMusic.volume;
    const step = (initialVolume - targetVolume) / (duration / 50);
    if (step <= 0) return;

    musicFadeInterval = setInterval(() => {
      if (backgroundMusic.volume > targetVolume) {
        backgroundMusic.volume = Math.max(
          targetVolume,
          backgroundMusic.volume - step
        );
      } else {
        clearInterval(musicFadeInterval);
      }
    }, 50);
  }

  function restoreMusic(duration = 800) {
    if (settings.settings.musicMuted) return;
    clearInterval(musicFadeInterval);
    const targetVolume = settings.settings.musicVolume;
    const currentVolume = backgroundMusic.volume;
    const step = (targetVolume - currentVolume) / (duration / 50);
    if (step <= 0) return;

    musicFadeInterval = setInterval(() => {
      if (backgroundMusic.volume < targetVolume) {
        backgroundMusic.volume = Math.min(
          targetVolume,
          backgroundMusic.volume + step
        );
      } else {
        clearInterval(musicFadeInterval);
      }
    }, 50);
  }

  function handleMusicPlayback() {
    if (!settings.settings.musicMuted) {
      playTrack(currentTrackName || "menu");
    } else {
      backgroundMusic.pause();
    }
  }

  // --- UI & MODAL FUNCTIONS ---

  function setupCategorySelection() {
    if (!categoryContainer) return;
    categoryContainer.innerHTML = "";
    const categories = GAME_DATA.categories;
    const allProgress = storage.getAllProgress();
    const categoryImages = {
      animals: "assets/images/categories/animals.jpg",
      fruits: "assets/images/categories/fruits.jpg",
      objects: "assets/images/categories/objects.jpg",
      transportation: "assets/images/categories/transportation.jpg",
      verbs: "assets/images/categories/verbs.jpg",
      numbers: "assets/images/categories/numbers.jpg",
      simpleSentences: "assets/images/categories/simpleSentences.jpg",
      colors: "assets/images/categories/colors.jpg",
      shapes2D: "assets/images/categories/shapes2D.jpg",
      shapes3D: "assets/images/categories/shapes3D.jpg",
    };
    for (const categoryKey in categories) {
      const category = categories[categoryKey];
      const progress = allProgress[categoryKey] || { score: 0, stars: 0 };
      const button = document.createElement("button");
      button.className = "btn btn-category";
      button.addEventListener("click", () => {
        selectedCategoryKey = categoryKey;
        showModeSelectionModal(categoryKey);
      });
      let starsHtml = '<div class="category-stars">';
      for (let i = 1; i <= 3; i++) {
        starsHtml += `<svg class="star ${
          i <= progress.stars ? "active" : ""
        }" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
      }
      starsHtml += "</div>";
      const imagePath =
        categoryImages[categoryKey] || "assets/images/categories/default.jpg";
      button.innerHTML = `<div class="category-image-container"><img src="${imagePath}" alt="${category.displayName}" class="category-image" loading="lazy"></div><span class="category-name">${category.displayName}</span>${starsHtml}`;
      categoryContainer.appendChild(button);
    }
  }

  function openModal(modalElement) {
    modalOverlay.classList.add("active");
    modalElement.classList.add("active");
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    allModals.forEach((modal) => modal.classList.remove("active"));
  }

  function showModeSelectionModal(categoryKey) {
    const availableModes = engine.getAvailableModesForCategory(categoryKey);
    const modeContainer = document.getElementById("mode-selection-container");
    const topicTitle = document.getElementById("mode-selection-topic");
    modeContainer.innerHTML = "";
    topicTitle.textContent = `Topik: ${GAME_DATA.categories[categoryKey].displayName}`;

    for (const modeId in availableModes) {
      const button = document.createElement("button");
      button.className = "btn btn-mode";
      button.textContent = availableModes[modeId];
      button.addEventListener("click", () => {
        closeModal();
        engine.startGame(categoryKey, modeId);
        playTrack("game");
      });
      modeContainer.appendChild(button);
    }
    openModal(modeSelectionModal);
  }

  function showSettingsModal() {
    updateSettingsUI();
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
      item.innerHTML = `<div class="achievement-icon">🏆</div><div class="achievement-details"><div class="achievement-name">${ach.name}</div><div class="achievement-description">${ach.description}</div></div>`;
      container.appendChild(item);
    }
    openModal(achievementsModal);
  }

  function updateSettingsUI() {
    musicToggle.checked = !settings.settings.musicMuted;
    sfxToggle.checked = !settings.settings.sfxMuted;
    ttsToggle.checked = !settings.settings.ttsMuted;
    darkModeToggle.checked = settings.settings.darkMode;
    musicVolumeSlider.value = settings.settings.musicVolume;
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

  function handleDarkMode() {
    document.body.classList.toggle("dark-mode", settings.settings.darkMode);
  }

  // --- EVENT LISTENERS ---

  quitGameBtn.addEventListener("click", () => {
    engine.quitGame();
    playTrack("menu");
  });
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

  musicVolumeSlider.addEventListener("input", (e) => {
    const newVolume = parseFloat(e.target.value);
    settings.updateSetting("musicVolume", newVolume);
    if (!settings.settings.musicMuted) {
      backgroundMusic.volume = newVolume;
    }
  });

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

  // --- INITIALIZATION ---

  function initializeGame() {
    setTimeout(() => {
      ui.showScreen("start");
    }, 500);

    setupCategorySelection();
    updateSettingsUI();
    updateDifficultyUI();
    handleDarkMode();

    // Set initial track and try to play
    currentTrackName = "menu";
    handleMusicPlayback();
  }

  initializeGame();
});
