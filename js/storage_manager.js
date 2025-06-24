// File: js/storage_manager.js

class StorageManager {
  constructor(prefix = "web-edu-game-") {
    this.prefix = prefix;
  }

  getProgressKey(category) {
    return `${this.prefix}progress-${category}`;
  }

  saveProgress(category, score, stars) {
    const key = this.getProgressKey(category);
    const currentProgress = this.getProgress(category);

    // Hanya simpan jika skor baru lebih tinggi
    if (score > currentProgress.score) {
      const newProgress = { score, stars };
      localStorage.setItem(key, JSON.stringify(newProgress));
      console.log(`Progres baru untuk ${category}:`, newProgress);
    }
  }

  getProgress(category) {
    const key = this.getProgressKey(category);
    const savedProgress = localStorage.getItem(key);
    // Kembalikan objek progres atau default jika tidak ada
    return savedProgress ? JSON.parse(savedProgress) : { score: 0, stars: 0 };
  }

  getAllProgress() {
    const allProgress = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix + "progress-")) {
        const category = key.replace(this.prefix + "progress-", "");
        allProgress[category] = JSON.parse(localStorage.getItem(key));
      }
    }
    return allProgress;
  }
}
