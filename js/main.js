// File: js/main.js

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================
  // ▼▼▼ SIMPAN API KEY ANDA DI SINI ▼▼▼
  // ==========================================================
  const GEMINI_API_KEY = "AIzaSyCxtPxGJg1tsHcd-M61M3wRVibrLtzE2dU";
  // ==========================================================

  // 1. Inisialisasi semua modul utama
  const ui = new UIManager();
  const speech = new SpeechHandler();
  const ai = new AIHandler(GEMINI_API_KEY); // Inisialisasi AI Handler
  const engine = new GameEngine(ui, speech, ai); // Berikan ai ke engine

  // 2. Daftarkan semua mode permainan
  engine.registerGameMode(
    "VocabularyMatch",
    new VocabularyMatchMode(ui, speech, GAME_DATA)
  );
  engine.registerGameMode("ListenAndType", new ListenAndTypeMode(ui, speech));
  engine.registerGameMode("SpeakTheWord", new SpeakTheWordMode(ui, speech));
  engine.registerGameMode(
    "SentenceBuilder",
    new SentenceBuilderMode(ui, speech)
  );

  // 3. Siapkan event listener
  const startGameBtn = document.getElementById("start-game-btn");
  startGameBtn.addEventListener("click", () => {
    engine.startNextAdventure();
  });

  const quitGameBtn = document.getElementById("quit-game-btn");
  quitGameBtn.addEventListener("click", () => {
    engine.quitGame();
  });

  // 4. Tampilkan layar awal
  ui.showScreen("start");
});
