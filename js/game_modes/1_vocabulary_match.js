// File: js/game_modes/1_vocabulary_match.js (DENGAN FEEDBACK SUARA)

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

  // Fungsi baru untuk mencoba memuat gambar dengan berbagai variasi nama
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
            return imageUrl; // Kembalikan URL yang valid
          }
        } catch (e) {
          console.log(`Image not found: ${imageUrl}`);
        }
      }
    }

    // Jika tidak ditemukan, kembalikan placeholder
    return "assets/images/placeholder.png";
  }

  // Generate semua variasi nama file yang mungkin
  generateNameVariations(name) {
    const variations = new Set();

    // Tambahkan versi original
    variations.add(name);

    // Tambahkan versi lowercase
    variations.add(name.toLowerCase());

    // Tambahkan versi dengan underscore dan dash
    variations.add(name.replace(/\s+/g, "_"));
    variations.add(name.replace(/\s+/g, "-"));
    variations.add(name.toLowerCase().replace(/\s+/g, "_"));
    variations.add(name.toLowerCase().replace(/\s+/g, "-"));

    // Tambahkan versi tanpa spasi
    variations.add(name.replace(/\s+/g, ""));
    variations.add(name.toLowerCase().replace(/\s+/g, ""));

    // Tambahkan versi dengan camelCase jika ada spasi
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

    const instruction = dynamicInstruction || `Pilih gambar yang sesuai.`;
    this.ui.drawInstruction(instruction);

    // Dapatkan URL gambar yang valid
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
    this.ui.drawUserInput("");

    // Mainkan suara untuk kata yang benar
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
