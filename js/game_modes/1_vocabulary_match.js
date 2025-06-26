// File: js/game_modes/1_vocabulary_match.js (DENGAN PEMBARUAN UNTUK KATEGORI VERBS)

class VocabularyMatchMode {
  constructor(ui, speech) {
    this.ui = ui;
    this.speech = speech;
    this.engine = null;
    this.onSubmit = null;
    this.challengeData = null;

    // Inisialisasi efek suara
    this.soundEffects = {
      correct: this.createAudio("assets/sounds/correct.mp3"),
      wrong: this.createAudio("assets/sounds/wrong.mp3"),
      optionClick: this.createAudio("assets/sounds/pop.mp3"),
    };
  }

  createAudio(src) {
    const audio = new Audio(src);
    audio.volume = 0.6;
    return audio;
  }

  // Fungsi untuk mencoba memuat gambar dengan berbagai variasi nama
  async loadImageWithFallbacks(category, imageId) {
    const basePath = `assets/images/${category}`;
    const extensions = [".jpg", ".jpeg", ".png", ".webp"];
    const variations = this.generateNameVariations(imageId);

    // Coba semua kombinasi variasi nama dan ekstensi
    for (const variation of variations) {
      for (const ext of extensions) {
        const imageUrl = `${basePath}/${variation}${ext}`;
        try {
          const exists = await this.checkImageExists(imageUrl);
          if (exists) {
            return imageUrl;
          }
        } catch (e) {
          console.log(`Image not found: ${imageUrl}`);
        }
      }
    }

    return "assets/images/placeholder.png";
  }

  // Generate semua variasi nama file yang mungkin
  generateNameVariations(name) {
    const variations = new Set();

    variations.add(name);
    variations.add(name.toLowerCase());
    variations.add(name.replace(/\s+/g, "_"));
    variations.add(name.replace(/\s+/g, "-"));
    variations.add(name.toLowerCase().replace(/\s+/g, "_"));
    variations.add(name.toLowerCase().replace(/\s+/g, "-"));
    variations.add(name.replace(/\s+/g, ""));
    variations.add(name.toLowerCase().replace(/\s+/g, ""));

    if (name.includes(" ")) {
      const camelCase = name
        .split(" ")
        .map((word, i) =>
          i === 0
            ? word.toLowerCase()
            : word[0].toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");
      variations.add(camelCase);
    }

    return Array.from(variations);
  }

  // Fungsi untuk memeriksa apakah gambar ada
  checkImageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  async start(
    challengeData,
    onSubmitCallback,
    dynamicInstruction,
    categoryWordList,
    difficulty
  ) {
    this.challengeData = challengeData;
    this.onSubmit = onSubmitCallback;
    const correctAnswer = this.challengeData.en;
    const imageId = this.challengeData.id;
    const categoryName = this.engine.levelData.category;

    let wrongOptionCount = 3;
    if (difficulty === "medium") {
      wrongOptionCount = 2;
    } else if (difficulty === "hard") {
      wrongOptionCount = 1;
    }

    const wrongOptions = categoryWordList
      .filter((w) => w.en !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, wrongOptionCount)
      .map((w) => w.en);

    const options = [...wrongOptions, correctAnswer].sort(
      () => 0.5 - Math.random()
    );

    // [MODIFIKASI INSTRUKSI] Tambahkan penanganan untuk 'verbs'
    const instruction =
      dynamicInstruction ||
      (categoryName === "numbers" || categoryName === "verbs" // Verbs menggunakan instruksi yang sama dengan numbers
        ? "Pilih terjemahan yang benar:"
        : categoryName === "colors"
        ? "Pilih nama warna yang sesuai:"
        : "Pilih gambar yang sesuai.");
    this.ui.drawInstruction(instruction);

    // Khusus untuk kategori numbers
    if (categoryName === "numbers") {
      const challengeHtml = `
        <div class="number-challenge-container">
          <div class="number-display-box">
            <span class="number-display">${this.challengeData.id}</span>
          </div>
        </div>
        <div class="options-grid" style="grid-template-columns: repeat(${
          options.length > 2 ? 2 : options.length
        }, 1fr);">
          ${options
            .map((opt) => `<button class="btn btn-option">${opt}</button>`)
            .join("")}
        </div>
      `;
      this.ui.drawChallenge(challengeHtml);
    }
    // Blok logika khusus untuk kategori 'colors'
    else if (categoryName === "colors") {
      const colorMap = {
        Merah: "#FF0000", Biru: "#0000FF", Hijau: "#008000", Kuning: "#FFFF00", Jingga: "#FFA500",
        Ungu: "#800080", Hitam: "#000000", Putih: "#FFFFFF", "Merah Muda": "#FFC0CB", Cokelat: "#A52A2A",
        "Abu-abu": "#808080", Emas: "#FFD700", Perak: "#C0C0C0", "Merah Tua": "#8B0000", "Biru Muda": "#ADD8E6",
        "Hijau Tua": "#006400", "Biru Langit": "#87CEEB", Krem: "#F5F5DC", Nila: "#4B0082", Pirus: "#40E0D0",
        "Hijau Kebiruan": "#008080", Magenta: "#FF00FF", "Biru Laut": "#000080", "Merah Marun": "#800000",
        Lavender: "#E6E6FA", "Merah Anggur": "#800020", "Merah Koral": "#FF7F50", Salmon: "#FA8072",
        Persik: "#FFE5B4", "Hijau Mint": "#98FF98", Gading: "#FFFFF0", "Kuning Pucat": "#FFFACD",
        "Hijau Zaitun": "#808000", Khaki: "#F0E68C", Perunggu: "#CD7F32", Tembaga: "#B87333",
        "Merah Bata": "#B22222", "Cokelat Tua": "#654321",
      };
      const colorValue = colorMap[this.challengeData.id] || "#CCCCCC";

      const challengeHtml = `
        <div class="color-challenge-container">
          <div class="color-display-box" style="background-color: ${colorValue}">
          </div>
        </div>
        <div class="options-grid" style="grid-template-columns: repeat(${
          options.length > 2 ? 2 : options.length
        }, 1fr);">
          ${options
            .map((opt) => `<button class="btn btn-option">${opt}</button>`)
            .join("")}
        </div>
      `;
      this.ui.drawChallenge(challengeHtml);
    }
    // [START PEMBARUAN] Blok logika khusus untuk kategori 'verbs'
    else if (categoryName === "verbs") {
      // Tampilkan kata kerja Bhs. Indonesia dalam sebuah kotak, bukan gambar.
      // Anda mungkin perlu menambahkan styling untuk .verb-display-box di file CSS Anda
      // agar terlihat seperti kotak/kartu. Contoh:
      // .verb-display-box { background: #fff; border: 1px solid #ddd; border-radius: 8px;
      // padding: 40px 20px; font-size: 2em; text-align: center; }
      const challengeHtml = `
        <div class="verb-challenge-container">
          <div class="verb-display-box">
            <span class="verb-display">${this.challengeData.id}</span>
          </div>
        </div>
        <div class="options-grid" style="grid-template-columns: repeat(${
          options.length > 2 ? 2 : options.length
        }, 1fr);">
          ${options
            .map((opt) => `<button class="btn btn-option">${opt}</button>`)
            .join("")}
        </div>
      `;
      this.ui.drawChallenge(challengeHtml);
    }
    // [END PEMBARUAN]
    // Untuk kategori lainnya (animals, fruits, dll), gunakan logika gambar.
    else {
      const validImageUrl = await this.loadImageWithFallbacks(
        categoryName,
        imageId
      );

      const challengeHtml = `
        <div class="image-challenge-container">
          <img
            src="${validImageUrl}"
            alt="${correctAnswer}"
            class="challenge-image"
            onerror="this.src='assets/images/placeholder.png'"
          >
        </div>
        <div class="options-grid" style="grid-template-columns: repeat(${
          options.length > 2 ? 2 : options.length
        }, 1fr);">
          ${options
            .map((opt) => `<button class="btn btn-option">${opt}</button>`)
            .join("")}
        </div>
      `;
      this.ui.drawChallenge(challengeHtml);
    }

    this.ui.drawUserInput("");

    // Mainkan suara untuk kata yang benar (dalam Bahasa Inggris)
    this.speech.speak(correctAnswer);

    // Tambahkan event listener untuk semua opsi
    document.querySelectorAll(".btn-option").forEach((button) => {
      button.addEventListener("click", (e) => {
        this.soundEffects.optionClick.play();
        this.handleOptionClick(e, correctAnswer);
      });
    });
  }

  handleOptionClick(event, correctAnswer) {
    const selectedAnswer = event.target.textContent;
    const isCorrect = selectedAnswer === correctAnswer;
    const allButtons = document.querySelectorAll(".btn-option");

    allButtons.forEach((btn) => (btn.disabled = true));

    allButtons.forEach((btn) => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct-option");
      } else if (btn === event.target && !isCorrect) {
        btn.classList.add("incorrect-option");
      }
    });

    if (isCorrect) {
      this.soundEffects.correct.play();
      event.target.classList.add("correct-option");
      this.ui.showNotification("✅ Jawaban Benar!", 1500, "correct");
    } else {
      this.soundEffects.wrong.play();
      event.target.classList.add("incorrect-option");
      this.ui.showNotification("❌ Jawaban Salah", 2000, "wrong");
      this.ui.triggerScreenShake();
    }

    setTimeout(
      () => {
        this.onSubmit(isCorrect);
      },
      isCorrect ? 1500 : 2000
    );
  }
}