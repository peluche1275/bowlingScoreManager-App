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
        this.formRequest.buttonStart.addEventListener("click", (event) => {
            this.requestTheNumbersOfPlayers()
            this.formRequest.buttonStart.style.display = "none"
            this.dashboard.dashboard.style.display = "none"
            event.preventDefault()
        })
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
            const frameInformation = this.scoreboard.defineAframeInformation(throwInformation, this.playersInformations[playerNumero])
            const checkCondition = this.scoreCalculator.checkCondition(throwInformation)
            const playerCantPlay = this.scoreCalculator.determinateIfPlayerCantDoTheThrow(checkCondition)

            if (playerCantPlay != null) {
                this.messageDisplayer.errorMessage.innerHTML = playerCantPlay
            } else {
                const playerThrow = this.manageThePlayerThrow(checkCondition, throwInformation)
                const frameThrow = this.manageTheFrameThrow(frameInformation, playerNumero)
                const totalScore = this.manageTheTotalScore(throwInformation)

                this.scoreboard.updateTheScoreboardOnTheScreen(throwInformation, playerThrow, frameThrow, frameInformation.frameHistory, totalScore)
                this.tryToFinishTheGame(throwInformation)
            }
            event.preventDefault()
        })
    }

    manageTheFrameThrow(frameInformation, playerNumero) {
        const frameThrow = this.scoreCalculator.returnTheFrameScore(frameInformation.indexOfTheFirstThrowOfTheCurrentFrame, this.playersInformations[playerNumero])
        this.scoreCalculator.pushTheScoreInTheFrameHistory(frameInformation.frameHistory, frameThrow)
        return frameThrow
    }

    manageThePlayerThrow(checkCondition, throwInformation) {
        const playerThrow = this.scoreCalculator.returnThePlayerThrow(checkCondition, throwInformation)
        this.scoreCalculator.pushTheScoreInTheThrowHistory(throwInformation.throwHistory, playerThrow)
        return playerThrow
    }

    manageTheTotalScore(throwInformation) {
        const totalScore = this.scoreCalculator.calculateActualTotalScore(this.playersInformations[throwInformation.playerNumero])
        this.playersInformations[throwInformation.playerNumero].totalScore = totalScore
        return totalScore
    }

    tryToFinishTheGame(throwInformation) {
        const indexOfCurrentSlot = throwInformation.IndexOfSlotToFill
        this.checkIfPlayerFinish(indexOfCurrentSlot, throwInformation)
        this.checkIfAllPlayersFinish()
    }

    setTheEnterScoreInTheDashboardButton(playerNumero) {
        const name = this.playersInformations[playerNumero].name
        const self = this

        this.scoreboard.buttonsEnterScore[playerNumero].addEventListener("click", function(event) {

            const date = self.scoreCalculator.determinateDate()
            const score = self.playersInformations[playerNumero].totalScore

            self.scoreboard.buttonsEnterScore[playerNumero].disabled = true
            self.scoreboard.buttonsEnterScore[playerNumero].innerHTML = "Envoyé!"
            self.askToTheServerThePageDashboard(name, score, date)
            event.preventDefault()
        })
    }

    askToTheServerThePageDashboard(name, score, date) {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", '/dashboard', true)
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        xhr.send(JSON.stringify({ "name": name, "score": score, "date": date }))
    }

    setTheSharingButton(playerNumero) {
        const self = this
        this.scoreboard.buttonsSharing[playerNumero].addEventListener("click", function(event) {
            const throwHistory = self.searchTheThrowHistorySeeAtTheScreen(playerNumero)
            self.fillTheHistory(throwHistory)
            let response = null
            self.scoreboard.buttonsSharing[playerNumero].disabled = true
            response = self.askToTheServerThePageSaveScore(response, self, playerNumero, throwHistory)
            self.setSocialMedia(playerNumero, response)
            event.preventDefault()
        })
    }

    askToTheServerThePageSaveScore(response, self, playerNumero, throwHistory) {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                response = this.response
            }
        }
        xhr.open("post", "/saveScore", false)
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        xhr.send(JSON.stringify({
            "name": self.playersInformations[playerNumero].name,
            "throwHistory": throwHistory.history,
            "frameHistory": self.playersInformations[playerNumero].frameHistory,
            "totalScore": self.playersInformations[playerNumero].totalScore
        }))
        return response
    }

    setSocialMedia(playerNumero, response) {
        let urls = [
            'https://www.facebook.com/sharer/sharer.php?u=localhost:8080/score?id=',
            'https://twitter.com/intent/tweet?url=localhost:8080/score?id='
        ]

        let button = [
            this.scoreboard.buttonsFacebook[playerNumero],
            this.scoreboard.buttonsTwitter[playerNumero]
        ]

        for (let i = 0; i < urls.length; i++) {
            button[i].style.display = "block"
            button[i].addEventListener("click", function() {
                window.location.href = (urls[i] + response)
            })
        }
    }

    fillTheHistory(throwHistory) {
        for (let i = 0; i < 21; i++) {
            if (throwHistory.td[i].innerHTML == null) {
                throwHistory.history.push(" ")
            } else {
                throwHistory.history.push(throwHistory.td[i].innerHTML)
            }
        }
    }

    searchTheThrowHistorySeeAtTheScreen(playerNumero) {
        const throwFilled = this.scoreboard.scoreboards[playerNumero].getElementsByClassName("throwScoreboard")[0]
        const td = throwFilled.getElementsByTagName("td")
        const throwHistory = []
        return { td: td, history: throwHistory }
    }

    setAbandonButtonHandler() {
        this.scoreboard.buttonAbandon.style.display = "block"
        this.scoreboard.buttonAbandon.addEventListener("click", (event) => {
            document.location.reload()
            event.preventDefault()
        })
    }

    checkIfPlayerFinish(IndexOfCurrentSlot, throwInformation) {
        const lastSlotAfterNormalThrow = IndexOfCurrentSlot == 19 && (throwInformation.throwHistory[throwInformation.throwHistory.length - 1] + throwInformation.throwHistory[throwInformation.throwHistory.length - 2]) < 10
        const lastSlotAfterStrikeOrPair = IndexOfCurrentSlot == 20

        if (lastSlotAfterNormalThrow || lastSlotAfterStrikeOrPair) {
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
        let winners = []
        this.playersInformations.forEach(player => {
            if (player.totalScore > betterScore) {
                betterScore = player.totalScore
            }
        })
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
}