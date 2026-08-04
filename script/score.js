class Score {
    static KEY = 'space_invaders_scores';
    static MAX_ENTRIES = 10;

    static getAll() {
        const raw = localStorage.getItem(this.KEY);
        return raw ? JSON.parse(raw) : [];
    }

    static add(level, score, difficulty) {
        const scores = this.getAll();
        scores.push({ level, difficulty, score });
        scores.sort((a, b) => b.score - a.score);
        const top10 = scores.slice(0, this.MAX_ENTRIES);
        localStorage.setItem(this.KEY, JSON.stringify(top10));
    }

    static render() {
        const scores = this.getAll();
        const tableBody = document.querySelector('#score table tbody');
        tableBody.innerHTML = '';
        scores.forEach((score) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${score.level}</td>
                <td>${score.difficulty ?? 'Custom'}</td>
                <td>${score.score}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}