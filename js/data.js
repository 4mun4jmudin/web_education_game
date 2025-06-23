// js/data.js

// Konstanta ini menyimpan semua konten pembelajaran untuk game.
const GAME_DATA = {
    // Kategori Kosakata
    categories: {
        animals: {
            displayName: "Hewan",
            words: [
                { en: "Cat", id: "kucing", img: "assets/images/animals/cat.svg" },
                { en: "Dog", id: "anjing", img: "assets/images/animals/dog.svg" },
                { en: "Bird", id: "burung", img: "assets/images/animals/bird.svg" },
                { en: "Fish", id: "ikan", img: "assets/images/animals/fish.svg" },
                { en: "Duck", id: "bebek", img: "assets/images/animals/duck.svg" },
            ]
        },
        fruits: {
            displayName: "Buah-buahan",
            words: [
                { en: "Apple", id: "apel", img: "assets/images/fruits/apple.svg" },
                { en: "Banana", id: "pisang", img: "assets/images/fruits/banana.svg" },
                { en: "Orange", id: "jeruk", img: "assets/images/fruits/orange.svg" },
                { en: "Grape", id: "anggur", img: "assets/images/fruits/grape.svg" },
                { en: "Strawberry", id: "stroberi", img: "assets/images/fruits/strawberry.svg" },
            ]
        },
        numbers: {
            displayName: "Angka",
            words: [
                { en: "One", id: "satu", display: "1" },
                { en: "Two", id: "dua", display: "2" },
                { en: "Three", id: "tiga", display: "3" },
                { en: "Four", id: "empat", display: "4" },
                { en: "Five", id: "lima", display: "5" },
            ]
        },
        simpleSentences: {
            displayName: "Kalimat Sederhana",
            words: [ // Di sini 'words' sebenarnya adalah 'sentences'
                { en: "I see a cat", id: "kalimat1" },
                { en: "He has a dog", id: "kalimat2" },
                { en: "It is an apple", id: "kalimat3" },
                { en: "She likes banana", id: "kalimat4" },
                { en: "We eat fish", id: "kalimat5" },
            ]
        }
    },

    // Struktur Level untuk Mode Petualangan
    adventureLevels: [
        // Level 1-5: Mencocokkan kosakata
        { level: 1, gameMode: "VocabularyMatch", category: "animals", challenges: 5 },
        { level: 2, gameMode: "VocabularyMatch", category: "fruits", challenges: 5 },
        { level: 3, gameMode: "VocabularyMatch", category: "numbers", challenges: 5 },
        { level: 4, gameMode: "VocabularyMatch", category: "animals", challenges: 7 },
        { level: 5, gameMode: "VocabularyMatch", category: "fruits", challenges: 7 },
        
        // Level 6-10: Memperkenalkan "Dengarkan dan Tulis"
        { level: 6, gameMode: "ListenAndType", category: "animals", challenges: 5 },
        { level: 7, gameMode: "ListenAndType", category: "fruits", challenges: 5 },
        { level: 8, gameMode: "VocabularyMatch", category: "numbers", challenges: 10 },
        { level: 9, gameMode: "ListenAndType", category: "animals", challenges: 7 },
        { level: 10, gameMode: "ListenAndType", category: "fruits", challenges: 7 },

        // Level 11-15: Memperkenalkan "Ucapkan Kata"
        { level: 11, gameMode: "SpeakTheWord", category: "animals", challenges: 5 },
        { level: 12, gameMode: "SpeakTheWord", category: "fruits", challenges: 5 },
        { level: 13, gameMode: "ListenAndType", category: "numbers", challenges: 5},
        { level: 14, gameMode: "SpeakTheWord", category: "animals", challenges: 7 },
        { level: 15, gameMode: "VocabularyMatch", category: "fruits", challenges: 10},

        // Level 16-20: Memperkenalkan "Susun Kalimat" dan Campuran
        { level: 16, gameMode: "SentenceBuilder", category: "simpleSentences", challenges: 3 },
        { level: 17, gameMode: "VocabularyMatch", category: "animals", challenges: 10 },
        { level: 18, gameMode: "SpeakTheWord", category: "fruits", challenges: 7 },
        { level: 19, gameMode: "ListenAndType", category: "animals", challenges: 7 },
        { level: 20, gameMode: "SentenceBuilder", category: "simpleSentences", challenges: 5 },
    ]
};
