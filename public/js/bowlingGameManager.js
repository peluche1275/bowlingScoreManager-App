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
            document.getElementById("dashboard").style.display = "none"
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

            this.setTheButtonAddThrow(playerNumero);
            this.setTheEnterScoreInTheDashboardButton(playerNumero);
            this.setTheSharingButton(playerNumero);
        }
    }

    setTheButtonAddThrow(playerNumero) {
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
                const indexOfCurrentSlot = IndexOfSlotToFill;
                this.checkIfPlayerFinish(indexOfCurrentSlot, throwHistory, playerNumero);
                this.checkIfAllPlayersFinish();
            }

            event.preventDefault();
        });
    }

    setTheEnterScoreInTheDashboardButton(playerNumero) {
        const name = this.playersInformations[playerNumero].name
        const self = this;

        this.scoreboard.buttonsEnterScore[playerNumero].addEventListener("click", function(event) {

            const date = self.determinateDate();
            const score = self.playersInformations[playerNumero].totalScore;

            self.scoreboard.buttonsEnterScore[playerNumero].disabled = true;
            self.scoreboard.buttonsEnterScore[playerNumero].innerHTML = "Envoyé!";

            const xhr = new XMLHttpRequest();
            xhr.open("POST", '/dashboard', true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({ "name": name, "score": score, "date": date }));

            event.preventDefault();
        });
    }

    setTheSharingButton(playerNumero) {
        const self = this;
        this.scoreboard.buttonsSharing[playerNumero].addEventListener("click", function(event) {
                const xhr = new XMLHttpRequest();

                let response = null;

                self.scoreboard.buttonsSharing[playerNumero].disabled = true;

                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        response = this.response
                    }
                }

                const throwFilled = self.scoreboard.scoreboards[playerNumero].getElementsByClassName("throwScoreboard")[0];
                const td = throwFilled.getElementsByTagName("td")
                const throwHistory = []

                for (let i = 0; i < 21; i++) {
                    if (td[i].innerHTML == null) {
                        throwHistory.push(" ");
                    } else {
                        throwHistory.push(td[i].innerHTML);
                    }
                }

                xhr.open("post", "/saveScore", false);

                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                xhr.send(JSON.stringify({
                    "name": self.playersInformations[playerNumero].name,
                    "throwHistory": throwHistory,
                    "frameHistory": self.playersInformations[playerNumero].frameHistory,
                    "totalScore": self.playersInformations[playerNumero].totalScore
                }));

                console.log(response)
                self.scoreboard.buttonsTwitter[playerNumero].style.display = "block"
                self.scoreboard.buttonsTwitter[playerNumero].addEventListener("click", function() {
                    window.location.href = ('https://twitter.com/intent/tweet?url=localhost:8080/score?id=' + response)
                })

                self.scoreboard.buttonsFacebook[playerNumero].style.display = "block"
                self.scoreboard.buttonsFacebook[playerNumero].addEventListener("click", function() {
                    window.location.href = ('https://www.facebook.com/sharer/sharer.php?u=localhost:8080/score?id=' + response)
                })

                event.preventDefault();
            }

        );
    }

    determinateDate() {
        let current = new Date();
        let month = (current.getMonth() + 1);
        if (month < 10) {
            month = "0" + month;
        }
        return (current.getDate() + "/" + month + "/" + current.getFullYear());
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
        this.playersInformations[playerNumero].totalScore = totalScore;
        this.scoreboard.showActualTotalScore(playerNumero, totalScore);
    }

    checkIfPlayerFinish(IndexOfCurrentSlot, throwHistory, playerNumero) {
        if (IndexOfCurrentSlot == 19) {
            if ((throwHistory[throwHistory.length - 1] + throwHistory[throwHistory.length - 2]) < 10) {
                this.scoreboard.buttonAddThrows[playerNumero].disabled = true;
                this.scoreboard.buttonsEnterScore[playerNumero].style.display = "block";
                this.scoreboard.buttonsSharing[playerNumero].style.display = "block";
                this.playersInformations[playerNumero].endOfTheGame = true;
            }
        } else if (IndexOfCurrentSlot == 20) {
            this.scoreboard.buttonAddThrows[playerNumero].disabled = true;
            this.scoreboard.buttonsEnterScore[playerNumero].style.display = "block";
            this.scoreboard.buttonsSharing[playerNumero].style.display = "block";
            this.playersInformations[playerNumero].endOfTheGame = true;
        }
    }

    checkIfAllPlayersFinish() {
        let allPlayersFinished = true;
        this.playersInformations.forEach(playerInformation => {
            if (playerInformation.endOfTheGame == false) {
                allPlayersFinished = false;
            }
        });

        if (allPlayersFinished) {
            this.showTheWinner();
        };
    }

    showTheWinner() {
        let betterScore = 0;
        this.playersInformations.forEach(player => {
            if (player.totalScore > betterScore) {
                betterScore = player.totalScore;
            }
        });
        let winners = []
        this.playersInformations.forEach(player => {
            if (player.totalScore == betterScore) {
                winners.push(player.name);
            }
        });

        if (winners.length == 1) {
            document.getElementById("winMessage").innerHTML = "Bravo le gagnant est : " + winners[0];
        } else {
            document.getElementById("winMessage").innerHTML = "Bravo les gagnants sont : " + winners.toString();
        }

    }

    setAbandonButtonHandler() {
        this.scoreboard.buttonAbandon.style.display = "block";
        this.scoreboard.buttonAbandon.addEventListener("click", (event) => {
            document.location.reload();
            event.preventDefault();
        });
    }
}