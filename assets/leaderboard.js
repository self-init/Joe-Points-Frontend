const api = new API("http://localhost:3000/api")

const users = [];

function rankUsers() {
    users.sort((a, b) => b.points - a.points);
    users.forEach((item, index) => {
        item.rank = index + 1;
    });
}

function getUserByUid(uid) {
    return users.find(user => user.uid === uid);
}

class User {
    constructor(user) {
        this.uid = user.uid;
        this.first = user.first;
        this.last = user.last;
        this.points = user.points;
        this.rank = 0;
    }

    createLeaderboardElement() {
        this.leaderboardElement = document.createElement('div');
        this.leaderboardElement.className = 'leaderboardEntry';
        this.leaderboardElement.dataset.rank = this.rank;
        this.leaderboardElement.dataset.uid = this.uid;

        return this.leaderboardElement;
    }

    populateLeaderboardElement() {
        this.leaderboardElement.dataset.rank = this.rank;
        this.leaderboardElement.innerHTML = `<div class="leaderboardStat leaderboardRank">${this.rank}</div>
        <div class="leaderboardStat leaderboardName">${this.first} ${this.last}</div>
        <div class="leaderboardStat leaderboardPoints">
            <div class="leaderboardPointsNumber">${this.points}</div>
        </div>`;
    }

    populateLeaderboardElementEditable() {
        this.leaderboardElement.dataset.rank = this.rank;
        this.leaderboardElement.innerHTML = `<div class="leaderboardStat leaderboardRank">${this.rank}</div>
        <div class="leaderboardStat leaderboardName">${this.first} ${this.last}</div>
        <div class="leaderboardStat leaderboardPoints">
            <input type="number" value="${this.points}" id="editPoints" class="leaderboardPointsNumber edit" data-which="points">
            <button class="incButton squareButton", onclick="modifyUser('${this.uid}', 1)">+</button>
            <button class="decButton squareButton", onclick="modifyUser('${this.uid}', -1)">-</button>
        </div>`;

        const editable = this.leaderboardElement.querySelector("#editPoints");
        editable.addEventListener('change', (event) => {
            api.setPoints(this.uid, parseInt(event.target.value));
            this.points = parseInt(event.target.value);
            this.populateLeaderboardElement();
            updateLeaderboard();
        });
    }
}

function buildLeaderboard() {

    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = ""

    const fragment = document.createDocumentFragment();

    rankUsers();

    users.forEach(user => {
        fragment.appendChild(user.createLeaderboardElement());
        user.populateLeaderboardElementEditable();
    })

    leaderboard.appendChild(fragment);
}

function updateLeaderboard() {
    rankUsers();

    users.forEach(users => {
        users.populateLeaderboardElementEditable();
    })

    const leaderboard = document.getElementById('leaderboard');
    const entries = Array.from(leaderboard.children);

    entries.sort((a, b) => {
        const rankA = parseInt(a.dataset.rank);
        const rankB = parseInt(b.dataset.rank);
        return rankA - rankB;
    })

    entries.forEach(entry => {
        leaderboard.appendChild(entry);
    })
}

async function modifyUser(userId, amount) {
    const response = await api.addPoints("", userId, amount);

    try {
        
        if (response.ok) {
            getUserByUid(userId).points += amount;
            updateLeaderboard();
        } else {
            throw new Error(`HTTP error! status ${response.status}`);
        }
    } catch (err) {
        throw err;
    }
}

async function reloadLeaderboard() {
    const response = await api.getAllUsers();

    try {
        if (response.ok) {
            let json = await response.json()
            
            users.length = 0;

            json.forEach(user => {
                users.push(new User(user));
            });

            buildLeaderboard(json);
        } else {
            throw new Error(`HTTP error: ${response.status}`);
        }
    } catch (err) {
        throw err;
    }
}


window.onload = () => {
    reloadLeaderboard();
}