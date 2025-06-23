// File: js/main.js (Penyesuaian kecil)

document.addEventListener("DOMContentLoaded", () => {
  const GEMINI_API_KEY = "AIzaSyCxtPxGJg1tsHcd-M61M3wRVibrLtzE2dU";

  const ui = new UIManager();
  const speech = new SpeechHandler();
  const ai = new AIHandler(GEMINI_API_KEY);
  const engine = new GameEngine(ui, speech, ai);

  // ▼▼▼ BARIS INI DIPERBAIKI ▼▼▼
  // Hapus `GAME_DATA` dari parameter saat membuat VocabularyMatchMode.
  engine.registerGameMode(
    "VocabularyMatch",
    new VocabularyMatchMode(ui, speech)
  );
  // ▲▲▲ AKHIR PERBAIKAN ▲▲▲

  engine.registerGameMode("ListenAndType", new ListenAndTypeMode(ui, speech));
  engine.registerGameMode("SpeakTheWord", new SpeakTheWordMode(ui, speech));
  engine.registerGameMode(
    "SentenceBuilder",
    new SentenceBuilderMode(ui, speech)
  );

  function setupCategorySelection() {
    const container = document.getElementById("category-selection-container");
    if (!container) return;

    container.innerHTML = "";

    const categories = GAME_DATA.categories;
    for (const categoryKey in categories) {
      const category = categories[categoryKey];
      const button = document.createElement("button");
      button.textContent = category.displayName;
      button.className = "btn-category";
      button.addEventListener("click", () => {
        engine.startGame(categoryKey);
      });
      container.appendChild(button);
    }
  }

  const quitGameBtn = document.getElementById("quit-game-btn");
  quitGameBtn.addEventListener("click", () => {
    engine.quitGame();
  });

  setupCategorySelection();

  ui.showScreen("start");
});
