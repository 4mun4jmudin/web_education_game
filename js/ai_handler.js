// File: js/ai_handler.js

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
      return "";
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

  async generateStoryChallenge(categoryName, wordList) {
    if (!this.generativeAi) return null;

    const exampleWords = wordList
      .slice(0, 5)
      .map((w) => w.en)
      .join(", ");

    const prompt = `
      You are a creative storyteller for a children's educational game.
      Your task is to create a very short story (2-3 simple sentences) for kids learning English, based on a given topic. You should try to include some words from the example word list. After the story, create one simple multiple-choice comprehension question about the story.

      The output MUST be a valid JSON object with the following structure, and nothing else. Do not add any conversational text before or after the JSON object.
      {
        "story": "A short story in English.",
        "question": "A simple comprehension question in English about the story.",
        "options": ["An array", "of four", "possible answers", "in English"],
        "correctAnswer": "The correct answer string, which must be exactly one of the options."
      }

      Topic: ${categoryName}
      Example words from this topic: ${exampleWords}

      Ensure the story is simple, cheerful, and easy to understand for a 5-8 year old. The question should directly relate to a detail in the story.
    `;

    let textResponse = "";
    try {
      textResponse = await this.generateText(prompt);
      // Membersihkan response dari markdown code block jika ada
      textResponse = textResponse.replace(/```json\n|```/g, "").trim();
      return JSON.parse(textResponse);
    } catch (error) {
      // Log yang lebih detail untuk membantu debugging
      console.error("Gagal membuat atau mem-parsing cerita dari AI.");
      console.error("Respons mentah dari AI (sebelum parsing):", textResponse);
      console.error("Detail error:", error);
      return null;
    }
  }
}
