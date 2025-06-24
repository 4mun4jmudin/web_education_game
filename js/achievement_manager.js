// File: js/achievement_manager.js

class AchievementManager {
    constructor() {
        this.achievements = {
            'first_game': { name: "Langkah Pertama", description: "Mainkan game pertamamu hingga selesai." },
            'completed_animals': { name: "Sahabat Satwa", description: "Selesaikan topik Hewan." },
            'completed_fruits': { name: "Pemetik Buah", description: "Selesaikan topik Buah-buahan." },
            'three_stars_any': { name: "Murid Teladan", description: "Raih 3 bintang di topik mana pun." },
            'perfect_score_any': { name: "Jenius Cilik", description: "Dapatkan skor sempurna di topik mana pun." },
            'builder_master': { name: "Arsitek Kata", description: "Selesaikan sebuah sesi dalam mode 'Susun Kalimat'." },
            'speaker_master': { name: "Pemberani", description: "Selesaikan sebuah sesi dalam mode 'Ucapkan Kata'." }
        };

        this.unlocked = this.loadUnlockedAchievements();
    }

    loadUnlockedAchievements() {
        const saved = localStorage.getItem('web-edu-achievements');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    }

    saveUnlockedAchievements() {
        localStorage.setItem('web-edu-achievements', JSON.stringify([...this.unlocked]));
    }

    unlock(achievementId) {
        if (this.achievements[achievementId] && !this.unlocked.has(achievementId)) {
            this.unlocked.add(achievementId);
            this.saveUnlockedAchievements();
            console.log(`Pencapaian Terbuka: ${this.achievements[achievementId].name}`);
            return this.achievements[achievementId];
        }
        return null;
    }

    checkAndUnlock(sessionData) {
        const newlyUnlocked = [];

        let achievement = this.unlock('first_game');
        if (achievement) newlyUnlocked.push(achievement);

        const categoryKey = `completed_${sessionData.category}`;
        if (this.achievements[categoryKey]) {
            achievement = this.unlock(categoryKey);
            if (achievement) newlyUnlocked.push(achievement);
        }

        if (sessionData.stars === 3) {
            achievement = this.unlock('three_stars_any');
            if (achievement) newlyUnlocked.push(achievement);
        }

        if (sessionData.score === sessionData.totalChallenges * 10) {
             achievement = this.unlock('perfect_score_any');
             if(achievement) newlyUnlocked.push(achievement);
        }

        if (sessionData.gameMode === 'SentenceBuilder') {
            achievement = this.unlock('builder_master');
            if (achievement) newlyUnlocked.push(achievement);
        }
        if (sessionData.gameMode === 'SpeakTheWord') {
            achievement = this.unlock('speaker_master');
            if (achievement) newlyUnlocked.push(achievement);
        }

        return newlyUnlocked;
    }
}