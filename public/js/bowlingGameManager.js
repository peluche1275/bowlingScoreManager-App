class bowlingGameManager {
    constructor() {
        this.scoreCalculator = new scoreCalculator();
        this.scoreboard = new scoreboard();
        this.nameRegister = new nameRegister();
        this.formRequest = new formRequest();
        this.errorMessage = document.getElementById("errorMessage");
        this.numberOfPlayers = 0;
        this.playersInformations = [];
    }

    setStartButtonHandler() {
        this.formRequest.buttonStart.addEventListener("click", (event) => {
            this.requestTheNumbersOfPlayers();
            this.formRequest.buttonStart.style.display = "none";
            event.preventDefault();
        });
    }

    requestTheNumbersOfPlayers() {
        this.formRequest.form.style.display = "flex";
        this.formRequest.submitButton.addEventListener("click", (event) => {
            this.numberOfPlayers = this.formRequest.select.value;
            this.formRequest.form.style.display = "none";
            this.nameRegister.displayNameFields(this.numberOfPlayers);
            this.setSubmitButtonHandler();
            event.preventDefault();
        });
    }

    setSubmitButtonHandler() {
        this.nameRegister.submitButton.addEventListener("click", (event) => {
            if (this.nameRegister.checkIfThePlayersNamesAreValid(this.numberOfPlayers) === false) {
                this.errorMessage.innerHTML = "Il y a un problème avec un pseudo!";
            } else {
                this.playersInformations = this.scoreboard.createThePlayerInformation(this.numberOfPlayers);
                this.displayTheScoreboardOfEachPlayer();
                this.errorMessage.innerHTML = "";
                this.nameRegister.form.style.display = "none";
            }
            event.preventDefault();
        })
    }

    displayTheScoreboardOfEachPlayer() {
        for (let playerNumero = 0; playerNumero < this.numberOfPlayers; playerNumero++) {
            this.scoreboard.displayedNames[playerNumero].innerHTML = this.playersInformations[playerNumero].name;
            this.scoreboard.scoreboards[playerNumero].style.display = "block";
            this.setAbandonButtonHandler();

            this.scoreboard.buttonAddThrows[playerNumero].addEventListener("click", (event) => {

                const throwHistory = this.playersInformations[playerNumero].throwHistory;
                const IndexOfSlotToFill = this.scoreboard.defineTheIndexOfSlotToFill(playerNumero);
                const playerCanPlay = this.scoreCalculator.checkIfThePlayerCanPlay(IndexOfSlotToFill, throwHistory);
                const previousThrow = throwHistory[throwHistory.length - 1];
                const itIsTheSecondThrow = this.scoreCalculator.checkIfItIsTheSecondThrow(IndexOfSlotToFill);
                const score = parseInt(this.scoreboard.scoreSelect[playerNumero].value);
                const validScore = this.scoreCalculator.checkIfThePlayerCanEnterThisScore(score, previousThrow, IndexOfSlotToFill);

                if (playerCanPlay === false) {
                    this.errorMessage.innerHTML = "Vous avez atteint le nombre maximal de lancer";
                } else if (itIsTheSecondThrow && validScore == false) {
                    this.errorMessage.innerHTML = "Vous avez ne pouvez pas faire tomber autant de quille";
                } else {
                    this.playTheThrow(itIsTheSecondThrow, score, IndexOfSlotToFill, playerNumero, throwHistory);
                }

                event.preventDefault();
            });
        }
    }

    playTheThrow(itIsTheSecondThrow, score, IndexOfSlotToFill, playerNumero, throwHistory) {
        const playerThrow = this.scoreCalculator.returnThePlayerThrow(itIsTheSecondThrow, score, IndexOfSlotToFill, this.playersInformations[playerNumero]);

        this.scoreboard.displayThePlayerThrow(playerNumero, IndexOfSlotToFill, playerThrow);

        this.scoreCalculator.pushTheScoreInTheThrowHistory(throwHistory, playerThrow);

        const indexOfTheFirstThrowOfTheCurrentFrame = this.playersInformations[playerNumero].indexOfTheFirstThrowOfTheCurrentFrame;

        const frameHistory = this.playersInformations[playerNumero].frameHistory;

        const frameThrow = this.scoreCalculator.returnTheFrameScore(indexOfTheFirstThrowOfTheCurrentFrame, this.playersInformations[playerNumero]);

        this.scoreboard.showFrameScore(playerNumero, frameThrow, frameHistory);

        const totalScore = this.scoreCalculator.calculateActualTotalScore(this.playersInformations[playerNumero]);

        this.scoreboard.showActualTotalScore(playerNumero, totalScore);
    }

    setAbandonButtonHandler() {
        this.scoreboard.buttonAbandon.style.display = "block";
        this.scoreboard.buttonAbandon.addEventListener("click", (event) => {
            document.location.reload();
            event.preventDefault();
        });
    }
}