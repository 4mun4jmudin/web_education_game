// File: js/game_modes/4_sentence_builder.js (Final)

class SentenceBuilderMode {
    constructor(ui, speech) {
        this.ui = ui;
        this.speech = speech;
        this.engine = null;
        this.onSubmit = null;
        this.challengeData = null;
        this.currentAnswer = [];
        this.wordElements = [];
    }

    start(challengeData, onSubmitCallback, dynamicInstruction) {
        this.challengeData = challengeData;
        this.onSubmit = onSubmitCallback;
        this.currentAnswer = [];
        this.wordElements = [];
        const correctAnswer = this.challengeData.en;
        
        const words = correctAnswer.split(' ');
        const shuffledWords = [...words].sort(() => 0.5 - Math.random());

        const instruction = dynamicInstruction || "Susun kata-kata ini menjadi kalimat yang benar.";
        this.ui.drawInstruction(instruction);

        const challengeHtml = `
            <div id="answer-area" class="sentence-answer-area" data-placeholder="Kalimat akan muncul di sini..."></div>
            <div id="word-bank" class="sentence-word-bank">
                ${shuffledWords.map((word, index) => {
                    const el = `<button class="btn-word-bank" data-word="${word}">${word}</button>`;
                    this.wordElements.push({word: word, element: el, used: false});
                    return el;
                }).join('')}
            </div>
        `;
        this.ui.drawChallenge(challengeHtml);

        const userInputHtml = `
            <button id="reset-sentence-btn" class="btn-secondary">Ulangi</button>
            <button id="submit-sentence-btn" class="btn-primary">Periksa</button>
        `;
        this.ui.drawUserInput(userInputHtml);
        
        this.addEventListeners();
        this.updateAnswerArea();
    }

    addEventListeners() {
        document.querySelectorAll('.btn-word-bank').forEach(button => {
            button.addEventListener('click', (e) => this.moveWordToAnswer(e));
        });
        document.getElementById('submit-sentence-btn').addEventListener('click', () => this.checkSentence());
        document.getElementById('reset-sentence-btn').addEventListener('click', () => this.resetSentence());
    }

    moveWordToAnswer(event) {
        const button = event.target;
        this.currentAnswer.push(button.dataset.word);
        button.style.visibility = 'hidden';
        this.updateAnswerArea();
    }

    resetSentence() {
        this.currentAnswer = [];
        document.querySelectorAll('.btn-word-bank').forEach(button => {
            button.style.visibility = 'visible';
        });
        this.updateAnswerArea();
    }

    updateAnswerArea() {
        const answerArea = document.getElementById('answer-area');
        if (this.currentAnswer.length === 0) {
            answerArea.textContent = answerArea.dataset.placeholder;
            answerArea.classList.add('placeholder');
        } else {
            answerArea.textContent = this.currentAnswer.join(' ');
            answerArea.classList.remove('placeholder');
        }
    }

    checkSentence() {
        const userAnswer = this.currentAnswer.join(' ');
        const correctAnswer = this.challengeData.en;
        const isCorrect = userAnswer === correctAnswer;
        
        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
        this.onSubmit(isCorrect);
    }
}