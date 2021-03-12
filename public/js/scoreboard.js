class scoreboard {
    constructor() {
        this.scoreboards = document.getElementsByClassName("scoreboard");
        this.buttonAddThrows = document.getElementsByClassName("scoreboard_Button");
        this.displayedNames = document.getElementsByClassName("scoreboard_Name");
        this.scoreSelect = document.getElementsByClassName("scoreboard_ScoreSelect")
        this.throwScoreboard = document.getElementsByClassName("throwScoreboard")
        this.buttonAbandon = document.getElementById("leaveButton");
    }

    setTheScoreboard() {
        this.displayTheScoreboardOfEachPlayer();
    }

    createThePlayerInformation(numberOfPlayers) {
        for (let i = 0; i < numberOfPlayers; i++) {
            const input = document.getElementById("input_" + i).value;
            const arrayToReturn = [];
            const playerInformation = { name: input, throwHistory: [], frameHistory: [], indexOfTheFirstThrowOfTheCurrentFrame: 0 }
            arrayToReturn.push(playerInformation);
            return arrayToReturn;
        }
    }

    addScoreToTheScoreboard(playerNumero, score) {
        const IndexOfSlotToFill = this.defineTheIndexOfSlotToFill(playerNumero);
        const playerThrow = this.returnThePlayerThrow(playerNumero, score, IndexOfSlotToFill);
        const frameScore = this.returnTheFrameScore(playerNumero);
        const actualTotalScore = this.calculateActualTotalScore(playerNumero);

        this.displayThePlayerThrow(playerNumero, IndexOfSlotToFill, playerThrow);
        this.showFrameScore(playerNumero, frameScore);
        this.showActualTotalScore(playerNumero, actualTotalScore);
    }

    defineTheIndexOfSlotToFill(playerNumero) {
        const box = this.throwScoreboard[playerNumero].getElementsByTagName("td");

        for (let i = 0; i < 21; i++) {
            if (box[i].innerHTML === "") {
                return i;
            }
        }
    }

    displayThePlayerThrow(playerNumero, IndexOfSlotToFill, score) {
        const throwScoreboard = document.getElementsByClassName("throwScoreboard")[playerNumero];
        const box = throwScoreboard.getElementsByTagName("td");

        if (score === "X" && IndexOfSlotToFill < 17) {
            box[IndexOfSlotToFill].innerHTML = " ";
            box[IndexOfSlotToFill + 1].innerHTML = "X";
        } else if (score != null) {
            box[IndexOfSlotToFill].innerHTML = score;
        }
    }

    showFrameScore(playerNumero, score, frameHistory) {
        const frameScoreboard = document.getElementsByClassName("frameScoreboard")[playerNumero];
        const box = frameScoreboard.getElementsByTagName("td");

        if (score != null) {
            box[frameHistory.length - 1].innerHTML = score
        }
    }

    showActualTotalScore(playerNumero, totalScore) {
        const throwScoreboard = document.getElementsByClassName("throwScoreboard")[playerNumero];
        const box = throwScoreboard.getElementsByTagName("td")[21]

        box.innerHTML = totalScore;
    }



}