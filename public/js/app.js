class bowlingGameManager {
    constructor() {
        this.playersInformations = [];
    }

    setStartButtonHandler() {
        const buttonStart = document.getElementById("startGame");

        buttonStart.addEventListener("click", (event) => {
            this.requestTheNumbersOfPlayers();
            buttonStart.style.display = "none";
            event.preventDefault();
        });
    }

    requestTheNumbersOfPlayers() {
        const form = document.getElementById("requestForm");
        const submitButton = document.getElementById("requestButton");
        const select = document.getElementById("requestSelect");

        form.style.display = "flex";

        submitButton.addEventListener("click", (event) => {
            this.askForPlayersNames(select.value);
            form.style.display = "none";
            event.preventDefault();
        });
    }

    askForPlayersNames(numberOfPlayers) {
        const form = document.getElementById("enterPlayerNameForm");
        const submitButton = document.getElementById("enterPlayerNameButton");

        for (let i = 0; i < numberOfPlayers; i++) {
            const label = document.getElementById("label_" + i);
            const input = document.getElementById("input_" + i);

            label.style.display = "block";
            input.style.display = "block";
        }

        form.style.display = "flex";

        submitButton.addEventListener("click", (event) => {
            if (this.checkIfThePlayersNamesAreValid(numberOfPlayers) === false) {
                this.changeDisplayedErrorMessage("Il y a un problème avec un pseudo!");
            } else {
                this.createThePlayerInformation(numberOfPlayers);
                this.displayTheScoreboardOfEachPlayer();
                this.setAbandonButtonHandler();
                this.changeDisplayedErrorMessage("");
                form.style.display = "none";
            }
            event.preventDefault();
        })
    }

    changeDisplayedErrorMessage(message) {
        const errorMessage = document.getElementById("errorMessage");

        errorMessage.innerHTML = message;
        errorMessage.style.display = "block";
    }

    checkIfThePlayersNamesAreValid(numberOfPlayers) {
        for (let i = 0; i < numberOfPlayers; i++) {
            const input = document.getElementById("input_" + i).value;

            let validName = input.match(/^[a-zA-Z]\w{3,20}$/g) // The string must be between 4 and 20 characters long. It accepts letters and numbers. No spaces or special characters.

            if (validName === null) {
                return false;
            }
        }
        return true;
    }

    createThePlayerInformation(numberOfPlayers) {
        for (let i = 0; i < numberOfPlayers; i++) {
            const input = document.getElementById("input_" + i).value;
            const playerInformation = { name: input, throwHistory: [], frameHistory: [], indexOfTheFirstThrowOfTheCurrentFrame: 0 }
            this.playersInformations.push(playerInformation);
        }
    }

    displayTheScoreboardOfEachPlayer() {
        const AllScoreboards = document.getElementById("AllScoreboards");
        AllScoreboards.style.display = "block";

        for (let playerNumero = 0; playerNumero < this.playersInformations.length; playerNumero++) {
            const scoreboard = document.getElementsByClassName("scoreboard")[playerNumero]
            const buttonAddThrow = document.getElementsByClassName("scoreboard_Button")[playerNumero];
            const displayedName = document.getElementsByClassName("scoreboard_Name")[playerNumero];

            displayedName.innerHTML = this.playersInformations[playerNumero].name;
            scoreboard.style.display = "block";

            buttonAddThrow.addEventListener("click", (event) => {
                const score = parseInt(document.getElementsByClassName("scoreboard_ScoreSelect")[playerNumero].value);
                this.addScoreToTheScoreboard(playerNumero, score);
                event.preventDefault();
            });
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
        const throwScoreboard = document.getElementsByClassName("throwScoreboard")[playerNumero];
        const box = throwScoreboard.getElementsByTagName("td");

        for (let i = 0; i < 21; i++) {
            if (box[i].innerHTML === "") {
                return i;
            }
        }
    }

    displayThePlayerThrow(playerNumero, IndexOfSlotToFill, score) {
        const throwScoreboard = document.getElementsByClassName("throwScoreboard")[playerNumero];
        const box = throwScoreboard.getElementsByTagName("td");

        if (score === "XX") {
            box[IndexOfSlotToFill].innerHTML = " ";
            box[IndexOfSlotToFill + 1].innerHTML = "X";
        } else if (score != null) {
            box[IndexOfSlotToFill].innerHTML = score;
        }
    }


    showFrameScore(playerNumero, score) {
        const frameScoreboard = document.getElementsByClassName("frameScoreboard")[playerNumero];
        const box = frameScoreboard.getElementsByTagName("td");

        if (score != null) {
            box[this.playersInformations[playerNumero].frameHistory.length - 1].innerHTML = score
        }
    }

    returnTheFrameScore(playerNumero) {
        const throwHistory = this.playersInformations[playerNumero].throwHistory;
        const indexOfTheFirstThrowOfTheCurrentFrame = this.playersInformations[playerNumero].indexOfTheFirstThrowOfTheCurrentFrame;
        const frameHistory = this.playersInformations[playerNumero].frameHistory;

        const firstThrow = throwHistory[indexOfTheFirstThrowOfTheCurrentFrame];
        const secondThrow = throwHistory[indexOfTheFirstThrowOfTheCurrentFrame + 1];
        const thirdThrow = throwHistory[indexOfTheFirstThrowOfTheCurrentFrame + 2];
        const currentFrame = firstThrow + secondThrow;

        if (firstThrow === "X") {
            if (secondThrow != null && thirdThrow != null) {
                let sumOfFrameScores = 0;
                for (let i = 0; i < 3; i++) {
                    if (throwHistory[indexOfTheFirstThrowOfTheCurrentFrame + i] === "X") {
                        sumOfFrameScores += 10
                    } else {
                        sumOfFrameScores += throwHistory[indexOfTheFirstThrowOfTheCurrentFrame + i]
                    }
                }
                frameHistory.push(sumOfFrameScores)
                this.playersInformations[playerNumero].indexOfTheFirstThrowOfTheCurrentFrame += 1;
                return frameHistory[frameHistory.length - 1]
            } else {
                return
            }
        } else if (firstThrow != null && secondThrow != null) {
            if (currentFrame === 10) {
                if (thirdThrow != null) {
                    if (thirdThrow === "X") {
                        frameHistory.push(20)
                    } else {
                        frameHistory.push((10 + thirdThrow))
                    }
                    this.playersInformations[playerNumero].indexOfTheFirstThrowOfTheCurrentFrame += 2;
                    return frameHistory[frameHistory.length - 1]
                } else {
                    return
                }
            }
            frameHistory.push(currentFrame)
            this.playersInformations[playerNumero].indexOfTheFirstThrowOfTheCurrentFrame += 2;
            return frameHistory[frameHistory.length - 1]
        }
    }

    showActualTotalScore(playerNumero, totalScore) {
        const throwScoreboard = document.getElementsByClassName("throwScoreboard")[playerNumero];
        const box = throwScoreboard.getElementsByTagName("td")[21]

        box.innerHTML = totalScore;
    }

    calculateActualTotalScore(playerNumero) {
        const frameHistory = this.playersInformations[playerNumero].frameHistory;
        let totalScore = 0;

        for (let i = 0; i < frameHistory.length; i++) {
            totalScore += frameHistory[i]
        }
        return totalScore;
    }

    setAbandonButtonHandler() {
        const buttonAbandon = document.getElementById("leaveButton");

        buttonAbandon.addEventListener("click", (event) => {
            document.location.reload();
            event.preventDefault();
        });
    }

}

// Lauch //

const BGM = new bowlingGameManager();

BGM.setStartButtonHandler();