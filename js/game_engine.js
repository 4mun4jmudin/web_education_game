// File: js/game_engine.js

class GameEngine {
  constructor(
    uiManager,
    speechHandler,
    aiHandler,
    storageManager,
    settingsManager,
    achievementManager
  ) {
    this.ui = uiManager;
    this.speech = speechHandler;
    this.ai = aiHandler;
    this.storage = storageManager;
    this.settings = settingsManager;
    this.achievements = achievementManager;
    this.score = 0;
    this.correctStreak = 0;
    this.levelData = null;
    this.challenges = [];
    this.currentChallengeIndex = 0;
    this.gameModes = {};
  }

  registerGameMode(name, modeObject) {
    this.gameModes[name] = modeObject;
    modeObject.engine = this;
  }

  getAvailableModesForCategory(categoryName) {
    const modeNames = {
      VocabularyMatch: "Cocokkan Gambar",
      ListenAndType: "Dengar & Ketik",
      SpeakTheWord: "Ucapkan Kata",
      SentenceBuilder: "Susun Kalimat",
    };
    let availableModeIds;
    if (categoryName === "simpleSentences") {
      availableModeIds = ["SentenceBuilder", "ListenAndType"];
    } else if (
      [
        "animals",
        "fruits",
        "objects",
        "transportation",
        "colors",
        "shapes2D",
        "shapes3D",
        "numbers",
      ].includes(categoryName)
    ) {
      availableModeIds = ["VocabularyMatch", "ListenAndType", "SpeakTheWord"];
    } else if (categoryName === "verbs") {
      availableModeIds = ["ListenAndType", "SpeakTheWord"];
    } else {
      availableModeIds = ["ListenAndType"];
    }
    const result = {};
    availableModeIds.forEach((id) => {
      if (modeNames[id]) result[id] = modeNames[id];
    });
    return result;
  }

  startGame(categoryName, gameModeName) {
    this.score = 0;
    this.correctStreak = 0;
    this.currentChallengeIndex = 0;

    // Cukup simpan gameModeName, baik itu mode spesifik atau 'MIXED'
    this.levelData = {
      gameMode: gameModeName,
      category: categoryName,
      challengesCount: 5,
    };

    this.prepareChallenges();
    const categoryDisplayName =
      GAME_DATA.categories[this.levelData.category].displayName;
    this.ui.updateLevelIndicator(`Topik: ${categoryDisplayName}`);
    this.ui.updateScoreIndicator(this.score);
    this.ui.showScreen("game");
    this.nextChallenge();
  }

  prepareChallenges() {
    this.challenges = [];
    const categoryWords = [
      ...GAME_DATA.categories[this.levelData.category].words,
    ];
    categoryWords.sort(() => 0.5 - Math.random());
    const difficulty = this.settings.settings.difficulty;
    let challengeCount = 5;
    if (difficulty === "medium") {
      challengeCount = 7;
    } else if (difficulty === "hard") {
      challengeCount = 10;
    }
    this.levelData.challengesCount = challengeCount;

    // Untuk mode campuran, kita ambil tantangan lebih banyak untuk variasi
    if (this.levelData.gameMode === "MIXED") {
      challengeCount = 7;
    }

    if (
      this.levelData.gameMode === "SentenceBuilder" &&
      difficulty === "hard"
    ) {
      const longSentences = categoryWords.filter(
        (w) => w.en.split(" ").length > 4
      );
      this.challenges =
        longSentences.length >= challengeCount
          ? longSentences.slice(0, challengeCount)
          : categoryWords.slice(0, challengeCount);
    } else {
      this.challenges = categoryWords.slice(0, this.levelData.challengesCount);
    }
  }

  // --- FUNGSI INI DIPERBARUI SECARA SIGNIFIKAN ---
  async nextChallenge() {
    if (this.currentChallengeIndex >= this.challenges.length) {
      this.completeSession();
      return;
    }
    this.ui.updateProgressBar(
      this.currentChallengeIndex,
      this.challenges.length
    );
    const challengeData = this.challenges[this.currentChallengeIndex];
    const categoryName = this.levelData.category;

    // Ambil mode default dari sesi
    let modeName = this.levelData.gameMode;

    // Jika ini adalah sesi 'MIXED', pilih mode baru untuk SETIAP TANTANGAN
    if (modeName === "MIXED") {
      const availableModes = this.getAvailableModesForCategory(categoryName);
      const modeIds = Object.keys(availableModes);
      // Pilih satu ID mode secara acak
      const randomId = modeIds[Math.floor(Math.random() * modeIds.length)];
      modeName = randomId; // Timpa modeName hanya untuk tantangan ini
    }

    const mode = this.gameModes[modeName];
    if (mode) {
      const dynamicInstruction = await this.ai.createDynamicInstruction(
        modeName,
        categoryName,
        challengeData
      );
      const categoryWordList = GAME_DATA.categories[categoryName].words;
      const difficulty = this.settings.settings.difficulty;

      // Teruskan modeName yang benar-benar digunakan ke submitAnswer
      mode.start(
        challengeData,
        (isCorrect, userAnswer) =>
          this.submitAnswer(isCorrect, userAnswer, modeName),
        dynamicInstruction,
        categoryWordList,
        difficulty
      );
    } else {
      console.error(`Game Mode "${modeName}" tidak terdaftar!`);
    }
  }

  // --- FUNGSI INI JUGA DIPERBARUI ---
  async submitAnswer(isCorrect, userAnswer = "", modePlayed = null) {
    this.ui.showFeedback(isCorrect);
    if (isCorrect) {
      this.score += 10;
      this.correctStreak++;
      if (this.correctStreak >= 3) {
        const bonusPoints = 5;
        this.score += bonusPoints;
        this.ui.showNotification(
          `Rentetan ${this.correctStreak}! +${bonusPoints} Poin!`
        );
      }
      this.ui.updateScoreIndicator(this.score);
    } else {
      this.correctStreak = 0;
      const correctAnswer = this.challenges[this.currentChallengeIndex].en;

      // Gunakan mode yang benar-benar dimainkan untuk umpan balik AI
      const modeForFeedback = modePlayed || this.levelData.gameMode;
      const correctiveFeedback = await this.ai.getCorrectiveFeedback(
        modeForFeedback,
        correctAnswer,
        userAnswer
      );

      if (correctiveFeedback) {
        this.ui.drawInstruction(correctiveFeedback);
      }
    }
    this.currentChallengeIndex++;
    const timeoutDuration = isCorrect ? 1200 : 3000;
    setTimeout(() => this.nextChallenge(), timeoutDuration);
  }

  calculateStars(score, totalChallenges) {
    const maxScore = totalChallenges * 10;
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (percentage >= 99) return 3;
    if (percentage >= 50) return 2;
    if (score > 0) return 1;
    return 0;
  }

  completeSession() {
    this.ui.updateProgressBar(this.challenges.length, this.challenges.length);
    const stars = this.calculateStars(this.score, this.challenges.length);
    if (this.levelData) {
      this.storage.saveProgress(this.levelData.category, this.score, stars);
      const sessionData = {
        category: this.levelData.category,
        // Jika mode campuran, jangan berikan achievement spesifik mode
        gameMode:
          this.levelData.gameMode === "MIXED" ? "" : this.levelData.gameMode,
        score: this.score,
        stars: stars,
        totalChallenges: this.challenges.length,
      };
      const newlyUnlocked = this.achievements.checkAndUnlock(sessionData);
      newlyUnlocked.forEach((ach, index) => {
        setTimeout(() => {
          this.ui.showNotification(`🏆 Pencapaian Terbuka: ${ach.name}`, 3500);
        }, index * 1000);
      });
    }
    this.ui.showLevelCompleteScreen(this.score, stars, () => {
      this.ui.showScreen("start");
      document.dispatchEvent(new Event("requestCategoryUpdate"));
    });
  }

  quitGame() {
    this.score = 0;
    this.ui.showScreen("start");
    document.dispatchEvent(new Event("requestCategoryUpdate"));
  }
}
