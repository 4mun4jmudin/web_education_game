// File: js/ai_handler.js (Final & Robust)

class AIHandler {
  constructor(apiKey) {
    // Periksa apakah class GoogleGenerativeAI ada SEBELUM digunakan.
    // Ini adalah pertahanan utama melawan error jika SDK gagal dimuat.
    if (typeof GoogleGenerativeAI === "undefined") {
      console.warn(
        "SDK Google AI tidak berhasil dimuat. Fitur AI akan dinonaktifkan."
      );
      this.generativeAi = null;
      return;
    }

    if (!apiKey) {
      console.warn(
        "API Key untuk AI tidak ditemukan. Fitur AI akan dinonaktifkan."
      );
      this.generativeAi = null;
      return;
    }

    // Menggunakan try-catch sebagai lapisan keamanan tambahan
    try {
      this.generativeAi = new GoogleGenerativeAI(apiKey);
    } catch (e) {
      console.error(
        "Gagal menginisialisasi GoogleGenerativeAI. Pastikan API Key valid.",
        e
      );
      this.generativeAi = null;
    }
  }

  /**
   * Mengirim prompt ke model Gemini dan mengembalikan respons teks.
   * @param {string} prompt - Pertanyaan atau instruksi untuk AI.
   * @returns {Promise<string>} - Jawaban dari AI atau string kosong jika gagal.
   */
  async generateText(prompt) {
    // Jika AI tidak berhasil diinisialisasi, langsung kembalikan string kosong.
    // Ini mencegah error dan membuat game tetap berjalan.
    if (!this.generativeAi) {
      return "";
    }

    try {
      const model = this.generativeAi.getGenerativeModel({
        model: "gemini-pro",
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error saat memanggil AI:", error);
      return ""; // Kembalikan string kosong jika terjadi error
    }
  }

  /**
   * Membuat instruksi permainan yang lebih menarik secara dinamis.
   * @param {string} mode - Mode permainan saat ini (misal: 'VocabularyMatch').
   * @param {string} category - Kategori kata (misal: 'Hewan').
   * @param {object} challengeData - Data tantangan (misal: { en: 'Cat', id: 'kucing' }).
   * @returns {Promise<string>} - Instruksi yang dihasilkan AI.
   */
  async createDynamicInstruction(mode, category, challengeData) {
    let prompt;
    const word = challengeData.en;

    switch (mode) {
      case "VocabularyMatch":
        prompt = `Buat satu kalimat instruksi yang sangat singkat dan ceria untuk anak-anak, meminta mereka menemukan gambar "${word}" di antara pilihan lain. Kategori: ${category}.`;
        break;
      case "ListenAndType":
        prompt = `Buat satu kalimat penyemangat singkat untuk anak-anak sebelum mereka mengetik kata "${word}" yang mereka dengar.`;
        break;
      case "SpeakTheWord":
        prompt = `Buat satu kalimat motivasi singkat untuk anak-anak agar berani mengucapkan kata "${word}".`;
        break;
      default:
        return "";
    }

    const instruction = await this.generateText(prompt);
    // Jika AI gagal atau mengembalikan string kosong, berikan string kosong lagi
    // agar game mode bisa menggunakan instruksi default mereka.
    return instruction || "";
  }
}
