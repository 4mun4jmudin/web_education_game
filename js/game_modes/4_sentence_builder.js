// js/game_modes/4_sentence_builder.js

class SentenceBuilderMode {
    constructor(ui) {
        this.ui = ui;
        this.playerAnswer = [];
        this.wordBank = [];
    }

    start(challengeData, onSubmitCallback) {
        this.playerAnswer = [];
        const correctSentence = challengeData.en;
        this.wordBank = correctSentence.split(' ').sort(() => 0.5 - Math.random());

        const html = `
            <div id="instruction-text" class="instruction">Susun kata-kata berikut menjadi kalimat yang benar:</div>
            <div id="game-content">
                <div id="answer-area" class="answer-area">
                    <!-- Kata yang dipilih pemain akan muncul di sini -->
                </div>
                <div id="word-bank-area" class="word-bank-area">
                    <!-- Pilihan kata yang diacak akan muncul di sini -->
                </div>
                <button id="check-sentence-btn" class="btn-primary">Periksa</button>
            </div>
        `;
        this.ui.drawChallenge(html);
        this.drawWords();

        const checkButton = document.getElementById('check-sentence-btn');
        checkButton.addEventListener('click', () => {
            const isCorrect = this.playerAnswer.join(' ') === correctSentence;
            
            checkButton.disabled = true;
            document.getElementById('word-bank-area').innerHTML = ''; // Sembunyikan pilihan kata

            const answerArea = document.getElementById('answer-area');
            answerArea.classList.add(isCorrect ? 'correct' : 'incorrect');

            onSubmitCallback(isCorrect);
        });
    }

    drawWords() {
        const answerArea = document.getElementById('answer-area');
        const wordBankArea = document.getElementById('word-bank-area');

        answerArea.innerHTML = '';
        wordBankArea.innerHTML = '';

        // Tampilkan kata di area jawaban pemain
        this.playerAnswer.forEach((word, index) => {
            const wordEl = document.createElement('button');
            wordEl.className = 'word-tag answer';
            wordEl.textContent = word;
            wordEl.onclick = () => this.returnWord(word, index);
            answerArea.appendChild(wordEl);
        });
         // Tambahkan placeholder jika area jawaban kosong
        if (this.playerAnswer.length === 0) {
            answerArea.innerHTML = `<span class="placeholder-text">Susun kata di sini</span>`;
        }

        // Tampilkan kata di bank kata
        this.wordBank.forEach((word, index) => {
            const wordEl = document.createElement('button');
            wordEl.className = 'word-tag choice';
            wordEl.textContent = word;
            wordEl.onclick = () => this.selectWord(word, index);
            wordBankArea.appendChild(wordEl);
        });
    }

    selectWord(word, index) {
        this.playerAnswer.push(word);
        this.wordBank.splice(index, 1);
        this.drawWords();
    }

    returnWord(word, index) {
        this.wordBank.push(word);
        this.playerAnswer.splice(index, 1);
        this.drawWords();
    }
}
