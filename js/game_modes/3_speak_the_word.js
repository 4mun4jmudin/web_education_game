// File: js/game_modes/3_speak_the_word.js (IMPROVED)

class SpeakTheWordMode {
    constructor(ui, speech) {
      this.ui = ui;
      this.speech = speech;
      this.engine = null;
      this.onSubmit = null;
      this.challengeData = null;
      this.isRecognizing = false;
    }
  
    start(challengeData, onSubmitCallback, dynamicInstruction) {
      this.challengeData = challengeData;
      this.onSubmit = onSubmitCallback;
      const wordToSpeak = this.challengeData.en;
  
      if (!this.speech.recognition) {
        this.ui.drawInstruction("Maaf, browsermu tidak mendukung mode permainan ini.");
        this.ui.drawChallenge("<p>Coba gunakan browser Google Chrome versi terbaru.</p>");
        setTimeout(() => this.onSubmit(false, "UNSUPPORTED"), 3000);
        return;
      }
  
      const instruction = dynamicInstruction || `Klik mikrofon dan ucapkan kata berikut:`;
      this.ui.drawInstruction(instruction);
  
      const challengeHtml = `
        <div class="speak-word-container">
          <div class="word-to-speak">${wordToSpeak}</div>
          <div class="pronunciation-hint">
            <small>Pelafalan: <em>${this.getPronunciationHint(wordToSpeak)}</em></small>
          </div>
        </div>
      `;
  
      const userInputHtml = `
        <div class="speak-word-container">
          <button id="mic-btn" class="btn btn-icon btn-mic">
            <span class="mic-icon">🎤</span>
            <span class="pulse-ring"></span>
          </button>
          <div id="recognition-feedback">
            <p id="recognition-status">Klik mikrofon untuk mulai</p>
            <div id="recognition-visualizer"></div>
          </div>
        </div>
      `;
  
      this.ui.drawChallenge(challengeHtml);
      this.ui.drawUserInput(userInputHtml);
  
      const micBtn = document.getElementById('mic-btn');
      const statusEl = document.getElementById('recognition-status');
      const visualizer = document.getElementById('recognition-visualizer');
  
      micBtn.addEventListener('click', () => {
        if (this.isRecognizing) {
          this.speech.recognition.stop();
          return;
        }
  
        this.startRecognition(micBtn, statusEl, visualizer, wordToSpeak);
      });
    }
  
    getPronunciationHint(word) {
      // Simple pronunciation hints for common words
      const hints = {
        "apple": "ap-el",
        "banana": "ba-na-na",
        "cat": "ket",
        "dog": "dog",
        "elephant": "el-e-fant"
      };
      return hints[word.toLowerCase()] || word;
    }
  
    startRecognition(micBtn, statusEl, visualizer, correctWord) {
      this.isRecognizing = true;
      micBtn.classList.add('active');
      statusEl.textContent = "Mendengarkan...";
      visualizer.innerHTML = '<div class="sound-wave"></div>';
  
      this.speech.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        const isCorrect = transcript.toLowerCase() === correctWord.toLowerCase();
        
        // Visual feedback
        statusEl.innerHTML = `Kamu mengucapkan: <strong>"${transcript}"</strong>`;
        visualizer.innerHTML = isCorrect 
          ? '<div class="feedback-correct">✓</div>' 
          : '<div class="feedback-wrong">✗</div>';
        
        micBtn.classList.remove('active');
        this.isRecognizing = false;
        
        // Play feedback sound
        const sound = new Audio(isCorrect 
          ? 'assets/sounds/correct.mp3' 
          : 'assets/sounds/wrong.mp3');
        sound.volume = 0.5;
        sound.play();
  
        // Submit after short delay
        setTimeout(() => {
          this.onSubmit(isCorrect, transcript);
        }, isCorrect ? 1000 : 2000);
      };
  
      this.speech.recognition.onerror = (event) => {
        this.handleRecognitionError(event.error, micBtn, statusEl, visualizer);
      };
  
      this.speech.recognition.onend = () => {
        if (!this.isRecognizing) return;
        this.isRecognizing = false;
        micBtn.classList.remove('active');
        visualizer.innerHTML = '';
        statusEl.textContent = "Waktu habis, klik lagi untuk mencoba";
      };
  
      this.speech.recognition.start();
    }
  
    handleRecognitionError(error, micBtn, statusEl, visualizer) {
      this.isRecognizing = false;
      micBtn.classList.remove('active');
      visualizer.innerHTML = '';
  
      switch(error) {
        case 'no-speech':
          statusEl.textContent = "Tidak terdeteksi suara. Coba lagi ya!";
          break;
        case 'audio-capture':
          statusEl.textContent = "Mikrofon tidak terdeteksi";
          break;
        case 'not-allowed':
          statusEl.textContent = "Izinkan akses mikrofon di pengaturan browser";
          break;
        default:
          statusEl.textContent = "Error: " + error;
      }
    }
  }