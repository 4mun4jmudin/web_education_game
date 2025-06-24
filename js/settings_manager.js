// File: js/settings_manager.js

class SettingsManager {
  constructor() {
    this.settings = this.loadSettings();
  }

  loadSettings() {
    const defaults = {
      musicMuted: true,
      sfxMuted: false,
      ttsMuted: false,
      difficulty: "easy",
      darkMode: false, // Ditambahkan
    };
    const savedSettings = localStorage.getItem("web-edu-game-settings");
    return savedSettings
      ? { ...defaults, ...JSON.parse(savedSettings) }
      : defaults;
  }

  saveSettings() {
    localStorage.setItem(
      "web-edu-game-settings",
      JSON.stringify(this.settings)
    );
  }

  updateSetting(key, value) {
    if (key in this.settings) {
      this.settings[key] = value;
      this.saveSettings();
      document.dispatchEvent(
        new CustomEvent("settingsChanged", { detail: { key, value } })
      );
    } else {
      console.error(`Pengaturan "${key}" tidak ada.`);
    }
  }
}
