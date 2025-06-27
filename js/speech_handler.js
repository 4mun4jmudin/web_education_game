// File: js/speech_handler.js (Final)

class SpeechHandler {
  constructor(settingsManager) {
    this.settings = settingsManager;
    this.synth = window.speechSynthesis;
    this.recognition = null;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.lang = "en-US";
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    } else {
      console.warn("Speech Recognition tidak didukung di browser ini.");
    }
  }

  /**
   * Mengucapkan teks yang diberikan.
   * @param {string} text - Teks yang akan diucapkan.
   */
  speak(text) {
    if (this.settings.settings.ttsMuted) return;

    if (typeof duckMusic === "function" && !settings.settings.musicMuted) {
      duckMusic();
    }

    if (this.synth.speaking) {
      this.synth.cancel();
    }
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = "en-US";

    utterThis.onend = () => {
      if (typeof restoreMusic === "function" && !settings.settings.musicMuted) {
        restoreMusic();
      }
    };

    this.synth.speak(utterThis);
  }

  /**
   * Mengenali ucapan dari mikrofon.
   * @param {function} onResult - Callback saat ada hasil.
   * @param {function} onEnd - Callback saat pengenalan selesai.
   * @param {function} onError - Callback saat terjadi error.
   */
  recognize(onResult, onEnd, onError) {
    if (!this.recognition) {
      if (onError) onError("Not supported");
      return;
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    this.recognition.onspeechend = () => {
      this.recognition.stop();
      if (onEnd) onEnd();
    };

    this.recognition.onerror = (event) => {
      if (onError) onError(event.error);
    };

    this.recognition.onnomatch = (event) => {
      if (onError) onError("No match");
    };

    this.recognition.start();
  }
}
