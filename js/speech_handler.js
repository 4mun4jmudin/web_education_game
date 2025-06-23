// js/speech_handler.js

class SpeechHandler {
    constructor() {
        this.synth = window.speechSynthesis;
        this.recognition = null;
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.lang = 'en-US';
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;
        } else {
            console.warn("Speech Recognition API tidak didukung di browser ini.");
        }
    }

    /**
     * Mengucapkan teks menggunakan suara browser (Text-to-Speech).
     * @param {string} text - Teks yang ingin diucapkan.
     * @param {Function} [onEndCallback] - Callback opsional yang dijalankan setelah selesai bicara.
     */
    speak(text, onEndCallback) {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        // Pastikan suara sudah termuat sebelum mencoba bicara
        let voices = this.synth.getVoices();
        if (voices.length === 0) {
            this.synth.onvoiceschanged = () => {
                this.speak(text, onEndCallback);
            };
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        
        utterance.onend = () => {
            if (onEndCallback) {
                onEndCallback();
            }
        };

        this.synth.speak(utterance);
    }

    /**
     * Mulai mendengarkan input suara dari pengguna (Speech-to-Text).
     * @param {Function} onResultCallback - Callback yang dijalankan dengan hasil transkrip.
     * @param {Function} onErrorCallback - Callback yang dijalankan jika ada error.
     */
    listen(onResultCallback, onErrorCallback) {
        if (!this.recognition) {
            if(onErrorCallback) onErrorCallback({ error: "not-supported" });
            return;
        }

        this.recognition.start();

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if(onResultCallback) onResultCallback(transcript);
        };

        this.recognition.onspeechend = () => {
            this.recognition.stop();
        };

        this.recognition.onerror = (event) => {
            if(onErrorCallback) onErrorCallback(event);
        };
    }
}
