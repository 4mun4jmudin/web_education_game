// File: js/game_engine.js (Final & Disesuaikan)

class GameEngine {
  constructor(uiManager, speechHandler, aiHandler) {
    this.ui = uiManager;
    this.speech = speechHandler;
    this.ai = aiHandler;
    this.score = 0;
    this.levelData = null;
    this.challenges = [];
    this.currentChallengeIndex = 0;
    this.gameModes = {};
  }

  registerGameMode(name, modeObject) {
    this.gameModes[name] = modeObject;
    modeObject.engine = this;
  }

  startGame(categoryName) {
    this.score = 0;
    this.currentChallengeIndex = 0;

    // Logika Cerdas untuk Memilih Mode Permainan yang Tepat
    let availableModes;

    // Profil 1: Kategori Kalimat
    // Metode: Menyusun kalimat & mendengarkan.
    if (categoryName === "simpleSentences") {
      availableModes = ["SentenceBuilder", "ListenAndType"];
    }
    // Profil 2: Kategori dengan Gambar Jelas (Benda, Hewan, Warna, dll.)
    // Metode: Kombinasi visual (mencocokkan), mendengar, dan berbicara.
    else if (
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
      availableModes = ["VocabularyMatch", "ListenAndType", "SpeakTheWord"];
    }
    // Profil 3: Kategori Abstrak/Aksi (Kata Kerja)
    // Metode: Fokus pada mendengar dan berbicara, karena gambar statis kurang efektif.
    else if (categoryName === "verbs") {
      availableModes = ["ListenAndType", "SpeakTheWord"];
    }
    // Pilihan aman untuk kategori tak terduga di masa depan.
    else {
      availableModes = ["ListenAndType"];
    }

    // Pilih satu mode secara acak dari daftar yang paling sesuai.
    const randomModeName =
      availableModes[Math.floor(Math.random() * availableModes.length)];

    this.levelData = {
      gameMode: randomModeName,
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
    this.challenges = categoryWords.slice(0, this.levelData.challengesCount);
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
    const modeName = this.levelData.gameMode;
    const categoryName = this.levelData.category;
    const mode = this.gameModes[modeName];

    if (mode) {
      const dynamicInstruction = await this.ai.createDynamicInstruction(
        modeName,
        categoryName,
        challengeData
      );
      const categoryWordList = GAME_DATA.categories[categoryName].words;

      mode.start(
        challengeData,
        (isCorrect) => this.submitAnswer(isCorrect),
        dynamicInstruction,
        categoryWordList
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
    setTimeout(() => {
      this.nextChallenge();
    }, 1200);
  }

  completeSession() {
    this.ui.updateProgressBar(this.challenges.length, this.challenges.length);
    this.ui.showLevelCompleteScreen(this.score, () => {
      this.ui.showScreen("start");
    });
  }

  quitGame() {
    this.score = 0;
    this.ui.showScreen("start");
  }
}
