// változók definiálása
let board = document.getElementById("gameboard");
let movesDisplay = document.getElementById("moves");
let timerDisplay = document.getElementById("timer");
let elapsedTime = 0;
let moves = 0;
let intervalId;



// játéktábla elkészítése mintákkal
const gameBoard = {
    rows: 5,
    columns: 5,
    board: [],  //először üres tömbként jön létre
    patterns: [ //minták
        {
            name: "Minta 1",
            pattern: [
                [1, 1, 0, 1, 1],
                [1, 0, 1, 0, 1],
                [0, 1, 1, 1, 0],
                [1, 0, 1, 0, 1],
                [1, 1, 0, 1, 1]
            ]
        },

        {
            name: "Minta 2",
            pattern: [
                [0, 1, 0, 1, 0],
                [1, 1, 0, 1, 1],
                [0, 1, 0, 1, 0],
                [1, 0, 1, 0, 1],
                [1, 0, 1, 0, 1]
            ]
        },

        {
            name: "Minta 3",
            pattern: [
                [1, 0, 0, 0, 1],
                [1, 1, 0, 1, 1],
                [0, 0, 1, 0, 0],
                [1, 0, 1, 0, 0],
                [1, 0, 1, 1, 0]
            ]
        },

        {
            name: "Minta 4",
            pattern: [
                [1, 1, 0, 1, 1],
                [0, 0, 0, 0, 0],
                [1, 1, 0, 1, 1],
                [0, 0, 0, 0, 1],
                [1, 1, 0, 0, 0]
            ]
        },

        {
            name: "Minta 5",
            pattern: [
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1]
            ]
        },

        {
            name: "Minta 6",
            pattern: [
                [0, 0, 0, 1, 1],
                [0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0],
                [1, 1, 0, 0, 0],
                [1, 1, 0, 0, 0]
            ]
        },

        {
            name: "Minta 7",
            pattern: [
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [1, 1, 1, 1, 1],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0]
            ]
        },

        {
            name: "Minta 8",
            pattern: [
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 1, 1, 1, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0]
            ]
        },

        {
            name: "Minta 9",
            pattern: [
                [1, 1, 0, 1, 1],
                [1, 1, 0, 1, 1],
                [0, 0, 0, 0, 0],
                [1, 1, 0, 1, 1],
                [1, 1, 0, 1, 1]
            ]
        },

        {
            name: "Minta 10",
            pattern: [
                [1, 1, 1, 1, 1],
                [0, 1, 1, 1, 0],
                [0, 0, 1, 0, 0],
                [0, 1, 1, 1, 0],
                [1, 1, 1, 1, 1]
            ]
        },

    ],



    // Játéktábla előkészítése
    initialize: function () {
        //véletlen minta kiválasztása
        const pattern = this.patterns[Math.floor(Math.random() * this.patterns.length)];
        // üres tömbbel inic., hogy később feltöltsük a minta értékeivel
        this.board = [];
        for (let i = 0; i < this.rows; i++) {
            //minden sorhoz üres tömböt rendelünk
            this.board[i] = [];
            for (let j = 0; j < this.columns; j++) {
                //rowIndex és colIndex segítségével feltöltjük a tábla elemeit a mintával
                const rowIndex = i % pattern.pattern.length;
                const colIndex = j % pattern.pattern[0].length;
                this.board[i][j] = pattern.pattern[rowIndex][colIndex];
            }
        }
    },

    // Játéktábla megjelenítése
    draw: function () {
        let html = "";
        const board = document.getElementById("gameboard");
        //ellenőrizzük, hogy minden cellának van értéke
        for (let i = 0; i < this.rows; i++) {
            const row = this.board[i];
            //ha van, akkor új row div elem megfel. értékkel
            if (row.some((value) => value !== "")) {
                html += "<div class='row'>";
                for (let j = 0; j < this.columns; j++) {
                    let value = row[j];
                    // ha üres a cella akkor is látható legyen
                    if (value === "") {
                        value = "&nbsp;";
                    }
                    //páros és ptl cellák meghat.
                    let classes = `cell ${(i % 2 === 0) ? "even" : "odd"} ${(j % 2 === 0) ? "even" : "odd"}`;
                    // 1-es értékű cellák megkapják a has-one osztályt szürke cellaszínért
                    if (value === 1) {
                        classes += " has-one";
                        html += `<div class='${classes}' data-row='${i}' data-col='${j}'>${value}</div>`;
                    } else {
                        html += `<div class='${classes}' data-row='${i}' data-col='${j}'>${value}</div>`;
                    }
                }
                html += "</div>";
            }
        }
        //tartalom megjel.
        board.innerHTML = html;

        //háttérszín hozzáadása amikor az egeret a cellára visszük
        let cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
                cell.addEventListener("mouseenter", function() {
                    // jelenlegi cella
                    cell.classList.add("highlight");
                    // felső szomszéd
                    //ell., hogy a kivál. cella nem az 1. sorban van -> lehet felső szomszédja
                    if (cell.dataset.row > 0) {
                        let topCell = document.querySelector(`[data-row="${parseInt(cell.dataset.row) - 1}"][data-col="${cell.dataset.col}"]`);
                        topCell.classList.add("highlight");
                    }
                    // alsó szomszéd
                    //ell., hogy a kivál. cella nem az utolsó sorban van -> lehet alsó szomszédja
                    if (cell.dataset.row < gameBoard.rows - 1) {
                        let bottomCell = document.querySelector(`[data-row="${parseInt(cell.dataset.row) + 1}"][data-col="${cell.dataset.col}"]`);
                        bottomCell.classList.add("highlight");
                    }
                    // bal oldali szomszéd
                    //ell., hogy a kivál. cella oszlopszáma > 0 -> lehet bal oldali szomszédja
                    if (cell.dataset.col > 0) {
                        let leftCell = document.querySelector(`[data-row="${cell.dataset.row}"][data-col="${parseInt(cell.dataset.col) - 1}"]`);
                        leftCell.classList.add("highlight");
                    }
                    // jobb oldali szomszéd
                    //ell., hogy a kivál. cella oszlopszáma < tábla oszlopszáma -1 -> lehet jobb oldali szomszédja
                    if (cell.dataset.col < gameBoard.columns - 1) {
                        let rightCell = document.querySelector(`[data-row="${cell.dataset.row}"][data-col="${parseInt(cell.dataset.col) + 1}"]`);
                        rightCell.classList.add("highlight");
                    }
                });
                //háttérszín eltűnése amikor az egeret a celláról elvisszük
                cell.addEventListener("mouseleave", function() {
                    // jelenlegi cella
                    cell.classList.remove("highlight");
                    // felső szomszéd
                    //ell., hogy a kivál. cella nem az 1. sorban van -> lehet felső szomszédja
                    if (cell.dataset.row > 0) {
                        let topCell = document.querySelector(`[data-row="${parseInt(cell.dataset.row) - 1}"][data-col="${cell.dataset.col}"]`);
                        topCell.classList.remove("highlight");
                    }
                    // alsó szomszéd
                    //ell., hogy a kivál. cella nem az utolsó sorban van -> lehet alsó szomszédja
                    if (cell.dataset.row < gameBoard.rows - 1) {
                        let bottomCell = document.querySelector(`[data-row="${parseInt(cell.dataset.row) + 1}"][data-col="${cell.dataset.col}"]`);
                        bottomCell.classList.remove("highlight");
                    }
                    // bal oldali szomszéd
                    //ell., hogy a kivál. cella oszlopszáma > 0 -> lehet bal oldali szomszédja
                    if (cell.dataset.col > 0) {
                        let leftCell = document.querySelector(`[data-row="${cell.dataset.row}"][data-col="${parseInt(cell.dataset.col) - 1}"]`);
                        leftCell.classList.remove("highlight");
                    }
                    // jobb oldali szomszéd
                    //ell., hogy a kivál. cella oszlopszáma < tábla oszlopszáma -1 -> lehet jobb oldali szomszédja
                    if (cell.dataset.col < gameBoard.columns - 1) {
                        let rightCell = document.querySelector(`[data-row="${cell.dataset.row}"][data-col="${parseInt(cell.dataset.col) + 1}"]`);
                        rightCell.classList.remove("highlight");
                    }
                });
        });
    },


    // Játékot megnyertük-e
    //végigmegyünk az összes cellán, ha nincs 1-es érték egyik mezőben sem, akkor true
    isWon: function () {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (this.board[i][j] === 1) {
                    return false;
                }
            }
        }

        return true;
    },


    // cellák és szomszédos értékek frissítése kattintáskor
    updateCells: function (row, col) {
        let value = this.board[row][col];
        //animáció
        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add("grow");

        // kattintott cella frissítése
        if (value === 0) {
            this.board[row][col] = 1;
        } else {
            this.board[row][col] = 0;
        }

        // szomszédos cella frissítése
        //van felső szomszéd
        //ell., hogy a kivál. cella nem az 1. sorban van -> lehet felső szomszédja
        if (row > 0) {
            this.board[row - 1][col] = 1 - this.board[row - 1][col];
        }
        // alsó szomszéd
        //ell., hogy a kivál. cella nem az utolsó sorban van -> lehet alsó szomszédja
        if (row < this.rows - 1) {
            this.board[row + 1][col] = 1 - this.board[row + 1][col];
        }
        // bal oldali szomszéd
        //ell., hogy a kivál. cella oszlopszáma > 0 -> lehet bal oldali szomszédja
        if (col > 0) {
            this.board[row][col - 1] = 1 - this.board[row][col - 1];
        }
        // jobb oldali szomszéd
        //ell., hogy a kivál. cella oszlopszáma < tábla oszlopszáma -1 -> lehet jobb oldali szomszédja
        if (col < this.columns - 1) {
            this.board[row][col + 1] = 1 - this.board[row][col + 1];
        }
    },



};

//Új játék gomb inic.
let newGameButton = document.getElementById("new-game-button");
//eseménykezelő
newGameButton.addEventListener("click", function() {
    //új tábla generálása és rajzolása
    gameBoard.initialize();
    gameBoard.draw();
    elapsedTime = 0;
    moves = 0;
    movesDisplay.innerHTML = moves;
    timerDisplay.innerHTML = elapsedTime;
    //eltelt idő megjel.
    clearInterval(intervalId);
    intervalId = setInterval(function() {
        elapsedTime++;
        timerDisplay.innerHTML = elapsedTime;
    }, 1000);
});

// audio elemek hozzáadása
let clickAudio = new Audio("vineboom.mp3");
let winAudio = new Audio("yippee.mp3");


//játék újrakezdése funkció
function playAgain() {
    // Generate a new game
    gameBoard.initialize();
    gameBoard.draw();
    // Reset moves and elapsed time
    moves = 0;
    elapsedTime = 0;
    // Update displayed data
    movesDisplay.innerHTML = moves;
    timerDisplay.innerHTML = elapsedTime;
    // Restart timer
    clearInterval(intervalId);
    intervalId = setInterval(function() {
        elapsedTime++;
        timerDisplay.innerHTML = elapsedTime;
    }, 1000);

}

// Játékos nevének és pontszámának mentése localStorage-ba
function saveScore(name, score) {
    let scores = getScores();
    scores.push({ name: name, score: score });
    localStorage.setItem("scores", JSON.stringify(scores));
    displayScores();
}


// pontszámok megjelenítése táblában

function displayScores() {
    let leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";
    let scores = getScores(); //korábbi eredmények lekérése
    let rank = 1;
    for (let i = 0; i < scores.length && i < 10; i++) {
        let score = scores[i];
        let row = document.createElement("tr");
        row.innerHTML = `
      <td>${rank}</td>
      <td>${score.name}</td>
      <td>${score.score}</td>
    `;
        leaderboard.appendChild(row);
        rank++;
    }
}



//pontszámok gettere
function getScores() {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    return scores.sort((a, b) => b.score - a.score).slice(0, 10);
}




board.addEventListener("click", function(event) {
    let row = parseInt(event.target.getAttribute("data-row"));
    let col = parseInt(event.target.getAttribute("data-col"));
    //kattintott hely olyan cella, amelynek van row és col attribútuma és ezek számok
    if (!isNaN(row) && !isNaN(col)) {
        gameBoard.updateCells(row, col);
        gameBoard.draw();
        moves++;
        movesDisplay.innerHTML = moves;

        // animáció miatt hozzáadja a kattintott cellához a selected osztályt
        event.target.classList.add("selected");

        // animáció miatt hozzáadja a kattintott cellához a grow osztályt
        document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add("grow");

        //időzitett esemény, eltávolítja a grow és selected osztályt aktuális celláról
        setTimeout(() => {
            event.target.classList.remove("selected");
            document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.remove("grow");
        }, 200);

        if (gameBoard.isWon()) {
            //időzítő leállítása
            clearInterval(intervalId);
            let name = prompt("Gratulálok, nyertél! Írd be a neved:");
            while (name && name.length > 10) { // 10-nél hosszabb nevet írt be a felhasználó
                alert("A név maximum 10 karakter lehet!");
                name = prompt("Gratulálok, nyertél! Írd be a neved:");
            }
            if (name) { // megfelelő hosszúságú név lett megadva
                let score = calculateScore(elapsedTime, moves);
                saveScore(name, score);
                // Play win sound effect
                winAudio.play();
            }
            // Generálunk egy új játékot
            playAgain();
        } else {
            // kattintás hang lejátszása
            clickAudio.play();
        }
    }
});



//játékos pontszámának kiszámolása
function calculateScore(elapsedTime, moves) {
    const baseScore = 100;
    const timeScore = Math.round((500 - elapsedTime) / 10);
    const movesScore = moves;
    const totalScore = baseScore + timeScore - movesScore;
    return totalScore;
}





// Játék inic., tábla rajzolása
gameBoard.initialize();
gameBoard.draw();




// időzítő elindítása
intervalId = setInterval(function() {
    elapsedTime++;
    timerDisplay.innerHTML = elapsedTime;
}, 1000);


// Toplista megjelenítése oldal betöltésekor
window.onload = function () {
    displayScores();
};