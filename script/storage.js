class Storage {
    static KEY = 'space_invaders_scores';
    static MAX_ENTRIES = 10;

    static getAll(key = null) {
        const raw = localStorage.getItem(this.KEY);
        const defaultValue = { scores: [], difficulties: [] };

        if (!raw) {
            return key ? (defaultValue[key] ?? null) : defaultValue;
        }

        try {
            const parsed = JSON.parse(raw);
            // S'assure que si le JSON parsé n'est pas un objet correct, on garde les fallback
            const data = {
                scores: Array.isArray(parsed?.scores) ? parsed.scores : [],
                difficulties: (typeof parsed?.difficulties === 'object' && parsed?.difficulties !== null) ? parsed.difficulties : {}
            };

            // 3. Si un paramètre 'key' est fourni ('scores' ou 'difficulties'), renvoie juste cette valeur
            if (key) {
                return data[key] ?? null;
            }

            return data;
        } catch (e) {
            console.error("Erreur de lecture du localStorage :", e);
            return defaultValue;
        }
    }

    static addScore(level, score, difficulty) {
        let storage = this.getAll();
        let scores = storage.scores ? storage.scores : [];
        scores.push({ level, difficulty, score });
        scores.sort((a, b) => b.score - a.score);
        const top10 = scores.slice(0, this.MAX_ENTRIES);
        storage.scores = top10;
        localStorage.setItem(this.KEY, JSON.stringify(storage));
    }

    static addDifficulty(difficultyParameters) {
        let storage = this.getAll();
        let difficulties = storage.difficulties;
        const difficultyName = `custom-${difficulties.length}`;
        let newDifficulty = {
            'name': difficultyName,
            'maxDownEnemiesGo': (!difficultyParameters.maxDownEnemiesGo || isNaN(difficultyParameters.maxDownEnemiesGo)) ? 0 : difficultyParameters.maxDownEnemiesGo,
            'scoreMultiplicator': difficultyParameters.scoreMultiplicator ?? 1,
            'step': difficultyParameters.step ?? 20,
            'stepDown': difficultyParameters.stepDown ?? 20,
            'currentDelay': difficultyParameters.currentDelay ?? 800,
            'laserMaxCharge': difficultyParameters.laserMaxCharge ?? 4,
            'shootCooldown': difficultyParameters.shootCooldown ?? 300,
            'enemyShootingSameTme': difficultyParameters.enemyShootingSameTme ?? 1,
            'minDelay': difficultyParameters.minDelay ?? 500,
            'maxDelay': difficultyParameters.maxDelay ?? 1500,
        }

        storage.difficulties.push(newDifficulty);
        localStorage.setItem(this.KEY, JSON.stringify(storage));

        return difficultyName;
    }

    static renderScore() {
        const storage = this.getAll();
        const scores = storage.scores;
        const tableBody = document.querySelector('#score table tbody');
        tableBody.innerHTML = '';
        if(scores.length > 0){
            scores.forEach((score) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${score.level}</td>
                    <td>${score.difficulty ?? 'Custom'}</td>
                    <td>${score.score}</td>
                `;
                tableBody.appendChild(row);
            });
        }else{
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan=3 style='text-align: center'>Aucun record pour le moment</td>
            `;
            tableBody.appendChild(row);
        }
            
    }

    static renderDifficulties() {
        const storage = this.getAll();
        const difficulties = storage.difficulties;
        if(difficulties.length > 0){
            difficulties.forEach((difficulty) => {
                localDifficultiesContainer.innerHTML += `<button class='saved-difficulties' value='${difficulty.name}'>${difficulty.name}</button>`;
            });

            document.querySelector('#saved-difficulties-list').addEventListener('click', (event) => {
                if (event.target.classList.contains('saved-difficulties')) {
                    const name = event.target.value;
                    applyDifficultyToForm(name);
                }
            });
        }

    }
}