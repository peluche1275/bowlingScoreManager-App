class bowlingGameManager {
    constructor() {
        this.scoreCalculator = new scoreCalculator()
        this.dashboard = new dashboard()
        this.scoreboard = new scoreboard()
        this.nameRegister = new nameRegister()
        this.formRequest = new formRequest()
        this.messageDisplayer = new messageDisplayer()
        this.numberOfPlayers = 0
        this.playersInformations = []
    }

    setStartButtonHandler() {
        // this.formRequest.buttonStart.addEventListener("click", (event) => {
        //     this.requestTheNumbersOfPlayers()
        //     this.formRequest.buttonStart.style.display = "none"
        //     this.dashboard.dashboard.style.display = "none"
        //     event.preventDefault()
        // })

        this.addClickEvent(this.formRequest.buttonStart, this.test())
    }

    test() {
        this.requestTheNumbersOfPlayers()
        this.formRequest.buttonStart.style.display = "none"
        this.dashboard.dashboard.style.display = "none"
    }

    requestTheNumbersOfPlayers() {
        this.formRequest.form.style.display = "flex"
        this.formRequest.submitButton.addEventListener("click", (event) => {
            this.numberOfPlayers = this.formRequest.select.value
            this.formRequest.form.style.display = "none"
            this.nameRegister.displayNameFields(this.numberOfPlayers)
            this.setSubmitButtonHandler()
            event.preventDefault()
        })
    }

    setSubmitButtonHandler() {
        this.nameRegister.submitButton.addEventListener("click", (event) => {
            if (this.nameRegister.checkIfThePlayersNamesAreValid(this.numberOfPlayers) === false) {
                this.messageDisplayer.errorMessage.innerHTML = "Il y a un problème avec un pseudo!"
            } else {
                this.playersInformations = this.scoreboard.createThePlayerInformation(this.numberOfPlayers)
                this.displayTheScoreboardOfEachPlayer()
                this.messageDisplayer.errorMessage.innerHTML = ""
                this.nameRegister.form.style.display = "none"
            }
            event.preventDefault()
        })
    }

    displayTheScoreboardOfEachPlayer() {
        for (let playerNumero = 0; playerNumero < this.numberOfPlayers; playerNumero++) {
            this.scoreboard.displayedNames[playerNumero].innerHTML = this.playersInformations[playerNumero].name
            this.scoreboard.scoreboards[playerNumero].style.display = "block"

            this.setAbandonButtonHandler()
            this.setTheButtonAddThrow(playerNumero)
            this.setTheEnterScoreInTheDashboardButton(playerNumero)
            this.setTheSharingButton(playerNumero)
        }
    }

    setTheButtonAddThrow(playerNumero) {
        this.scoreboard.buttonAddThrows[playerNumero].addEventListener("click", (event) => {
            const throwInformation = this.scoreboard.defineAThrowInformation(this.playersInformations[playerNumero].throwHistory, playerNumero)
            const checkCondition = this.scoreCalculator.checkCondition(throwInformation)
            const playerCantPlay = this.scoreCalculator.determinateIfPlayerCantDoTheThrow(checkCondition)

            if (playerCantPlay != null) {
                this.messageDisplayer.errorMessage.innerHTML = playerCantPlay
            } else {
                this.playTheThrow(checkCondition, throwInformation)
                const indexOfCurrentSlot = throwInformation.IndexOfSlotToFill
                this.checkIfPlayerFinish(indexOfCurrentSlot, throwInformation)
                this.checkIfAllPlayersFinish()
            }
            event.preventDefault()
        })
    }

    setTheEnterScoreInTheDashboardButton(playerNumero) {
        const name = this.playersInformations[playerNumero].name
        const self = this

        this.scoreboard.buttonsEnterScore[playerNumero].addEventListener("click", function(event) {

            const date = self.scoreCalculator.determinateDate()
            const score = self.playersInformations[playerNumero].totalScore

            self.scoreboard.buttonsEnterScore[playerNumero].disabled = true
            self.scoreboard.buttonsEnterScore[playerNumero].innerHTML = "Envoyé!"

            const xhr = new XMLHttpRequest()
            xhr.open("POST", '/dashboard', true)
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
            xhr.send(JSON.stringify({ "name": name, "score": score, "date": date }))

            event.preventDefault()
        })
    }

    setTheSharingButton(playerNumero) {
        const self = this
        this.scoreboard.buttonsSharing[playerNumero].addEventListener("click", function(event) {
            const xhr = new XMLHttpRequest()

            let response = null

            self.scoreboard.buttonsSharing[playerNumero].disabled = true

            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    response = this.response
                }
            }

            const throwFilled = self.scoreboard.scoreboards[playerNumero].getElementsByClassName("throwScoreboard")[0]
            const td = throwFilled.getElementsByTagName("td")
            const throwHistory = []

            for (let i = 0; i < 21; i++) {
                if (td[i].innerHTML == null) {
                    throwHistory.push(" ")
                } else {
                    throwHistory.push(td[i].innerHTML)
                }
            }

            xhr.open("post", "/saveScore", false);

            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xhr.send(JSON.stringify({
                "name": self.playersInformations[playerNumero].name,
                "throwHistory": throwHistory,
                "frameHistory": self.playersInformations[playerNumero].frameHistory,
                "totalScore": self.playersInformations[playerNumero].totalScore
            }))

            self.scoreboard.buttonsTwitter[playerNumero].style.display = "block"
            self.scoreboard.buttonsTwitter[playerNumero].addEventListener("click", function() {
                window.location.href = ('https://twitter.com/intent/tweet?url=localhost:8080/score?id=' + response)
            })

            self.scoreboard.buttonsFacebook[playerNumero].style.display = "block"
            self.scoreboard.buttonsFacebook[playerNumero].addEventListener("click", function() {
                window.location.href = ('https://www.facebook.com/sharer/sharer.php?u=localhost:8080/score?id=' + response)
            })

            event.preventDefault()
        })
    }

    setAbandonButtonHandler() {
        this.scoreboard.buttonAbandon.style.display = "block"
        this.scoreboard.buttonAbandon.addEventListener("click", (event) => {
            document.location.reload()
            event.preventDefault()
        })
    }

    // A Déplacer

    playTheThrow(checkCondition, throwInformation) {
        const playerThrow = this.scoreCalculator.returnThePlayerThrow(checkCondition.itIsTheSecondThrow, throwInformation.score, throwInformation.IndexOfSlotToFill, this.playersInformations[throwInformation.playerNumero])
        this.scoreboard.displayThePlayerThrow(throwInformation.playerNumero, throwInformation.IndexOfSlotToFill, playerThrow)
        this.scoreCalculator.pushTheScoreInTheThrowHistory(throwInformation.throwHistory, playerThrow)
        const indexOfTheFirstThrowOfTheCurrentFrame = this.playersInformations[throwInformation.playerNumero].indexOfTheFirstThrowOfTheCurrentFrame
        const frameHistory = this.playersInformations[throwInformation.playerNumero].frameHistory
        const frameThrow = this.scoreCalculator.returnTheFrameScore(indexOfTheFirstThrowOfTheCurrentFrame, this.playersInformations[throwInformation.playerNumero])
        this.scoreboard.showFrameScore(throwInformation.playerNumero, frameThrow, frameHistory)
        const totalScore = this.scoreCalculator.calculateActualTotalScore(this.playersInformations[throwInformation.playerNumero])
        this.playersInformations[throwInformation.playerNumero].totalScore = totalScore
        this.scoreboard.showActualTotalScore(throwInformation.playerNumero, totalScore)
    }

    checkIfPlayerFinish(IndexOfCurrentSlot, throwInformation) {
        const condition1 = IndexOfCurrentSlot == 19 && (throwInformation.throwHistory[throwInformation.throwHistory.length - 1] + throwInformation.throwHistory[throwInformation.throwHistory.length - 2]) < 10
        const condition2 = IndexOfCurrentSlot == 20

        if (condition1 || condition2) {
            this.scoreboard.buttonAddThrows[throwInformation.playerNumero].disabled = true
            this.scoreboard.buttonsEnterScore[throwInformation.playerNumero].style.display = "block"
            this.scoreboard.buttonsSharing[throwInformation.playerNumero].style.display = "block"
            this.playersInformations[throwInformation.playerNumero].endOfTheGame = true
        }
    }

    checkIfAllPlayersFinish() {
        let allPlayersFinished = true
        this.playersInformations.forEach(playerInformation => {
            if (playerInformation.endOfTheGame == false) {
                allPlayersFinished = false
            }
        })

        if (allPlayersFinished) {
            this.showTheWinner()
        }
    }

    showTheWinner() {
        let betterScore = 0
        this.playersInformations.forEach(player => {
            if (player.totalScore > betterScore) {
                betterScore = player.totalScore
            }
        })
        let winners = []
        this.playersInformations.forEach(player => {
            if (player.totalScore == betterScore) {
                winners.push(player.name)
            }
        })

        if (winners.length == 1) {
            this.messageDisplayer.winMessage.innerHTML = "Bravo le gagnant est : " + winners[0]
        } else {
            this.messageDisplayer.winMessage.innerHTML = "Bravo les gagnants sont : " + winners.toString()
        }
    }

    addClickEvent(node, functionT) {
        node.addEventListener("click", (event) => {
            functionT
            event.preventDefault()
        })
    }

}