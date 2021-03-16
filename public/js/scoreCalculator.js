class scoreCalculator {
    constructor() {}

    returnThePlayerThrow(checkCondition, throwInformation) {
        const previousThrow = throwInformation.throwHistory[throwInformation.throwHistory.length - 1]
        const pair = this.checkIfItIsAPair(checkCondition.itIsTheSecondThrow, throwInformation.score, previousThrow)
        const strike = this.checkIfItIsAStrike(throwInformation.score, throwInformation.throwHistory, throwInformation.IndexOfSlotToFill)
        let score = throwInformation.score

        if (pair) {
            score = "/"
        } else if (strike) {
            score = "X"
        }
        return score
    }

    checkIfThePlayerCanPlay(IndexOfSlotToFill, throwHistory) {
        let playerCanDoTheNextThrow = true
        if (IndexOfSlotToFill === 20) {
            if ((throwHistory[throwHistory.length - 1] + throwHistory[throwHistory.length - 2]) < 10) {
                playerCanDoTheNextThrow = false
            }
        }
        return playerCanDoTheNextThrow
    }

    checkIfItIsAStrike(score, throwHistory, IndexOfSlotToFill) {
        let itIsAStrike = false

        if (score === 10) {
            if (throwHistory[throwHistory.length - 1] === 0 && (IndexOfSlotToFill % 2) != 0) {
                itIsAStrike = false
            } else {
                itIsAStrike = true
            }
        }
        return itIsAStrike
    }

    checkIfItIsAPair(itIsTheSecondThrow, score, previousThrow) {
        let itIsAPair = false
        if (itIsTheSecondThrow && (score + previousThrow) === 10) {
            itIsAPair = true
        }
        return itIsAPair
    }

    checkIfThePlayerCanEnterThisScore(score, previousThrow, IndexOfSlotToFill) {
        let validScore = true
        if ((score + previousThrow) > 10 || previousThrow === "X" && IndexOfSlotToFill < 18) {
            validScore = false
        }
        return validScore
    }

    pushTheScoreInTheThrowHistory(throwHistory, score) {
        if (score == "/") {
            score = 10 - throwHistory[throwHistory.length - 1]
        }
        throwHistory.push(score)
    }

    pushTheScoreInTheFrameHistory(frameHistory, frameThrow) {
        if (frameThrow != undefined) {
            frameHistory.push(frameThrow)
        }
    }

    checkIfItIsTheSecondThrow(IndexOfSlotToFill) {
        let itIsTheSecondThrow = false
        if (IndexOfSlotToFill % 2 != 0) {
            itIsTheSecondThrow = true
        }
        return itIsTheSecondThrow
    }

    returnTheFrameScore(indexOfTheFirstThrowOfTheCurrentFrame, playerInformation) {
        const firstThrow = playerInformation.throwHistory[indexOfTheFirstThrowOfTheCurrentFrame]
        const secondThrow = playerInformation.throwHistory[indexOfTheFirstThrowOfTheCurrentFrame + 1]
        const thirdThrow = playerInformation.throwHistory[indexOfTheFirstThrowOfTheCurrentFrame + 2]
        const currentFrame = firstThrow + secondThrow
        let score = undefined

        const conditionForCalculateAStrike = firstThrow === "X" && secondThrow != null && thirdThrow != null
        const conditionForCalculateAPair = firstThrow != null && secondThrow != null && thirdThrow != null && currentFrame === 10
        const conditionForCalculANormalFrame = firstThrow != null && secondThrow != null && currentFrame != 10 && Number.isInteger(currentFrame)

        if (conditionForCalculateAStrike) {
            score = this.defineStrikeScore(playerInformation)
            playerInformation.indexOfTheFirstThrowOfTheCurrentFrame += 1
        } else if (conditionForCalculateAPair) {
            score = this.defineScoreWithTheThrirdThrow(thirdThrow, playerInformation)
            playerInformation.indexOfTheFirstThrowOfTheCurrentFrame += 2
        } else if (conditionForCalculANormalFrame) {
            score = currentFrame
            playerInformation.indexOfTheFirstThrowOfTheCurrentFrame += 2
        } else {
            score = undefined
        }

        return score
    }

    defineScoreWithTheThrirdThrow(thirdThrow, playerInformation) {
        let sumOfFrameScores = 0
        if (thirdThrow === "X") {
            sumOfFrameScores = 20
        } else {
            sumOfFrameScores = (10 + thirdThrow)
        }
        return sumOfFrameScores
    }

    defineStrikeScore(playerInformation) {
        let sumOfFrameScores = 0
        for (let i = 0; i < 3; i++) {
            if (playerInformation.throwHistory[playerInformation.indexOfTheFirstThrowOfTheCurrentFrame + i] === "X") {
                sumOfFrameScores += 10
            } else {
                sumOfFrameScores += playerInformation.throwHistory[playerInformation.indexOfTheFirstThrowOfTheCurrentFrame + i]
            }
        }
        return sumOfFrameScores
    }

    calculateActualTotalScore(playerInformation) {
        const frameHistory = playerInformation.frameHistory
        let totalScore = 0

        for (let i = 0; i < frameHistory.length; i++) {
            totalScore += frameHistory[i]
        }
        return totalScore
    }

    determinateDate() {
        let currentDateInformations = new Date()
        let month = (currentDateInformations.getMonth() + 1)
        if (month < 10) {
            month = "0" + month
        }
        return (currentDateInformations.getDate() + "/" + month + "/" + currentDateInformations.getFullYear())
    }

    checkCondition(throwInformation) {
        return {
            itIsTheSecondThrow: this.checkIfItIsTheSecondThrow(throwInformation.IndexOfSlotToFill),
            playerCanPlay: this.checkIfThePlayerCanPlay(throwInformation.IndexOfSlotToFill, throwInformation.throwHistory),
            validScore: this.checkIfThePlayerCanEnterThisScore(throwInformation.score, throwInformation.previousThrow, throwInformation.IndexOfSlotToFill)
        }
    }

    determinateIfPlayerCantDoTheThrow(checkCondition) {
        let errorMessage = null

        if (checkCondition.playerCanPlay === false) {
            errorMessage = "Vous avez atteint le nombre maximal de lancer"
        } else if (checkCondition.itIsTheSecondThrow && checkCondition.validScore == false) {
            errorMessage = "Vous avez ne pouvez pas faire tomber autant de quille"
        }
        return errorMessage
    }
}