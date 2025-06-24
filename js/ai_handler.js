// File: js/ai_handler.js (Final & Robust)

class AIHandler {
  constructor(apiKey) {
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

  async generateText(prompt) {
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
      return "";
    }
  }

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
    return instruction || "";
  }

  async getCorrectiveFeedback(mode, correctAnswer, userAnswer) {
    if (!this.generativeAi || !userAnswer) {
      return "";
    }
    const modeDescription = {
      ListenAndType: "mengetik kata yang didengar",
      SentenceBuilder: "menyusun kalimat",
    };

    if (!(mode in modeDescription)) {
      return ""; // Mode tidak didukung
    }

    const prompt = `
      Anda adalah asisten game edukasi untuk anak-anak.
      Seorang anak sedang bermain game ${modeDescription[mode]}.
      Jawaban yang benar adalah: "${correctAnswer}"
      Jawaban anak itu: "${userAnswer}"
      
      Tugas Anda: Berikan satu kalimat umpan balik yang sangat singkat, positif, dan membantu dalam Bahasa Indonesia. Fokus pada kesalahan spesifik anak itu (salah ketik atau urutan kata) tanpa membuat mereka berkecil hati. Jangan gunakan tanda kutip dalam jawaban Anda.
      
      Contoh (salah ketik): Hampir benar! Ingat ya, 'Apple' itu pakai dua huruf 'p'.
      Contoh (urutan kata): Sudah bagus! Coba tukar posisi kata 'car' dan 'red'.
    `;

    try {
      const feedback = await this.generateText(prompt);
      return feedback.replace(/["*]/g, "").trim();
    } catch (error) {
      console.error("Error mendapatkan umpan balik korektif:", error);
      return "";
    }
  }
}
