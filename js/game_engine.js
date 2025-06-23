// File: js/game_engine.js

class GameEngine {
  constructor(uiManager, speechHandler, aiHandler) {
    this.ui = uiManager;
    this.speech = speechHandler;
    this.ai = aiHandler; // Referensi ke AI Handler
    this.currentLevel = 0;
    this.score = 0;
    this.levelData = null;
    this.challenges = [];
    this.currentChallengeIndex = 0;
    this.gameModes = {};
    this.usedCategories = []; // Untuk mencegah pengulangan kategori secara langsung
  }

  registerGameMode(name, modeObject) {
    this.gameModes[name] = modeObject;
    modeObject.engine = this; // Beri akses ke engine
  }

  startNextAdventure() {
    this.currentLevel++;
    this.generateNewLevelData();
    this.prepareChallenges();
    this.currentChallengeIndex = 0;

    const categoryDisplayName =
      GAME_DATA.categories[this.levelData.category].displayName;
    this.ui.updateLevelIndicator(
      `Petualangan ${this.currentLevel}: ${categoryDisplayName}`
    );
    this.ui.updateScoreIndicator(this.score);
    this.ui.showScreen("game");

    this.nextChallenge();
  }

  generateNewLevelData() {
    let availableCategories = Object.keys(GAME_DATA.categories).filter(
      (cat) => !this.usedCategories.includes(cat)
    );
    if (availableCategories.length === 0) {
      this.usedCategories = []; // Reset jika semua sudah dipakai
      availableCategories = Object.keys(GAME_DATA.categories);
    }

    const randomCategoryName =
      availableCategories[
        Math.floor(Math.random() * availableCategories.length)
      ];
    this.usedCategories.push(randomCategoryName);

    const availableModes = Object.keys(this.gameModes);
    let filteredModes;

    if (randomCategoryName === "simpleSentences") {
      filteredModes = ["SentenceBuilder", "ListenAndType"];
    } else if (
      randomCategoryName === "verbs" ||
      randomCategoryName === "objects" ||
      randomCategoryName === "transportation" ||
      randomCategoryName === "animals" ||
      randomCategoryName === "fruits"
    ) {
      filteredModes = ["VocabularyMatch", "ListenAndType", "SpeakTheWord"];
    } else {
      filteredModes = ["VocabularyMatch", "ListenAndType"];
    }

    const randomModeName =
      filteredModes[Math.floor(Math.random() * filteredModes.length)];

    this.levelData = {
      gameMode: randomModeName,
      category: randomCategoryName,
      challengesCount: 5, // Setiap petualangan punya 5 tantangan
    };
  }

  prepareChallenges() {
    this.challenges = [];
    const categoryWords = [
      ...GAME_DATA.categories[this.levelData.category].words,
    ];

    // Acak urutan kata
    categoryWords.sort(() => 0.5 - Math.random());

    this.challenges = categoryWords.slice(0, this.levelData.challengesCount);
  }

  async nextChallenge() {
    // Dibuat async untuk menunggu instruksi dari AI
    if (this.currentChallengeIndex >= this.challenges.length) {
      this.completeLevel();
      return;
    }

    this.ui.updateProgressBar(
      this.currentChallengeIndex,
      this.challenges.length
    );
    const challengeData = this.challenges[this.currentChallengeIndex];
    const modeName = this.levelData.gameMode;
    const categoryName = this.levelData.category;
    const mode = this.gameModes[modeName];

    if (mode) {
      // Minta AI untuk membuat instruksi dinamis
      const dynamicInstruction = await this.ai.createDynamicInstruction(
        modeName,
        categoryName,
        challengeData
      );

      // Mulai mode permainan dengan instruksi dari AI
      mode.start(
        challengeData,
        (isCorrect) => this.submitAnswer(isCorrect),
        dynamicInstruction
      );
    } else {
      console.error(`Game Mode "${modeName}" tidak terdaftar!`);
    }
  }

  submitAnswer(isCorrect) {
    this.ui.showFeedback(isCorrect);
    if (isCorrect) {
      this.score += 10;
      this.ui.updateScoreIndicator(this.score);
    }

    this.currentChallengeIndex++;

    // Jeda singkat sebelum lanjut ke tantangan berikutnya
    setTimeout(() => {
      this.nextChallenge();
    }, 1200); // 1.2 detik
  }

  completeLevel() {
    this.ui.updateProgressBar(this.challenges.length, this.challenges.length);
    this.ui.showLevelCompleteScreen(this.score, () => {
      this.startNextAdventure();
    });
  }

  quitGame() {
    this.score = 0;
    this.currentLevel = 0;
    this.usedCategories = [];
    this.ui.showScreen("start");
  }
}
