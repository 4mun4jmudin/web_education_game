// File: js/game_engine.js (FINAL & PERBAIKAN LENGKAP)

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
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
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
      AIStoryTime: "Cerita AI",
    };
    let availableModeIds;
    const storyFriendlyCategories = [
      "animals",
      "fruits",
      "objects",
      "transportation",
    ];
    if (storyFriendlyCategories.includes(categoryName)) {
      availableModeIds = [
        "VocabularyMatch",
        "ListenAndType",
        "SpeakTheWord",
        "AIStoryTime",
      ];
    } else if (categoryName === "simpleSentences") {
      availableModeIds = ["SentenceBuilder", "ListenAndType"];
    } else if (
      ["colors", "shapes2D", "shapes3D", "numbers", "verbs"].includes(
        categoryName
      )
    ) {
      availableModeIds = ["VocabularyMatch", "ListenAndType", "SpeakTheWord"];
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
    if (gameModeName === "RANDOM" || gameModeName === "MIXED") {
      const availableModes = this.getAvailableModesForCategory(categoryName);
      const modeIds = Object.keys(availableModes);
      const randomId = modeIds[Math.floor(Math.random() * modeIds.length)];
      gameModeName = gameModeName === "RANDOM" ? randomId : "MIXED";
    }
    this.score = 0;
    this.correctStreak = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.currentChallengeIndex = 0;
    this.levelData = {
      gameMode: gameModeName,
      category: categoryName,
      challengesCount: 20,
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
    const category = this.levelData.category;
    if (this.levelData.gameMode === "REVIEW") {
      const mistakes = this.storage.getMistakesForCategory(category);
      this.challenges = [...mistakes].sort(() => 0.5 - Math.random());
      this.levelData.challengesCount = this.challenges.length;
      return;
    }
    let challengeCount;
    const difficulty = this.settings.settings.difficulty;
    if (this.levelData.gameMode === "AIStoryTime") {
      challengeCount = 20;
    } else if (this.levelData.gameMode === "MIXED") {
      challengeCount = 25;
    } else {
      challengeCount = 30;
      if (difficulty === "medium") challengeCount = 3;
      else if (difficulty === "hard") challengeCount = 3;
    }
    this.levelData.challengesCount = challengeCount;
    const categoryWords = [...GAME_DATA.categories[category].words];
    categoryWords.sort(() => 0.5 - Math.random());
    for (let i = 0; i < this.levelData.challengesCount; i++) {
      // PERUBAHAN: Mendorong seluruh objek kata, bukan hanya en dan id.
      // Ini memastikan properti 'image' juga ikut terbawa.
      const wordData = categoryWords[i % categoryWords.length];
      if (wordData) {
        this.challenges.push(wordData);
      }
    }
  }

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
    let modeName = this.levelData.gameMode;
    if (modeName === "MIXED" || modeName === "REVIEW") {
      const availableModes = this.getAvailableModesForCategory(categoryName);
      const modeIds = Object.keys(availableModes).filter(
        (id) => id !== "AIStoryTime"
      );
      const randomId = modeIds[Math.floor(Math.random() * modeIds.length)];
      modeName = randomId;
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
      mode.start(
        challengeData,
        (isCorrect, userAnswer) => this.submitAnswer(isCorrect, userAnswer),
        dynamicInstruction,
        categoryWordList,
        difficulty
      );
    } else {
      console.error(`Game Mode "${modeName}" tidak terdaftar!`);
    }
  }

  async submitAnswer(isCorrect, userAnswer = "") {
    const currentChallenge = this.challenges[this.currentChallengeIndex];
    const category = this.levelData.category;
    const sessionMode = this.levelData.gameMode;

    if (isCorrect) {
      this.score += 5;
      this.correctStreak++;
      this.correctAnswers++;
      this.ui.showNotification("+5 Poin!", 1000, "correct");
      this.ui.updateScoreIndicator(this.score);

      if (sessionMode === "REVIEW") {
        this.storage.removeMistake(category, currentChallenge);
      }
    } else {
      this.correctStreak = 0;
      this.wrongAnswers++;
      this.ui.triggerScreenShake();
      this.ui.showNotification("", 1000, "wrong");
      if (sessionMode !== "REVIEW") {
        this.storage.addMistake(category, currentChallenge);
      }
    }

    this.currentChallengeIndex++;
    setTimeout(() => this.nextChallenge(), 1200);
  }

  calculateStars(score, totalChallenges) {
    const maxScore = totalChallenges * 5;
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (percentage >= 90) return 3;
    if (percentage >= 60) return 2;
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
        gameMode:
          this.levelData.gameMode === "MIXED" ? "" : this.levelData.gameMode,
        score: this.score,
        stars: stars,
        totalChallenges: this.challenges.length,
      };
      const newlyUnlocked = this.achievements.checkAndUnlock(sessionData);
      newlyUnlocked.forEach((ach, index) => {
        setTimeout(() => {
          this.ui.showNotification(
            `🏆 Pencapaian Terbuka: ${ach.name}`,
            3500,
            "achievement"
          );
        }, index * 1000);
      });
    }

    this.ui.showLevelCompleteScreen(
      this.score,
      stars,
      this.correctAnswers,
      this.wrongAnswers,
      () => {
        this.ui.showScreen("start");
        document.dispatchEvent(new Event("requestCategoryUpdate"));
      }
    );
  }

  quitGame() {
    this.score = 0;
    this.ui.showScreen("start");
    document.dispatchEvent(new Event("requestCategoryUpdate"));
  }
}
